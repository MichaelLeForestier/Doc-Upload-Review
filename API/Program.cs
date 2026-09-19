using System.Text;
using Microsoft.Extensions.Options;
using OllamaPdfService;
using OllamaPdfService.Options;
using UglyToad.PdfPig;

public record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public class Program
{
    private const string FrontendCorsPolicy = "Frontend";

    public static void Main(string[] args)
    {
        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddOpenApi();

        // ============================================
        // CORS: allow the React dev server to call this API
        // Override via appsettings.json: "Cors": { "AllowedOrigins": [ "http://localhost:3000" ] }
        // ============================================
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                             ?? new[] { "http://localhost:3000" };

        builder.Services.AddCors(o => o.AddPolicy(FrontendCorsPolicy, policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()));

        // ============================================
        // OLLAMA AI Configuration
        // ============================================
        builder.Services.Configure<OllamaPdfOptions>(builder.Configuration.GetSection("Ollama"));

        builder.Services.AddHttpClient<IOllamaPdfClient, OllamaPdfClient>((sp, client) =>
        {
            var options = sp.GetRequiredService<IOptions<OllamaPdfOptions>>().Value;

            if (Uri.TryCreate(options.Endpoint, UriKind.Absolute, out var endpoint))
            {
                client.BaseAddress = endpoint;
            }

            // Frontend waits up to 120s, so don't cut the model off earlier than that
            client.Timeout = TimeSpan.FromSeconds(120);
        });

        builder.Services.AddScoped<PdfAnalyzer>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }
        else
        {
            // In development the React app calls plain http://localhost; a redirect
            // to HTTPS would break the CORS preflight request.
            app.UseHttpsRedirection();
        }

        // Must come before the endpoints
        app.UseCors(FrontendCorsPolicy);

        app.MapPost("/api/analyze-pdf", async (
            IFormFileCollection formFiles,
            PdfAnalyzer pdfAnalyzer,
            IOptions<OllamaPdfOptions> ollamaOptions,
            ILogger<Program> logger) =>
        {
            // The React app reads err.response.data.message, so always return { message }
            if (!ollamaOptions.Value.Enabled)
            {
                return Results.Json(
                    new { message = "PDF analysis is currently disabled. Please enable it in configuration." },
                    statusCode: StatusCodes.Status404NotFound);
            }

            if (formFiles.Count == 0)
            {
                return Results.BadRequest(new { message = "No PDF file provided." });
            }

            var file = formFiles[0];

            if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                return Results.BadRequest(new { message = "Only PDF files are supported." });
            }

            try
            {
                // PDFs are binary: reading them with StreamReader produces garbage.
                // Extract the text with PdfPig instead.
                using var ms = new MemoryStream();
                await file.CopyToAsync(ms);
                ms.Position = 0;

                var text = new StringBuilder();
                using (var pdf = PdfDocument.Open(ms))
                {
                    foreach (var page in pdf.GetPages())
                    {
                        text.AppendLine(page.Text);
                    }
                }

                var fileContent = text.ToString();
                if (string.IsNullOrWhiteSpace(fileContent))
                {
                    return Results.BadRequest(new
                    {
                        message = "No text could be extracted. The PDF may be a scanned image."
                    });
                }

                logger.LogInformation("Analyzing PDF: {FileName}", file.FileName);

                var result = await pdfAnalyzer.AnalyzeAsync(fileContent);

                return Results.Ok(new
                {
                    thinking = result.Thinking ?? new[] { "Processing" },
                    answer = result.Answer,
                    fileName = file.FileName
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "PDF analysis error");

                return Results.Json(
                    new { message = "PDF analysis failed. Check that Ollama is running and try again." },
                    statusCode: StatusCodes.Status503ServiceUnavailable);
            }
        })
        .DisableAntiforgery(); // required for IFormFile binding in minimal APIs (.NET 8+)

        app.MapGet("/weatherforecast", () =>
        {
            var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast(
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]))
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");

        app.Run();
    }
}
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using OllamaPdfService.Options;

namespace OllamaPdfService;

/// <summary>
/// HTTP client for communicating with the Ollama API.
/// </summary>
public interface IOllamaPdfClient
{
    /// <summary>
    /// Generate a response from an Ollama model.
    /// </summary>
    Task<OllamaResponse> GenerateAsync(string prompt, int maxTokens = 2048, bool stream = false);

    /// <summary>
    /// Call the chat completions endpoint for conversational interactions.
    /// </summary>
    Task<OllamaChatResponse> ChatCompleteAsync(IReadOnlyCollection<ChatMessage> messages, string model);
}

public class OllamaPdfClient : IOllamaPdfClient
{
    // Must be large enough for the document (PdfAnalyzer caps it at ~12k chars, roughly 3-4k tokens)
    // plus the instructions and the reply. Ollama's default window is much smaller and silently
    // drops the start of the prompt when it overflows.
    private const int ContextWindowTokens = 8192;

    private readonly HttpClient _httpClient;
    private readonly OllamaPdfOptions _options;

    public OllamaPdfClient(HttpClient httpClient, IOptions<OllamaPdfOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;

        EnsureConfigured();
    }

    private void EnsureConfigured()
    {
        if (string.IsNullOrEmpty(_options.Endpoint))
        {
            throw new InvalidOperationException("Ollama endpoint not configured");
        }

        if (string.IsNullOrEmpty(_options.Model))
        {
            throw new InvalidOperationException("Ollama model not configured");
        }
    }

    public async Task<OllamaResponse> GenerateAsync(string prompt, int maxTokens = 2048, bool stream = false)
    {
        EnsureConfigured();

        // The response parsing below expects a single JSON object, not a stream of lines.
        if (stream)
        {
            throw new NotSupportedException("Streaming responses are not supported by this client.");
        }

        // Content-Type is a *content* header. It is set by StringContent below;
        // adding it to request.Headers throws "Misused header name".
        var payload = new
        {
            model = _options.Model,
            prompt,
            stream = false,
            // No `format = "json"` here: that forces the model to reply in JSON,
            // but we want a plain-text summary.
            options = new
            {
                temperature = _options.Temperature,
                num_predict = maxTokens,
                num_ctx = ContextWindowTokens
            }
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "api/generate")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        try
        {
            using var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException($"Ollama API error: {response.StatusCode} - {errorBody}");
            }

            var content = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(content);
            var root = document.RootElement;

            var text = root.TryGetProperty("response", out var r) ? r.GetString() ?? "" : "";
            var done = root.TryGetProperty("done", out var d) && d.GetBoolean();

            return new OllamaResponse(text, done);
        }
        catch (Exception ex) when (ex is not HttpRequestException)
        {
            throw new InvalidOperationException($"Failed to call Ollama API: {ex.Message}", ex);
        }
    }

    public async Task<OllamaChatResponse> ChatCompleteAsync(IReadOnlyCollection<ChatMessage> messages, string model)
    {
        EnsureConfigured();

        var effectiveModel = string.IsNullOrEmpty(model) ? _options.Model : model;

        var payload = new
        {
            model = effectiveModel,
            messages = messages.Select(m =>
            {
                var msg = new Dictionary<string, string>
                {
                    ["role"] = m.Role,
                    ["content"] = m.Content
                };

                // Only send "name" when there is one; an empty name can be rejected.
                if (!string.IsNullOrEmpty(m.Name))
                {
                    msg["name"] = m.Name;
                }

                return msg;
            })
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "v1/chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
        };

        using var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Chat completions error: {response.StatusCode} - {errorBody}");
        }

        var content = await response.Content.ReadAsStringAsync();
        using var document = JsonDocument.Parse(content);

        return new OllamaChatResponse(
            document.RootElement.GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "");
    }
}

/// <summary>
/// Message used in the Ollama chat completions API.
/// </summary>
public record ChatMessage(string Content, string Role = "user", string? Name = null);

/// <summary>
/// Response from the Ollama generate endpoint.
/// </summary>
public record OllamaResponse(string Response, bool Done);

/// <summary>
/// Response from the Ollama chat completions endpoint.
/// </summary>
public record OllamaChatResponse(string Content);
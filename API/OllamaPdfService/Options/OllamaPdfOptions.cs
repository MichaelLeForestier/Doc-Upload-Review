// Ollama PDF Analysis Configuration Options
namespace OllamaPdfService.Options;

/// <summary>
/// Configuration options for Ollama AI client.
/// </summary>
public class OllamaPdfOptions
{
    public string Endpoint { get; set; } = "";
    public string Model { get; set; } = "";
    public float Temperature { get; set; } = 0.7f;
    public bool Enabled { get; set; } = true;
}

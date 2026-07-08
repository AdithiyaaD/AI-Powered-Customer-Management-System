using System.Text.Json;
using System.Text.Json.Serialization;

public class AiGridResponse
{
    [JsonPropertyName("filterModel")]
    public JsonElement? FilterModel { get; set; }

    [JsonPropertyName("sortModel")]
    public JsonElement? SortModel { get; set; }

    [JsonPropertyName("columnState")]
    public JsonElement? ColumnState { get; set; }

    [JsonPropertyName("aggregations")]
    public JsonElement? Aggregations { get; set; }
}


using System;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class GeminiService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public GeminiService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public async Task<AiGridResponse> InterpretPrompt(string prompt, CancellationToken cancellationToken = default)
    {
        var apiKey = _config["Gemini:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("Gemini API key is not configured.");

        var systemPrompt = """
You convert user requests into AG Grid filter, sort, column state and aggregation models.
Return ONLY valid JSON (no explanation, no markdown, no text).
If unsure, respond with an empty object or the best possible model, but still valid JSON.

Allowed columns and types (use these exact column ids):
- customerId (number)
- customerName (text)
- customerEmail (text)
- customerPhone (text)
- dob (date)            <-- "dob" means date of birth; accept synonyms "date of birth", "birthdate"
- totalOrders (number)
- isActive (boolean)

Rules:
1. Always return a JSON object with these top-level properties (use empty object / array if not needed):
   {
     "filterModel": { /* ag-grid filter model mapping colId -> filter object */ },
     "sortModel": [ /* array of { "colId": "<columnId>", "sort": "asc"|"desc" } */ ],
     "columnState": [ /* optional: array of { "colId": "<columnId>", "hide": true|false, "width": <number> } */ ],
     "aggregations": { /* optional: e.g. "totalOrders": ["sum","avg"] */ }
   }

2. Map natural language to column ids:
   - "date of birth", "birth date", "birthdate" -> "dob"
   - "name" -> "customerName"
   - "email" -> "customerEmail"
   - "phone" -> "customerPhone"
   - synonyms should use the allowed column ids in the output.

3. Sorting: return one or more objects in "sortModel" in priority order.

4. Filtering: produce ag-grid filter objects.

5. Aggregations: for numeric fields only.

6. Column visibility/size example:
   "columnState": [ { "colId": "customerEmail", "hide": true }, { "colId": "customerId", "width": 60 } ]

7. Examples (RETURN EXACTLY JSON, do not wrap in markdown):
   Example: sort by date of birth ascending
   { "filterModel": {}, "sortModel": [ { "colId": "dob", "sort": "asc" } ], "columnState": [], "aggregations": {} }

   Example: multi-sort and aggregation
   {
     "filterModel": { "isActive": { "filterType": "boolean", "type": "equals", "filter": true } },
     "sortModel": [ { "colId": "totalOrders", "sort": "desc" }, { "colId": "customerName", "sort": "asc" } ],
     "columnState": [ { "colId": "customerEmail", "hide": true } ],
     "aggregations": { "totalOrders": ["sum","avg"] }
   }

   Example: show all columns, reset columns, or unhide all
   {
     "filterModel": {},
     "sortModel": [],
     "columnState": [
       { "colId": "customerId", "hide": false },
       { "colId": "customerName", "hide": false },
       { "colId": "customerEmail", "hide": false },
       { "colId": "customerPhone", "hide": false },
       { "colId": "dob", "hide": false },
       { "colId": "totalOrders", "hide": false },
       { "colId": "isActive", "hide": false }
     ],
     "aggregations": {}
   }

Return only the JSON object above that follows these rules.
`;var systemPrompt = `
You convert user requests into AG Grid filter, sort, column state and aggregation models.
Return ONLY valid JSON (no explanation, no markdown, no text).
If unsure, respond with an empty object or the best possible model, but still valid JSON.

Allowed columns and types (use these exact column ids):
- customerId (number)
- customerName (text)
- customerEmail (text)
- customerPhone (text)
- dob (date)            <-- "dob" means date of birth; accept synonyms "date of birth", "birthdate"
- totalOrders (number)
- isActive (boolean)

Rules:
1. Always return a JSON object with these top-level properties (use empty object / array if not needed):
   {
     "filterModel": { /* ag-grid filter model mapping colId -> filter object */ },
     "sortModel": [ /* array of { "colId": "<columnId>", "sort": "asc"|"desc" } */ ],
     "columnState": [ /* optional: array of { "colId": "<columnId>", "hide": true|false, "width": <number> } */ ],
     "aggregations": { /* optional: e.g. "totalOrders": ["sum","avg"] */ }
   }

2. Map natural language to column ids:
   - "date of birth", "birth date", "birthdate" -> "dob"
   - "name" -> "customerName"
   - "email" -> "customerEmail"
   - "phone" -> "customerPhone"
   - synonyms should use the allowed column ids in the output.

3. Sorting: return one or more objects in "sortModel" in priority order.

4. Filtering: produce ag-grid filter objects.

5. Aggregations: for numeric fields only.

6. Column visibility/size example:
   "columnState": [ { "colId": "customerEmail", "hide": true }, { "colId": "customerId", "width": 60 } ]

7. Examples (RETURN EXACTLY JSON, do not wrap in markdown):
   Example: sort by date of birth ascending
   { "filterModel": {}, "sortModel": [ { "colId": "dob", "sort": "asc" } ], "columnState": [], "aggregations": {} }

   Example: multi-sort and aggregation
   {
     "filterModel": { "isActive": { "filterType": "boolean", "type": "equals", "filter": true } },
     "sortModel": [ { "colId": "totalOrders", "sort": "desc" }, { "colId": "customerName", "sort": "asc" } ],
     "columnState": [ { "colId": "customerEmail", "hide": true } ],
     "aggregations": { "totalOrders": ["sum","avg"] }
   }

   Example: show all columns, reset columns, or unhide all
   {
     "filterModel": {},
     "sortModel": [],
     "columnState": [
       { "colId": "customerId", "hide": false },
       { "colId": "customerName", "hide": false },
       { "colId": "customerEmail", "hide": false },
       { "colId": "customerPhone", "hide": false },
       { "colId": "dob", "hide": false },
       { "colId": "totalOrders", "hide": false },
       { "colId": "isActive", "hide": false }
     ],
     "aggregations": {}
   }

Return only the JSON object above that follows these rules.
""";

        var body = new
        {
            contents = new[]
            {
                new {
                    parts = new[]
                    {
                        new { text = systemPrompt },
                        new { text = prompt }
                    }
                }
            }
        };

        var modelName = "models/gemini-2.5-flash";
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"https://generativelanguage.googleapis.com/v1beta/{modelName}:generateContent?key={apiKey}"
        );

        request.Headers.Accept.Clear();
        request.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
        request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        using var response = await _http.SendAsync(request, cancellationToken);
        var raw = await response.Content.ReadAsStringAsync(cancellationToken);

        Console.WriteLine("Gemini raw response:");
        Console.WriteLine(raw);

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Gemini API error: {response.StatusCode}. Body: {raw}");
        }
        string? text = null;
        try
        {
            using var doc = JsonDocument.Parse(raw);
            var root = doc.RootElement;

            if (root.TryGetProperty("candidates", out var candidates) && candidates.ValueKind == JsonValueKind.Array
                && candidates.GetArrayLength() > 0)
            {
                var candidate = candidates[0];
                if (candidate.TryGetProperty("content", out var content)
                    && content.TryGetProperty("parts", out var parts)
                    && parts.ValueKind == JsonValueKind.Array
                    && parts.GetArrayLength() > 0
                    && parts[0].TryGetProperty("text", out var textElem))
                {
                    text = textElem.GetString();
                }
            }

            if (text == null && root.TryGetProperty("output", out var output) && output.ValueKind == JsonValueKind.Array && output.GetArrayLength() > 0)
            {
                var o0 = output[0];
                if (o0.TryGetProperty("content", out var oc) && oc.ValueKind == JsonValueKind.Array && oc.GetArrayLength() > 0)
                {
                    if (oc[0].TryGetProperty("text", out var t2))
                        text = t2.GetString();
                }
            }

            if (text == null && root.TryGetProperty("text", out var tRoot))
            {
                text = tRoot.GetString();
            }
        }
        catch (JsonException)
        {
        }

        if (string.IsNullOrWhiteSpace(text))
        {
            var trimmed = raw.Trim();
            var start = trimmed.IndexOfAny(new[] { '{', '[' });
            var end = trimmed.LastIndexOfAny(new[] { '}', ']' });
            if (start >= 0 && end > start)
            {
                text = trimmed.Substring(start, end - start + 1);
            }
        }

        if (string.IsNullOrWhiteSpace(text))
            throw new Exception("Gemini returned no textual content to parse.");

        text = text.Replace("```json", "", StringComparison.OrdinalIgnoreCase)
                   .Replace("```", "")
                   .Trim();

        var firstJsonIndex = text.IndexOfAny(new[] { '{', '[' });
        var lastJsonIndex = text.LastIndexOfAny(new[] { '}', ']' });
        if (firstJsonIndex >= 0 && lastJsonIndex > firstJsonIndex)
        {
            text = text.Substring(firstJsonIndex, lastJsonIndex - firstJsonIndex + 1);
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        AiGridResponse? result = null;
        try
        {
            result = JsonSerializer.Deserialize<AiGridResponse>(text, options);
        }
        catch (JsonException jex)
        {
            throw new Exception($"Failed to parse Gemini JSON: {jex.Message}. JSON snippet: {text}");
        }

        if (result == null)
            throw new Exception("Failed to deserialize Gemini JSON into AiGridResponse.");

        if ((result.FilterModel == null || result.FilterModel.Value.ValueKind == JsonValueKind.Undefined) &&
            (result.SortModel == null || result.SortModel.Value.ValueKind == JsonValueKind.Undefined) &&
            (result.ColumnState == null || result.ColumnState.Value.ValueKind == JsonValueKind.Undefined) &&
            (result.Aggregations == null || result.Aggregations.Value.ValueKind == JsonValueKind.Undefined))
        {
            Console.WriteLine("Warning: AI response did not contain filterModel/sortModel/columnState/aggregations.");
        }

        return result;
    }
}

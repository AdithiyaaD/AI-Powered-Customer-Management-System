using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly GeminiService _gemini;

    public AiController(GeminiService gemini)
    {
        _gemini = gemini;
    }

    [HttpPost("interpret")]
    public async Task<IActionResult> Interpret([FromBody] AiRequest request)
    {
        var result = await _gemini.InterpretPrompt(request.Prompt);
        return Ok(result);
    }
}

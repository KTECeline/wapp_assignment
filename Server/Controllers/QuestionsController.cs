using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public QuestionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<Question>>> GetQuestionsByCourse(int courseId)
    {
        return await _context.Questions
            .Where(q => q.CourseId == courseId && !q.Deleted)
            .ToListAsync();
    }

    // DTOs for accepting richer payloads from the frontend
    public class OptionPayload {
        public string? OptionText { get; set; }
        public string? OptionImg { get; set; }
    }

    public class CreateQuestionDto {
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public int CourseId { get; set; }
        // optional image url for the question (if provided)
        public string? QuestionImg { get; set; }
        public List<OptionPayload>? Options { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion([FromBody] CreateQuestionDto dto)
    {
        try {
            Console.WriteLine("[DEBUG] CreateQuestion received: QuestionType={0}, QuestionImg={1}, OptionsCount={2}", dto.QuestionType, dto.QuestionImg, dto.Options?.Count ?? 0);
            if (dto.Options != null)
            {
                for (int i = 0; i < dto.Options.Count; i++)
                {
                    var o = dto.Options[i];
                    Console.WriteLine($"[DEBUG] Option {i}: OptionText='{o?.OptionText}', OptionImg='{o?.OptionImg}'");
                }
            }
        } catch (Exception ex) {
            Console.Error.WriteLine($"[DEBUG] Failed logging CreateQuestion DTO: {ex}");
        }
        var question = new Question {
            QuestionText = dto.QuestionText ?? string.Empty,
            QuestionType = dto.QuestionType ?? string.Empty,
            CourseId = dto.CourseId,
            Deleted = false
        };

        // Clear navigation property to avoid validation issues
        question.Course = null!;
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        // Persist options according to question type
        if (dto.Options != null && dto.Options.Count > 0)
        {
            try {
                var type = (dto.QuestionType ?? string.Empty).ToLowerInvariant();
                if (type == "mcq")
                {
                    var mcq = new McqQuestion();
                    mcq.QuestionId = question.QuestionId;
                    mcq.QuestionMedia = dto.QuestionImg ?? string.Empty;
                    mcq.Option1 = dto.Options.ElementAtOrDefault(0)?.OptionText ?? dto.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    mcq.Option2 = dto.Options.ElementAtOrDefault(1)?.OptionText ?? dto.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    mcq.Option3 = dto.Options.ElementAtOrDefault(2)?.OptionText ?? dto.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    mcq.Option4 = dto.Options.ElementAtOrDefault(3)?.OptionText ?? dto.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    mcq.QuestionAnswer = string.Empty;
                    _context.Add(mcq);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var dd = new DragDropQuestion();
                    dd.QuestionId = question.QuestionId;
                    // map up to 4 options
                    dd.Option1 = dto.Options.ElementAtOrDefault(0)?.OptionText ?? dto.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    dd.Option2 = dto.Options.ElementAtOrDefault(1)?.OptionText ?? dto.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    dd.Option3 = dto.Options.ElementAtOrDefault(2)?.OptionText ?? dto.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    dd.Option4 = dto.Options.ElementAtOrDefault(3)?.OptionText ?? dto.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    dd.Item1 = string.Empty;
                    dd.Item2 = string.Empty;
                    dd.Item3 = string.Empty;
                    dd.Item4 = string.Empty;
                    _context.DragDropQuestions.Add(dd);
                    await _context.SaveChangesAsync();
                }
            } catch (Exception ex) {
                // don't block question creation if options persist fails
                Console.Error.WriteLine($"Failed saving options for question: {ex}");
            }
        }

        return CreatedAtAction(nameof(GetQuestionsByCourse), new { courseId = question.CourseId }, question);
    }

    public class UpdateQuestionDto {
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public string? QuestionImg { get; set; }
        public List<OptionPayload>? Options { get; set; }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateQuestionDto update)
    {
        try {
            Console.WriteLine("[DEBUG] UpdateQuestion received for id={0}: QuestionType={1}, QuestionImg={2}, OptionsCount={3}", id, update.QuestionType, update.QuestionImg, update.Options?.Count ?? 0);
            if (update.Options != null)
            {
                for (int i = 0; i < update.Options.Count; i++)
                {
                    var o = update.Options[i];
                    Console.WriteLine($"[DEBUG] Update Option {i}: OptionText='{o?.OptionText}', OptionImg='{o?.OptionImg}'");
                }
            }
        } catch (Exception ex) {
            Console.Error.WriteLine($"[DEBUG] Failed logging UpdateQuestion DTO: {ex}");
        }
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        question.QuestionText = update.QuestionText ?? question.QuestionText;
        question.QuestionType = update.QuestionType ?? question.QuestionType;

        await _context.SaveChangesAsync();

        // update or create type-specific options record if provided
        if (update.Options != null && update.Options.Count > 0)
        {
            try {
                var type = (update.QuestionType ?? question.QuestionType ?? string.Empty).ToLowerInvariant();
                if (type == "mcq")
                {
                    var mcq = await _context.Set<McqQuestion>().FindAsync(id);
                    if (mcq == null)
                    {
                        mcq = new McqQuestion { QuestionId = id };
                        _context.Add(mcq);
                    }
                    mcq.QuestionMedia = update.QuestionImg ?? mcq.QuestionMedia;
                    mcq.Option1 = update.Options.ElementAtOrDefault(0)?.OptionText ?? update.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    mcq.Option2 = update.Options.ElementAtOrDefault(1)?.OptionText ?? update.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    mcq.Option3 = update.Options.ElementAtOrDefault(2)?.OptionText ?? update.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    mcq.Option4 = update.Options.ElementAtOrDefault(3)?.OptionText ?? update.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                }
                else
                {
                    var dd = await _context.DragDropQuestions.FindAsync(id);
                    if (dd == null)
                    {
                        dd = new DragDropQuestion { QuestionId = id };
                        _context.DragDropQuestions.Add(dd);
                    }
                    dd.Option1 = update.Options.ElementAtOrDefault(0)?.OptionText ?? update.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    dd.Option2 = update.Options.ElementAtOrDefault(1)?.OptionText ?? update.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    dd.Option3 = update.Options.ElementAtOrDefault(2)?.OptionText ?? update.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    dd.Option4 = update.Options.ElementAtOrDefault(3)?.OptionText ?? update.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                }
                await _context.SaveChangesAsync();
            } catch (Exception ex) {
                Console.Error.WriteLine($"Failed updating options for question: {ex}");
            }
        }

        return Ok(question);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        question.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

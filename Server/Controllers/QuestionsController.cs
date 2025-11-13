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

    public class ItemPayload {
        public string? ItemText { get; set; }
        public string? ItemImg { get; set; }
    }

    public class CreateQuestionDto {
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public int CourseId { get; set; }
        // optional image url for the question (if provided)
        public string? QuestionImg { get; set; }
        public int? CorrectAnswer { get; set; }
        public List<OptionPayload>? Options { get; set; }
        public List<ItemPayload>? Items { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion([FromBody] CreateQuestionDto dto)
    {
        try {
            Console.WriteLine("====== CREATE QUESTION DEBUG ======");
            Console.WriteLine($"[DEBUG] QuestionType received: '{dto.QuestionType}'");
            Console.WriteLine($"[DEBUG] QuestionImg: '{dto.QuestionImg}'");
            Console.WriteLine($"[DEBUG] CorrectAnswer: {dto.CorrectAnswer}");
            Console.WriteLine($"[DEBUG] Options count: {dto.Options?.Count ?? 0}");
            Console.WriteLine($"[DEBUG] Items count: {dto.Items?.Count ?? 0}");
            
            if (dto.Options != null)
            {
                for (int i = 0; i < dto.Options.Count; i++)
                {
                    var o = dto.Options[i];
                    Console.WriteLine($"[DEBUG] Option {i}: OptionText='{o?.OptionText}', OptionImg='{o?.OptionImg}'");
                }
            }
            if (dto.Items != null)
            {
                for (int i = 0; i < dto.Items.Count; i++)
                {
                    var item = dto.Items[i];
                    Console.WriteLine($"[DEBUG] Item {i}: ItemText='{item?.ItemText}', ItemImg='{item?.ItemImg}'");
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

        Console.WriteLine($"[DEBUG] Created Question object with QuestionType='{question.QuestionType}'");

        // Clear navigation property to avoid validation issues
        question.Course = null!;
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        Console.WriteLine($"[DEBUG] Question saved to DB with ID={question.QuestionId}, QuestionType='{question.QuestionType}'");

        // Persist options according to question type
        if (dto.Options != null && dto.Options.Count > 0)
        {
            try {
                var type = (dto.QuestionType ?? string.Empty).ToLowerInvariant();
                Console.WriteLine($"[DEBUG] Creating question of type: '{type}' (original: '{dto.QuestionType}')");
                
                if (type == "mcq")
                {
                    Console.WriteLine("[DEBUG] Creating MCQ question...");
                    var mcq = new McqQuestion();
                    mcq.QuestionId = question.QuestionId;
                    mcq.QuestionMedia = dto.QuestionImg ?? string.Empty;
                    // For each option, use OptionText if it's not empty, otherwise use OptionImg
                    mcq.Option1 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(0)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(0)!.OptionText 
                        : dto.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    mcq.Option2 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(1)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(1)!.OptionText 
                        : dto.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    mcq.Option3 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(2)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(2)!.OptionText 
                        : dto.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    mcq.Option4 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(3)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(3)!.OptionText 
                        : dto.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    // Store correct answer (0-3 index)
                    mcq.QuestionAnswer = (dto.CorrectAnswer ?? 0).ToString();
                    Console.WriteLine($"[DEBUG] MCQ Options: 1='{mcq.Option1}', 2='{mcq.Option2}', 3='{mcq.Option3}', 4='{mcq.Option4}', Answer='{mcq.QuestionAnswer}'");
                    Console.WriteLine($"[DEBUG] Adding MCQ to DbSet...");
                    _context.McqQuestions.Add(mcq);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"[DEBUG] MCQ saved successfully!");
                }
                else if (type == "dragdrop")
                {
                    Console.WriteLine("[DEBUG] Creating DragDrop question...");
                    var dd = new DragDropQuestion();
                    dd.QuestionId = question.QuestionId;
                    // Map items - use ItemText if not empty, otherwise use ItemImg
                    dd.Item1 = !string.IsNullOrWhiteSpace(dto.Items?.ElementAtOrDefault(0)?.ItemText) 
                        ? dto.Items!.ElementAtOrDefault(0)!.ItemText 
                        : dto.Items?.ElementAtOrDefault(0)?.ItemImg ?? string.Empty;
                    dd.Item2 = !string.IsNullOrWhiteSpace(dto.Items?.ElementAtOrDefault(1)?.ItemText) 
                        ? dto.Items!.ElementAtOrDefault(1)!.ItemText 
                        : dto.Items?.ElementAtOrDefault(1)?.ItemImg ?? string.Empty;
                    dd.Item3 = !string.IsNullOrWhiteSpace(dto.Items?.ElementAtOrDefault(2)?.ItemText) 
                        ? dto.Items!.ElementAtOrDefault(2)!.ItemText 
                        : dto.Items?.ElementAtOrDefault(2)?.ItemImg ?? string.Empty;
                    dd.Item4 = !string.IsNullOrWhiteSpace(dto.Items?.ElementAtOrDefault(3)?.ItemText) 
                        ? dto.Items!.ElementAtOrDefault(3)!.ItemText 
                        : dto.Items?.ElementAtOrDefault(3)?.ItemImg ?? string.Empty;
                    // Map options - use OptionText if not empty, otherwise use OptionImg
                    dd.Option1 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(0)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(0)!.OptionText 
                        : dto.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    dd.Option2 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(1)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(1)!.OptionText 
                        : dto.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    dd.Option3 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(2)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(2)!.OptionText 
                        : dto.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    dd.Option4 = !string.IsNullOrWhiteSpace(dto.Options.ElementAtOrDefault(3)?.OptionText) 
                        ? dto.Options.ElementAtOrDefault(3)!.OptionText 
                        : dto.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    Console.WriteLine($"[DEBUG] DragDrop Items: 1='{dd.Item1}', 2='{dd.Item2}', 3='{dd.Item3}', 4='{dd.Item4}'");
                    Console.WriteLine($"[DEBUG] DragDrop Options: 1='{dd.Option1}', 2='{dd.Option2}', 3='{dd.Option3}', 4='{dd.Option4}'");
                    Console.WriteLine($"[DEBUG] Adding DragDrop to DbSet...");
                    _context.DragDropQuestions.Add(dd);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"[DEBUG] DragDrop saved successfully!");
                }
                else
                {
                    Console.WriteLine($"[DEBUG] WARNING: Unknown question type '{type}' - not saving to MCQ or DragDrop table!");
                }
            } catch (Exception ex) {
                // don't block question creation if options persist fails
                Console.Error.WriteLine($"[ERROR] Failed saving options for question: {ex}");
                Console.Error.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
            }
        }
        else
        {
            Console.WriteLine("[DEBUG] No options provided, skipping MCQ/DragDrop table insert");
        }

        return CreatedAtAction(nameof(GetQuestionsByCourse), new { courseId = question.CourseId }, question);
    }

    public class UpdateQuestionDto {
        public string? QuestionText { get; set; }
        public string? QuestionType { get; set; }
        public string? QuestionImg { get; set; }
        public int? CorrectAnswer { get; set; }
        public List<OptionPayload>? Options { get; set; }
        public List<ItemPayload>? Items { get; set; }
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
                Console.WriteLine($"[DEBUG] Updating question of type: {type}");
                if (type == "mcq")
                {
                    var mcq = await _context.Set<McqQuestion>().FindAsync(id);
                    if (mcq == null)
                    {
                        mcq = new McqQuestion { QuestionId = id, QuestionMedia = string.Empty, QuestionAnswer = string.Empty };
                        _context.Add(mcq);
                    }
                    mcq.QuestionMedia = update.QuestionImg ?? mcq.QuestionMedia;
                    // For each option, use OptionText if it's not empty, otherwise use OptionImg
                    mcq.Option1 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(0)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(0)!.OptionText 
                        : update.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    mcq.Option2 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(1)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(1)!.OptionText 
                        : update.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    mcq.Option3 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(2)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(2)!.OptionText 
                        : update.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    mcq.Option4 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(3)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(3)!.OptionText 
                        : update.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    // Update correct answer if provided
                    if (update.CorrectAnswer.HasValue)
                    {
                        mcq.QuestionAnswer = update.CorrectAnswer.Value.ToString();
                    }
                    Console.WriteLine($"[DEBUG] Updated MCQ Options: 1='{mcq.Option1}', 2='{mcq.Option2}', 3='{mcq.Option3}', 4='{mcq.Option4}', Answer='{mcq.QuestionAnswer}'");
                }
                else if (type == "dragdrop")
                {
                    var dd = await _context.DragDropQuestions.FindAsync(id);
                    if (dd == null)
                    {
                        dd = new DragDropQuestion { QuestionId = id };
                        _context.DragDropQuestions.Add(dd);
                    }
                    // Update items - use ItemText if not empty, otherwise use ItemImg
                    if (update.Items != null && update.Items.Count > 0)
                    {
                        dd.Item1 = !string.IsNullOrWhiteSpace(update.Items.ElementAtOrDefault(0)?.ItemText) 
                            ? update.Items.ElementAtOrDefault(0)!.ItemText 
                            : update.Items.ElementAtOrDefault(0)?.ItemImg ?? string.Empty;
                        dd.Item2 = !string.IsNullOrWhiteSpace(update.Items.ElementAtOrDefault(1)?.ItemText) 
                            ? update.Items.ElementAtOrDefault(1)!.ItemText 
                            : update.Items.ElementAtOrDefault(1)?.ItemImg ?? string.Empty;
                        dd.Item3 = !string.IsNullOrWhiteSpace(update.Items.ElementAtOrDefault(2)?.ItemText) 
                            ? update.Items.ElementAtOrDefault(2)!.ItemText 
                            : update.Items.ElementAtOrDefault(2)?.ItemImg ?? string.Empty;
                        dd.Item4 = !string.IsNullOrWhiteSpace(update.Items.ElementAtOrDefault(3)?.ItemText) 
                            ? update.Items.ElementAtOrDefault(3)!.ItemText 
                            : update.Items.ElementAtOrDefault(3)?.ItemImg ?? string.Empty;
                    }
                    // Update options - use OptionText if not empty, otherwise use OptionImg
                    dd.Option1 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(0)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(0)!.OptionText 
                        : update.Options.ElementAtOrDefault(0)?.OptionImg ?? string.Empty;
                    dd.Option2 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(1)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(1)!.OptionText 
                        : update.Options.ElementAtOrDefault(1)?.OptionImg ?? string.Empty;
                    dd.Option3 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(2)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(2)!.OptionText 
                        : update.Options.ElementAtOrDefault(2)?.OptionImg ?? string.Empty;
                    dd.Option4 = !string.IsNullOrWhiteSpace(update.Options.ElementAtOrDefault(3)?.OptionText) 
                        ? update.Options.ElementAtOrDefault(3)!.OptionText 
                        : update.Options.ElementAtOrDefault(3)?.OptionImg ?? string.Empty;
                    Console.WriteLine($"[DEBUG] Updated DragDrop Items: 1='{dd.Item1}', 2='{dd.Item2}', 3='{dd.Item3}', 4='{dd.Item4}'");
                    Console.WriteLine($"[DEBUG] Updated DragDrop Options: 1='{dd.Option1}', 2='{dd.Option2}', 3='{dd.Option3}', 4='{dd.Option4}'");
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

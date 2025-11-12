using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class McqQuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public McqQuestionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/McqQuestions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<McqQuestion>> GetMcqQuestion(int id)
    {
        var mcq = await _context.McqQuestions
            .Include(m => m.Question)
            .FirstOrDefaultAsync(m => m.QuestionId == id);

        if (mcq == null)
        {
            return NotFound();
        }

        return mcq;
    }

    // Optional: get all MCQs for a course
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<McqQuestion>>> GetMcqQuestionsByCourse(int courseId)
    {
        var mcqs = await _context.McqQuestions
            .Include(m => m.Question)
            .Where(m => m.Question.CourseId == courseId && !m.Question.Deleted)
            .ToListAsync();

        return mcqs;
    }

    // Optional: create MCQ
    [HttpPost]
    public async Task<ActionResult<McqQuestion>> CreateMcq([FromBody] McqQuestion mcq)
    {
        _context.McqQuestions.Add(mcq);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMcqQuestion), new { id = mcq.QuestionId }, mcq);
    }

    // Optional: update MCQ
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMcq(int id, [FromBody] McqQuestion update)
    {
        var mcq = await _context.McqQuestions.FindAsync(id);
        if (mcq == null) return NotFound();

        mcq.Option1 = update.Option1;
        mcq.Option2 = update.Option2;
        mcq.Option3 = update.Option3;
        mcq.Option4 = update.Option4;
        mcq.QuestionAnswer = update.QuestionAnswer;
        mcq.QuestionMedia = update.QuestionMedia;

        await _context.SaveChangesAsync();
        return Ok(mcq);
    }
}

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

    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion(Question question)
    {
        question.Deleted = false;
        // Clear navigation property to avoid validation issues
        question.Course = null!;
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetQuestionsByCourse), new { courseId = question.CourseId }, question);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, Question update)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) return NotFound();

        question.QuestionText = update.QuestionText;
        question.QuestionType = update.QuestionType;

        await _context.SaveChangesAsync();
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

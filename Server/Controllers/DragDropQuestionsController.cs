using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class DragDropQuestionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DragDropQuestionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/DragDropQuestions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetDragDropQuestion(int id)
    {
        var dd = await _context.DragDropQuestions
            .Include(d => d.Question)
            .FirstOrDefaultAsync(d => d.QuestionId == id);

        if (dd == null) return NotFound();

        return new
        {
            questionId = dd.QuestionId,
            question = new { questionText = dd.Question.QuestionText },
            item1 = dd.Item1,
            item2 = dd.Item2,
            item3 = dd.Item3,
            item4 = dd.Item4,
            option1 = dd.Option1,
            option2 = dd.Option2,
            option3 = dd.Option3,
            option4 = dd.Option4
        };
    }
    
    // Get all drag-and-drop questions for a course
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<DragDropQuestion>>> GetDragDropQuestionsByCourse(int courseId)
    {
        var questions = await _context.DragDropQuestions
            .Include(d => d.Question)
            .Where(d => d.Question.CourseId == courseId && !d.Question.Deleted)
            .ToListAsync();

        return questions;
    }

    // Create drag-and-drop question
    [HttpPost]
    public async Task<ActionResult<DragDropQuestion>> CreateDragDrop([FromBody] DragDropQuestion question)
    {
        _context.DragDropQuestions.Add(question);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDragDropQuestion), new { id = question.QuestionId }, question);
    }

    // Optional: Update drag-and-drop question
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDragDrop(int id, [FromBody] DragDropQuestion update)
    {
        var question = await _context.DragDropQuestions.FindAsync(id);
        if (question == null) return NotFound();

        question.Item1 = update.Item1;
        question.Item2 = update.Item2;
        question.Item3 = update.Item3;
        question.Item4 = update.Item4;

        question.Option1 = update.Option1;
        question.Option2 = update.Option2;
        question.Option3 = update.Option3;
        question.Option4 = update.Option4;

        await _context.SaveChangesAsync();

        return Ok(question);
    }
}

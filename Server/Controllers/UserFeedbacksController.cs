using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserFeedbacksController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserFeedbacksController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetFeedbacks()
    {
        var list = await _context.UserFeedbacks
            .Include(f => f.User)
            .Include(f => f.Course)
            .Where(f => f.DeletedAt == null)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        var result = list.Select(f => new {
            id = f.FeedbackId,
            userId = f.UserId,
            userName = f.User != null ? $"{f.User.FirstName} {f.User.LastName}".Trim() : null,
            userEmail = f.User?.Email,
            type = f.Type,
            courseId = f.CourseId,
            courseTitle = f.Course?.Title,
            rating = f.Rating,
            title = f.Title,
            description = f.Description,
            createdAt = f.CreatedAt,
            editedAt = f.EditedAt
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetFeedback(int id)
    {
        var f = await _context.UserFeedbacks.Include(x => x.User).Include(x => x.Course).FirstOrDefaultAsync(x => x.FeedbackId == id && x.DeletedAt == null);
        if (f == null) return NotFound();
        return Ok(new {
            id = f.FeedbackId,
            userId = f.UserId,
            userName = f.User != null ? $"{f.User.FirstName} {f.User.LastName}".Trim() : null,
            userEmail = f.User?.Email,
            type = f.Type,
            courseId = f.CourseId,
            courseTitle = f.Course?.Title,
            rating = f.Rating,
            title = f.Title,
            description = f.Description,
            createdAt = f.CreatedAt,
            editedAt = f.EditedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFeedback(int id, [FromForm] int? rating, [FromForm] string? title, [FromForm] string? description, [FromForm] string? type)
    {
        var f = await _context.UserFeedbacks.FindAsync(id);
        if (f == null || f.DeletedAt != null) return NotFound();

        if (rating.HasValue) f.Rating = rating.Value;
        if (!string.IsNullOrEmpty(title)) f.Title = title;
        if (!string.IsNullOrEmpty(description)) f.Description = description;
        if (!string.IsNullOrEmpty(type)) f.Type = type;

        f.EditedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Updated" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFeedback(int id)
    {
        var f = await _context.UserFeedbacks.FindAsync(id);
        if (f == null || f.DeletedAt != null) return NotFound();
        f.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

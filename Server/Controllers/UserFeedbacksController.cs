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

        var result = list.Select(f => new
        {
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

    [HttpPost]
    public async Task<ActionResult> CreateFeedback([FromForm] int? userId, [FromForm] int? courseId, [FromForm] string? type, [FromForm] int? rating, [FromForm] string? title, [FromForm] string? description)
    {
        // Validate required fields
        if (!userId.HasValue || !courseId.HasValue || string.IsNullOrEmpty(type) || !rating.HasValue || string.IsNullOrEmpty(title) || string.IsNullOrEmpty(description))
        {
            return BadRequest(new { message = "All fields are required" });
        }

        // Validate rating range
        if (rating.Value < 1 || rating.Value > 5)
        {
            return BadRequest(new { message = "Rating must be between 1 and 5" });
        }

        // Check if user exists
        var userExists = await _context.Users.AnyAsync(u => u.UserId == userId.Value);
        if (!userExists)
        {
            return BadRequest(new { message = "User not found" });
        }

        // Check if course exists
        var courseExists = await _context.Courses.AnyAsync(c => c.CourseId == courseId.Value);
        if (!courseExists)
        {
            return BadRequest(new { message = "Course not found" });
        }

        var feedback = new UserFeedback
        {
            UserId = userId.Value,
            CourseId = courseId.Value,
            Type = type,
            Rating = rating.Value,
            Title = title,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };

        _context.UserFeedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Review submitted successfully", feedbackId = feedback.FeedbackId });
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetFeedback(int id)
    {
        var f = await _context.UserFeedbacks.Include(x => x.User).Include(x => x.Course).FirstOrDefaultAsync(x => x.FeedbackId == id && x.DeletedAt == null);
        if (f == null) return NotFound();
        return Ok(new
        {
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

    [HttpGet("count/{courseId}")]
    public async Task<ActionResult<int>> GetFeedbackCountByCourse(int courseId)
    {
        var count = await _context.UserFeedbacks
            .Where(f => f.CourseId == courseId && f.DeletedAt == null && f.Type.ToLower() == "review")
            .CountAsync();

        return Ok(count);
    }

    [HttpGet("average/{courseId}")]
    public async Task<ActionResult<double>> GetAverageRatingByCourse(int courseId)
    {
        var feedbacks = await _context.UserFeedbacks
            .Where(f => f.CourseId == courseId && f.DeletedAt == null && f.Type.ToLower() == "review")
            .ToListAsync();

        if (!feedbacks.Any())
        {
            return Ok(0.0);
        }

        var averageRating = feedbacks.Average(f => (double)f.Rating);
        return Ok(averageRating);
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetCourseFeedbackSummary(int courseId)
    {
        var feedbacks = await _context.UserFeedbacks
            .Where(f => f.CourseId == courseId && f.DeletedAt == null)
            .ToListAsync();

        if (!feedbacks.Any())
        {
            return Ok(new
            {
                averageRating = 0,
                totalReviews = 0
            });
        }

        var averageRating = feedbacks.Average(f => f.Rating);
        var totalReviews = feedbacks.Count;

        return Ok(new
        {
            averageRating,
            totalReviews
        });
    }

    [HttpGet("course/{courseId}/reviews")]
    public async Task<ActionResult<IEnumerable<object>>> GetCourseReviews(int courseId)
    {
        var reviews = await _context.UserFeedbacks
            .Include(f => f.User)
            .Include(f => f.Course)
            .Where(f => f.CourseId == courseId && f.DeletedAt == null && f.Type.ToLower() == "review")
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();

        var result = reviews.Select(f => new
        {
            id = f.FeedbackId,
            feedbackId = f.FeedbackId,
            userId = f.UserId,
            userName = f.User != null ? $"{f.User.FirstName} {f.User.LastName}".Trim() : "Anonymous",
            userInitial = f.User != null && !string.IsNullOrEmpty(f.User.FirstName) 
                ? f.User.FirstName[0].ToString().ToUpper() 
                : "A",
            type = f.Type,
            courseId = f.CourseId,
            courseTitle = f.Course?.Title ?? "Unknown Course",
            rating = f.Rating,
            title = f.Title,
            description = f.Description,
            createdAt = f.CreatedAt,
            timeAgo = GetTimeAgo(f.CreatedAt)
        });

        return Ok(result);
    }

    private string GetTimeAgo(DateTime dateTime)
    {
        var timeSpan = DateTime.UtcNow - dateTime;

        if (timeSpan.TotalMinutes < 1)
            return "just now";
        if (timeSpan.TotalMinutes < 60)
            return $"{(int)timeSpan.TotalMinutes} {((int)timeSpan.TotalMinutes == 1 ? "minute" : "minutes")} ago";
        if (timeSpan.TotalHours < 24)
            return $"{(int)timeSpan.TotalHours} {((int)timeSpan.TotalHours == 1 ? "hour" : "hours")} ago";
        if (timeSpan.TotalDays < 30)
            return $"{(int)timeSpan.TotalDays} {((int)timeSpan.TotalDays == 1 ? "day" : "days")} ago";
        if (timeSpan.TotalDays < 365)
            return $"{(int)(timeSpan.TotalDays / 30)} {((int)(timeSpan.TotalDays / 30) == 1 ? "month" : "months")} ago";
        return $"{(int)(timeSpan.TotalDays / 365)} {((int)(timeSpan.TotalDays / 365) == 1 ? "year" : "years")} ago";
    }

}

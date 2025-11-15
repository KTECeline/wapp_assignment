using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserCoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserCoursesController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get user's courses with their activity status
    /// Query params: userId, status (Progressing, Completed, Bookmarked)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetUserCourses([FromQuery] int userId, [FromQuery] string? status = null)
    {
        if (userId <= 0)
            return BadRequest(new { message = "Invalid userId" });

        var userExists = await _context.Users.AnyAsync(u => u.UserId == userId);
        if (!userExists)
            return NotFound(new { message = "User not found" });

        // Query all courses where user has registered (enrolled)
        var query = _context.CourseUserActivities
            .Where(a => a.UserId == userId && a.Registered == true)
            .Include(a => a.Course)
            .Include(a => a.Course!.Level)
            .AsQueryable();

        // Filter by status
        if (!string.IsNullOrEmpty(status))
        {
            switch (status.ToLower())
            {
                case "completed":
                    query = query.Where(a => a.Completed == true);
                    break;
                case "progressing":
                    // Progressing means registered but not completed
                    query = query.Where(a => a.Completed == false);
                    break;
                case "bookmarked":
                    query = query.Where(a => a.Bookmark);
                    break;
            }
        }

        var userCourses = await query.ToListAsync();

        // Calculate average ratings from UserFeedbacks for each course
        var courseRatings = await _context.UserFeedbacks
            .Where(f => f.Type.ToLower() == "review" && f.DeletedAt == null)
            .GroupBy(f => f.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                AverageRating = g.Average(f => f.Rating)
            })
            .ToListAsync();

        // Also get review counts for each course
        var reviewCounts = await _context.UserFeedbacks
            .Where(f => f.Type.ToLower() == "review" && f.DeletedAt == null)
            .GroupBy(f => f.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                ReviewCount = g.Count()
            })
            .ToListAsync();

        var result = userCourses.Select(a => new
        {
            courseId = a.Course!.CourseId,
            title = a.Course.Title,
            description = a.Course.Description,
            rating = courseRatings.FirstOrDefault(r => r.CourseId == a.Course.CourseId)?.AverageRating ?? 0,
            totalReviews = reviewCounts.FirstOrDefault(r => r.CourseId == a.Course.CourseId)?.ReviewCount ?? 0,
            courseImg = a.Course.CourseImg,
            cookingTimeMin = a.Course.CookingTimeMin,
            servings = a.Course.Servings,
            video = a.Course.Video,
            levelId = a.Course.LevelId,
            levelName = a.Course.Level != null ? a.Course.Level.Title : "",
            bookmark = a.Bookmark,
            quizStatus = a.QuizStatus,
            quizProgress = a.QuizProgress,
            badgeImg = a.Course.BadgeImg,
            quizBadgeImg = a.Course.QuizBadgeImg,
            completed = a.Completed,
            quizTotalTime = a.QuizTotalTime
        })
        .ToList();

        return Ok(result);
    }

    /// <summary>
    /// Get specific user course activity
    /// </summary>
    [HttpGet("{userId}/{courseId}")]
    public async Task<ActionResult<object>> GetUserCourseActivity(int userId, int courseId)
    {
        var activity = await _context.CourseUserActivities
            .Where(a => a.UserId == userId && a.CourseId == courseId)
            .Include(a => a.Course)
            .Include(a => a.Course!.Level)
            .FirstOrDefaultAsync();

        if (activity == null)
            return NotFound(new { message = "User course activity not found" });

        // Calculate average rating for this course
        var courseRating = await _context.UserFeedbacks
            .Where(f => f.CourseId == courseId && f.Type.ToLower() == "review" && f.DeletedAt == null)
            .AverageAsync(f => (double?)f.Rating) ?? 0;

        var result = new
        {
            courseId = activity.Course?.CourseId ?? 0,
            title = activity.Course?.Title ?? "",
            description = activity.Course?.Description ?? "",
            rating = courseRating,
            courseImg = activity.Course?.CourseImg ?? "",
            cookingTimeMin = activity.Course?.CookingTimeMin,
            servings = activity.Course?.Servings,
            video = activity.Course?.Video ?? "",
            levelId = activity.Course?.LevelId,
            levelName = activity.Course?.Level?.Title ?? "",
            bookmark = activity.Bookmark,
            quizStatus = activity.QuizStatus,
            quizProgress = activity.QuizProgress,
            badgeImg = activity.Course?.BadgeImg ?? "",
            quizBadgeImg = activity.Course?.QuizBadgeImg ?? "",
            completed = activity.Completed,
            quizTotalTime = activity.QuizTotalTime
        };

        return Ok(result);
    }

    /// <summary>
    /// Toggle bookmark status for a user course
    /// </summary>
    [HttpPut("{userId}/{courseId}/bookmark")]
    public async Task<IActionResult> ToggleBookmark(int userId, int courseId, [FromBody] bool bookmark)
    {
        var activity = await _context.CourseUserActivities
            .FirstOrDefaultAsync(a => a.UserId == userId && a.CourseId == courseId);

        if (activity == null)
            return NotFound(new { message = "User course activity not found" });

        activity.Bookmark = bookmark;
        _context.CourseUserActivities.Update(activity);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Bookmark updated successfully", bookmark = activity.Bookmark });
    }

    /// <summary>
    /// Update quiz status for a user course
    /// </summary>
    [HttpPut("{userId}/{courseId}/quiz-status")]
    public async Task<IActionResult> UpdateQuizStatus(int userId, int courseId, [FromBody] UpdateQuizStatusRequest request)
    {
        var activity = await _context.CourseUserActivities
            .FirstOrDefaultAsync(a => a.UserId == userId && a.CourseId == courseId);

        if (activity == null)
            return NotFound(new { message = "User course activity not found" });

        if (!string.IsNullOrEmpty(request.QuizStatus))
            activity.QuizStatus = request.QuizStatus;

        if (request.QuizProgress >= 0)
            activity.QuizProgress = request.QuizProgress;

        if (request.QuizStartTime.HasValue)
            activity.QuizStartTime = request.QuizStartTime;

        if (request.QuizEndTime.HasValue)
            activity.QuizEndTime = request.QuizEndTime;

        _context.CourseUserActivities.Update(activity);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Quiz status updated successfully", activity });
    }
}

public class UpdateQuizStatusRequest
{
    public string? QuizStatus { get; set; }
    public int QuizProgress { get; set; } = -1;
    public DateTime? QuizStartTime { get; set; }
    public DateTime? QuizEndTime { get; set; }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CourseUserActivitiesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CourseUserActivitiesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET status
    [HttpGet("status")]
    public async Task<ActionResult<object>> GetUserCourseStatus([FromQuery] int courseId, [FromQuery] int userId)
    {
        var activity = await _context.CourseUserActivities
            .FirstOrDefaultAsync(a => a.CourseId == courseId && a.UserId == userId);

        if (activity == null) return Ok(new { registered = false, saved = false });
        return Ok(new { registered = activity.Registered, saved = activity.Bookmark });
    }
    
    // GET status
    [HttpGet]
    public async Task<ActionResult<CourseUserActivity?>> GetActivity([FromQuery] int userId, [FromQuery] int courseId)
    {
        var activity = await _context.CourseUserActivities
            .FirstOrDefaultAsync(a => a.UserId == userId && a.CourseId == courseId);

        if (activity == null) return NotFound();
        return Ok(activity);
    }

    // POST: Register or create new activity
    [HttpPost]
    public async Task<ActionResult<CourseUserActivity>> CreateActivity([FromBody] CourseUserActivity activity)
    {
        // Check if user and course exist
        var userExists = await _context.Users.AnyAsync(u => u.UserId == activity.UserId);
        var courseExists = await _context.Courses.AnyAsync(c => c.CourseId == activity.CourseId && !c.Deleted);

        if (!userExists) return BadRequest(new { error = "Invalid UserId" });
        if (!courseExists) return BadRequest(new { error = "Invalid CourseId" });

        // Prevent duplicate activity
        var existing = await _context.CourseUserActivities
            .FirstOrDefaultAsync(a => a.UserId == activity.UserId && a.CourseId == activity.CourseId);
        if (existing != null) return Conflict(new { error = "Activity already exists" });

        _context.CourseUserActivities.Add(activity);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserCourseStatus),
            new { userId = activity.UserId, courseId = activity.CourseId }, activity);
    }

    // PUT: Update an existing activity (bookmark, registered, quiz progress)
    [HttpPut("{activityId}")]
    public async Task<IActionResult> UpdateActivity(int activityId, [FromBody] CourseUserActivity update)
    {
        var activity = await _context.CourseUserActivities.FindAsync(activityId);
        if (activity == null) return NotFound();

        // Update only allowed fields
        activity.Registered = update.Registered;
        activity.Bookmark = update.Bookmark;
        activity.QuizStatus = update.QuizStatus;
        activity.QuizStartTime = update.QuizStartTime;
        activity.QuizEndTime = update.QuizEndTime;
        activity.QuizTotalTime = update.QuizTotalTime;
        activity.QuizMistake = update.QuizMistake;
        activity.QuizProgress = update.QuizProgress;

        await _context.SaveChangesAsync();
        return Ok(activity);
    }
}

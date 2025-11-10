using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
    {
        return await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .Where(c => !c.Deleted)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Course>> GetCourse(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == id && !c.Deleted);

        if (course == null) return NotFound();
        return course;
    }

    [HttpGet("{id}/full")]
    public async Task<ActionResult<object>> GetCourseWithDetails(int id)
    {
        var course = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == id && !c.Deleted);

        if (course == null) return NotFound();

        var tips = await _context.CourseTips
            .Where(t => t.CourseId == id && !t.Deleted)
            .ToListAsync();

        var prepItems = await _context.CoursePrepItems
            .Where(p => p.CourseId == id && !p.Deleted)
            .ToListAsync();

        var steps = await _context.CourseSteps
            .Where(s => s.CourseId == id && !s.Deleted)
            .OrderBy(s => s.Step)
            .ToListAsync();

        var questions = await _context.Questions
            .Where(q => q.CourseId == id && !q.Deleted)
            .ToListAsync();

        return Ok(new
        {
            course,
            tips,
            prepItems,
            steps,
            questions
        });
    }

    [HttpPost]
    public async Task<ActionResult<Course>> CreateCourse(Course course)
    {
        // Validate that LevelId and CategoryId exist
        var levelExists = await _context.Levels.AnyAsync(l => l.LevelId == course.LevelId && !l.Deleted);
        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == course.CategoryId && !c.Deleted);

        if (!levelExists)
        {
            return BadRequest(new { error = "Invalid LevelId. Level does not exist." });
        }

        if (!categoryExists)
        {
            return BadRequest(new { error = "Invalid CategoryId. Category does not exist." });
        }

        course.Deleted = false;

        // Clear navigation properties to avoid validation issues
        course.Level = null!;
        course.Category = null!;

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        var createdCourse = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == course.CourseId);

        return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, createdCourse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, Course update)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();

        course.Title = update.Title;
        course.Description = update.Description;
        course.CourseImg = update.CourseImg;
        course.CookingTimeMin = update.CookingTimeMin;
        course.Servings = update.Servings;
    course.Video = update.Video;
        course.BadgeImg = update.BadgeImg;
        course.QuizBadgeImg = update.QuizBadgeImg;
        course.LevelId = update.LevelId;
        course.CategoryId = update.CategoryId;

        await _context.SaveChangesAsync();
        return Ok(course);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();

        course.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }

}

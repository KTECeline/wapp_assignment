using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CourseStepsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CourseStepsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<CourseStep>>> GetStepsByCourse(int courseId)
    {
        return await _context.CourseSteps
            .Where(s => s.CourseId == courseId && !s.Deleted)
            .OrderBy(s => s.Step)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CourseStep>> CreateStep(CourseStep step)
    {
        step.Deleted = false;
        // Clear navigation property to avoid validation issues
        step.Course = null!;
        _context.CourseSteps.Add(step);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStepsByCourse), new { courseId = step.CourseId }, step);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStep(int id, CourseStep update)
    {
        var step = await _context.CourseSteps.FindAsync(id);
        if (step == null) return NotFound();

        step.Description = update.Description;
        step.Step = update.Step;
        step.CourseStepImg = update.CourseStepImg;

        await _context.SaveChangesAsync();
        return Ok(step);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStep(int id)
    {
        var step = await _context.CourseSteps.FindAsync(id);
        if (step == null) return NotFound();

        step.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

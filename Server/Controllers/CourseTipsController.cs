using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CourseTipsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CourseTipsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<CourseTip>>> GetTipsByCourse(int courseId)
    {
        return await _context.CourseTips
            .Where(t => t.CourseId == courseId && !t.Deleted)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CourseTip>> CreateTip(CourseTip tip)
    {
        tip.Deleted = false;
        _context.CourseTips.Add(tip);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTipsByCourse), new { courseId = tip.CourseId }, tip);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTip(int id, CourseTip update)
    {
        var tip = await _context.CourseTips.FindAsync(id);
        if (tip == null) return NotFound();

        tip.Description = update.Description;

        await _context.SaveChangesAsync();
        return Ok(tip);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTip(int id)
    {
        var tip = await _context.CourseTips.FindAsync(id);
        if (tip == null) return NotFound();

        tip.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

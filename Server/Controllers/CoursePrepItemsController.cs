using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CoursePrepItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursePrepItemsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<IEnumerable<CoursePrepItem>>> GetPrepItemsByCourse(int courseId)
    {
        return await _context.CoursePrepItems
            .Where(p => p.CourseId == courseId && !p.Deleted)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<CoursePrepItem>> CreatePrepItem(CoursePrepItem item)
    {
        item.Deleted = false;
        // Clear navigation property to avoid validation issues
        item.Course = null!;
        _context.CoursePrepItems.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPrepItemsByCourse), new { courseId = item.CourseId }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePrepItem(int id, CoursePrepItem update)
    {
        var item = await _context.CoursePrepItems.FindAsync(id);
        if (item == null) return NotFound();

        item.Title = update.Title;
        item.Description = update.Description;
        item.ItemImg = update.ItemImg;
        item.Type = update.Type;
        item.Amount = update.Amount;
        item.Metric = update.Metric;

        await _context.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePrepItem(int id)
    {
        var item = await _context.CoursePrepItems.FindAsync(id);
        if (item == null) return NotFound();

        item.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class BadgesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BadgesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Badge>>> GetBadges()
    {
        var badges = await _context.Badges
            .Where(b => !b.Deleted)
            .ToListAsync();
        
        return Ok(badges);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Badge>> GetBadge(int id)
    {
        var badge = await _context.Badges
            .FirstOrDefaultAsync(b => b.BadgeId == id && !b.Deleted);

        if (badge == null)
            return NotFound(new { message = "Badge not found" });

        return Ok(badge);
    }

    [HttpPost]
    public async Task<ActionResult<Badge>> CreateBadge(Badge badge)
    {
        if (string.IsNullOrWhiteSpace(badge.Title))
            return BadRequest(new { message = "Badge title is required" });

        badge.Deleted = false;
        _context.Badges.Add(badge);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBadge), new { id = badge.BadgeId }, badge);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBadge(int id, Badge badge)
    {
        var existingBadge = await _context.Badges.FindAsync(id);
        if (existingBadge == null)
            return NotFound(new { message = "Badge not found" });

        existingBadge.Title = badge.Title ?? existingBadge.Title;
        existingBadge.Type = badge.Type ?? existingBadge.Type;
        existingBadge.Description = badge.Description ?? existingBadge.Description;
        existingBadge.EntityId = badge.EntityId != 0 ? badge.EntityId : existingBadge.EntityId;
        existingBadge.Requirement = badge.Requirement != 0 ? badge.Requirement : existingBadge.Requirement;
        existingBadge.BadgeImg = badge.BadgeImg ?? existingBadge.BadgeImg;

        _context.Badges.Update(existingBadge);
        await _context.SaveChangesAsync();

        return Ok(existingBadge);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBadge(int id)
    {
        var badge = await _context.Badges.FindAsync(id);
        if (badge == null)
            return NotFound(new { message = "Badge not found" });

        badge.Deleted = true;
        _context.Badges.Update(badge);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Badge deleted successfully" });
    }
}

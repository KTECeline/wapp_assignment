using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class LevelsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LevelsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
    {
        return await _context.Levels
            .Where(l => !l.Deleted)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Level>> GetLevel(int id)
    {
        var level = await _context.Levels
            .FirstOrDefaultAsync(l => l.LevelId == id && !l.Deleted);

        if (level == null) return NotFound();
        return level;
    }

    [HttpPost]
    public async Task<ActionResult<Level>> CreateLevel(Level level)
    {
        level.Deleted = false;
        _context.Levels.Add(level);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetLevel), new { id = level.LevelId }, level);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLevel(int id, Level update)
    {
        var level = await _context.Levels.FindAsync(id);
        if (level == null) return NotFound();

        level.Title = update.Title;
        level.Description = update.Description;

        await _context.SaveChangesAsync();
        return Ok(level);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLevel(int id)
    {
        var level = await _context.Levels.FindAsync(id);
        if (level == null) return NotFound();

        level.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnnouncementsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAnnouncements()
    {
        var list = await _context.Announcements
            .Where(a => !a.Deleted)
            .OrderByDescending(a => a.AnnId)
            .ToListAsync();

        var result = list.Select(a => new {
            id = a.AnnId,
            title = a.Title,
            body = a.Description,
            annImg = a.AnnImg,
            visible = a.Visible
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetAnnouncement(int id)
    {
        var a = await _context.Announcements.FindAsync(id);
        if (a == null || a.Deleted) return NotFound();
        return Ok(new {
            id = a.AnnId,
            title = a.Title,
            body = a.Description,
            annImg = a.AnnImg,
            visible = a.Visible
        });
    }

    [HttpPost]
    public async Task<ActionResult<object>> CreateAnnouncement([FromForm] string? title, [FromForm] string? body, IFormFile? ann_img, [FromForm] bool? visible)
    {
        var ann = new Announcement
        {
            Title = title ?? string.Empty,
            Description = body ?? string.Empty,
            Visible = visible ?? true,
            Deleted = false
        };

        if (ann_img != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            var fileName = $"{Guid.NewGuid()}_{ann_img.FileName}";
            var path = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await ann_img.CopyToAsync(stream);
            }
            ann.AnnImg = $"/uploads/{fileName}";
        }

        _context.Announcements.Add(ann);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAnnouncement), new { id = ann.AnnId }, new {
            id = ann.AnnId,
            title = ann.Title,
            body = ann.Description,
            annImg = ann.AnnImg,
            visible = ann.Visible
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAnnouncement(int id, [FromForm] string? title, [FromForm] string? body,
     IFormFile? ann_img, [FromForm] bool? visible)
    {
        var ann = await _context.Announcements.FindAsync(id);
        if (ann == null || ann.Deleted) return NotFound();

        if (!string.IsNullOrEmpty(title)) ann.Title = title;
        if (!string.IsNullOrEmpty(body)) ann.Description = body;
        if (visible.HasValue) ann.Visible = visible.Value;

        if (ann_img != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            var fileName = $"{Guid.NewGuid()}_{ann_img.FileName}";
            var path = Path.Combine(uploadsFolder, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await ann_img.CopyToAsync(stream);
            }
            ann.AnnImg = $"/uploads/{fileName}";
        }

        await _context.SaveChangesAsync();
        return Ok(new {
            id = ann.AnnId,
            title = ann.Title,
            body = ann.Description,
            annImg = ann.AnnImg,
            visible = ann.Visible
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnnouncement(int id)
    {
        var ann = await _context.Announcements.FindAsync(id);
        if (ann == null || ann.Deleted) return NotFound();
        // soft delete
        ann.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

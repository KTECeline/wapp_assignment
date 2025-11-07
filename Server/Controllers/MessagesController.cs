using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MessagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("session/{sessionId}")]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessagesBySession(int sessionId)
    {
        return await _context.Messages
            .Where(m => m.SessionId == sessionId)
            .OrderBy(m => m.SentDate)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage(Message message)
    {
        message.SentDate = DateTime.UtcNow;
        message.ViewByUser = false;
        message.ViewByAdmin = false;

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMessagesBySession), new { sessionId = message.SessionId }, message);
    }

    [HttpPut("{id}/mark-viewed")]
    public async Task<IActionResult> MarkAsViewed(int id, [FromBody] bool byAdmin)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message == null) return NotFound();

        if (byAdmin)
            message.ViewByAdmin = true;
        else
            message.ViewByUser = true;

        await _context.SaveChangesAsync();
        return Ok(message);
    }
}

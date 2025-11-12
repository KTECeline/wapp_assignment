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
        // Basic validation
        if (message == null) return BadRequest("Message payload is required.");
        if (string.IsNullOrWhiteSpace(message.Content)) return BadRequest("Message content cannot be empty.");

        // Verify the help session exists to avoid FK violations
        var sessionExists = await _context.HelpSessions.AnyAsync(h => h.SessionId == message.SessionId);
        if (!sessionExists) return BadRequest($"Help session with id {message.SessionId} does not exist.");

        message.SentDate = DateTime.UtcNow;
        // default view flags
        message.ViewByUser = false;
        message.ViewByAdmin = false;

        // Ensure SentByAdmin has a deterministic value (false if not provided)
        // (bool defaults to false in C# so this is mainly for clarity)
        // message.SentByAdmin = message.SentByAdmin;

        _context.Messages.Add(message);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Return a 500 with a concise message for debugging in dev
            return Problem(detail: ex.Message, statusCode: 500);
        }

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

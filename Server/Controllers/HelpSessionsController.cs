using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class HelpSessionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public HelpSessionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetHelpSessions()
    {
        var sessions = await _context.HelpSessions
            .Include(h => h.User)
            .OrderByDescending(h => h.StartSession)
            .ToListAsync();

        var result = new List<object>();
        foreach (var session in sessions)
        {
            var messages = await _context.Messages
                .Where(m => m.SessionId == session.SessionId)
                .OrderBy(m => m.SentDate)
                .ToListAsync();

            result.Add(new
            {
                id = session.SessionId,
                userId = session.UserId,
                userName = $"{session.User.FirstName} {session.User.LastName}".Trim(),
                userEmail = session.User.Email,
                startSession = session.StartSession,
                endSession = session.EndSession,
                status = session.EndSession == null ? "active" : "closed",
                messages = messages.Select(m => new
                {
                    id = m.MessageId,
                    content = m.Content,
                    sentDate = m.SentDate,
                    sentByAdmin = m.SentByAdmin,
                    viewedByUser = m.ViewByUser,
                    viewedByAdmin = m.ViewByAdmin
                })
            });
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetHelpSession(int id)
    {
        var session = await _context.HelpSessions
            .Include(h => h.User)
            .FirstOrDefaultAsync(h => h.SessionId == id);

        if (session == null) return NotFound();

        var messages = await _context.Messages
            .Where(m => m.SessionId == id)
            .OrderBy(m => m.SentDate)
            .ToListAsync();

        return Ok(new
        {
            id = session.SessionId,
            userId = session.UserId,
            userName = $"{session.User.FirstName} {session.User.LastName}".Trim(),
            userEmail = session.User.Email,
            startSession = session.StartSession,
            endSession = session.EndSession,
            status = session.EndSession == null ? "active" : "closed",
            messages = messages.Select(m => new
            {
                id = m.MessageId,
                content = m.Content,
                sentDate = m.SentDate,
                sentByAdmin = m.SentByAdmin,
                viewedByUser = m.ViewByUser,
                viewedByAdmin = m.ViewByAdmin
            })
        });
    }

    [HttpPost]
    public async Task<ActionResult<HelpSession>> CreateHelpSession(HelpSession session)
    {
        session.StartSession = DateTime.UtcNow;
        session.EndSession = null;
        _context.HelpSessions.Add(session);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetHelpSession), new { id = session.SessionId }, session);
    }

    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseHelpSession(int id)
    {
        var session = await _context.HelpSessions.FindAsync(id);
        if (session == null) return NotFound();

        session.EndSession = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(session);
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();
        return user;
    }

    // Add [HttpPost], [HttpPut], [HttpDelete] for full CRUD
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        // Provide simple defaults for required fields when omitted by client
        if (string.IsNullOrWhiteSpace(user.Email))
        {
            var name = string.IsNullOrWhiteSpace(user.Username) ? "user" : user.Username.ToLower().Replace(" ", "");
            user.Email = $"{name}{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}@example.com";
        }
        if (string.IsNullOrWhiteSpace(user.Password))
        {
            user.Password = "changeme"; // TODO: replace with proper hashing & onboarding flow
        }
        user.CreatedAt = DateTime.UtcNow;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User update)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        // Update a safe subset of fields for now
        if (!string.IsNullOrWhiteSpace(update.Username)) user.Username = update.Username;
        if (!string.IsNullOrWhiteSpace(update.Email)) user.Email = update.Email;
        if (!string.IsNullOrWhiteSpace(update.FirstName)) user.FirstName = update.FirstName;
        if (!string.IsNullOrWhiteSpace(update.LastName)) user.LastName = update.LastName;
        if (!string.IsNullOrWhiteSpace(update.UserType)) user.UserType = update.UserType;

        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
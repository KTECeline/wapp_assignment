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
    public async Task<IActionResult> UpdateUser(int id, [FromForm] User update, IFormFile? profileimage)
    {
        try
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // Handle profile image upload
            if (profileimage != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{profileimage.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profileimage.CopyToAsync(stream);
                }

                user.ProfileImg = $"/uploads/{uniqueFileName}";
            }

            // Update user fields, preserving existing values if not provided
            user.Username = update.Username ?? user.Username;
            user.Email = update.Email ?? user.Email;
            user.FirstName = update.FirstName ?? user.FirstName;
            user.LastName = update.LastName ?? user.LastName;
            user.Gender = update.Gender ?? user.Gender;
            user.DOB = update.DOB ?? user.DOB;
            user.LevelId = update.LevelId ?? user.LevelId;
            user.CategoryId = update.CategoryId ?? user.CategoryId;
            user.Password = user.Password; // Preserve existing password

            await _context.SaveChangesAsync();
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        if (update.CategoryId.HasValue) user.CategoryId = update.CategoryId;

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
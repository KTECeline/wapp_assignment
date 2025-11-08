using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;

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
        // Return users with their related Level and Category data, excluding deleted users
        var users = await _context.Users
            .Where(u => u.DeletedAt == null)
            .Include(u => u.Level)
            .Include(u => u.Category)
            .Select(u => new
            {
                u.UserId,
                u.Username,
                u.Email,
                u.UserType,
                u.FirstName,
                u.LastName,
                u.ProfileImg,
                u.Gender,
                u.DOB,
                u.CreatedAt,
                Level = u.Level != null ? u.Level.Title : null,
                Category = u.Category != null ? u.Category.Title : null
            })
            .ToListAsync();

        return Ok(users);
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
    public async Task<ActionResult<User>> CreateUser([FromForm] string username, [FromForm] string email, 
        [FromForm] string password, [FromForm] string firstName, [FromForm] string lastName,
        [FromForm] string gender, [FromForm] string DOB, [FromForm] int? levelId,
        [FromForm] int? categoryId, IFormFile? profileimage)
    {
        try
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(username) || 
                string.IsNullOrWhiteSpace(email) || 
                string.IsNullOrWhiteSpace(password))
            {
                return BadRequest("Username, email and password are required.");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == email))
            {
                return BadRequest("Email already exists.");
            }

            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == username))
            {
                return BadRequest("Username already exists.");
            }

            DateTime? parsedDob = null;
            if (!string.IsNullOrWhiteSpace(DOB) && DateTime.TryParse(DOB, out var _dt))
            {
                parsedDob = _dt;
            }

            var user = new User
            {
                Username = username,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                FirstName = firstName,
                LastName = lastName,
                Gender = gender,
                DOB = parsedDob,
                LevelId = levelId,
                CategoryId = categoryId,
                CreatedAt = DateTime.UtcNow,
                UserType = "user" // Default user type
            };

            // Handle profile image if provided
            if (profileimage != null)
            {
                var fileName = $"{Guid.NewGuid()}_{profileimage.FileName}";
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                var path = Path.Combine(uploadsFolder, fileName);
                
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await profileimage.CopyToAsync(stream);
                }
                
                user.ProfileImg = $"/uploads/{fileName}";
            }

            // Add user to database
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Remove password from response
            user.Password = string.Empty; // Using empty string instead of null for non-nullable string
            
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
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
       // if (update.CategoryId.HasValue) user.CategoryId = update.CategoryId;

        //await _context.SaveChangesAsync();
        //return Ok(user);
   
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
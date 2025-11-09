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
    private readonly ILogger<UsersController> _logger;

    public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("test")]
    public ActionResult<string> Test()
    {
        return Ok("Server is running!");
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

    [HttpPost("login")]
    public async Task<ActionResult<object>> Login([FromBody] LoginRequest request)
    {
        try
        {
            Console.WriteLine($"Login attempt received for: {request?.LoginId}");

            if (request == null || string.IsNullOrEmpty(request.LoginId) || string.IsNullOrEmpty(request.Password))
            {
                Console.WriteLine("Invalid request: Missing credentials");
                return BadRequest("Login ID and password are required.");
            }

            // Check if login is email or username
            var user = await _context.Users
                .Where(u => u.DeletedAt == null && 
                    (u.Email.ToLower() == request.LoginId.ToLower() || 
                     u.Username.ToLower() == request.LoginId.ToLower()))
                .FirstOrDefaultAsync();

            if (user == null)
            {
                Console.WriteLine($"User not found for login ID: {request.LoginId}");
                return BadRequest("Invalid login credentials.");
            }

            Console.WriteLine($"User found: {user.Username}");

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                Console.WriteLine("Password verification failed");
                return BadRequest("Invalid login credentials.");
            }

            Console.WriteLine("Login successful");

            // Return user data (excluding sensitive information)
            return Ok(new
            {
                userId = user.UserId,
                username = user.Username,
                email = user.Email,
                userType = user.UserType,
                firstName = user.FirstName,
                lastName = user.LastName,
                profileImg = user.ProfileImg
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Login error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, "An error occurred during login.");
        }
    }

    // Add [HttpPost], [HttpPut], [HttpDelete] for full CRUD
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromForm] string username, [FromForm] string email, 
        [FromForm] string password, [FromForm] string firstName, [FromForm] string lastName,
        [FromForm] string gender, [FromForm] string DOB, [FromForm] int? levelId,
        [FromForm] int? categoryId, [FromForm] string userType, IFormFile? profileimage)
    {
        try
        {
            // Debug log
            _logger.LogInformation("Checking database state...");
            var categoryCount = await _context.Categories.CountAsync();
            var levelCount = await _context.Levels.CountAsync();
            _logger.LogInformation("Database state: {CategoryCount} categories and {LevelCount} levels", categoryCount, levelCount);

            // Make sure levels exist
            if (levelCount == 0)
            {
                var defaultLevels = new[]
                {
                    new Level { Title = "Beginner", Description = "For beginners" },
                    new Level { Title = "Amateur", Description = "For intermediate users" },
                    new Level { Title = "Master", Description = "For advanced users" }
                };
                await _context.Levels.AddRangeAsync(defaultLevels);
                await _context.SaveChangesAsync();
                Console.WriteLine("Added default levels");
            }

            // Make sure categories exist
            if (categoryCount == 0)
            {
                var defaultCategories = new[]
                {
                    new Category { Title = "Bread", Description = "All types of bread recipes" },
                    new Category { Title = "Pastry", Description = "Delicate pastry creations" },
                    new Category { Title = "Cookies", Description = "Cookie recipes and decorating" },
                    new Category { Title = "Cake", Description = "Cake baking and decorating" },
                    new Category { Title = "Pie & Tarts", Description = "Sweet and savory pies" },
                    new Category { Title = "Sourdough", Description = "Sourdough bread making" },
                    new Category { Title = "Pizza", Description = "Pizza making techniques" },
                    new Category { Title = "Scones & Muffins", Description = "Quick breads" },
                    new Category { Title = "Others", Description = "Other baking specialties" }
                };
                await _context.Categories.AddRangeAsync(defaultCategories);
                await _context.SaveChangesAsync();
                Console.WriteLine("Added default categories");
            }

            Console.WriteLine("Creating user with data:");
            Console.WriteLine($"Username: {username}");
            Console.WriteLine($"Email: {email}");
            Console.WriteLine($"FirstName: {firstName}");
            Console.WriteLine($"LastName: {lastName}");
            Console.WriteLine($"Gender: {gender}");
            Console.WriteLine($"DOB: {DOB}");
            Console.WriteLine($"LevelId: {levelId}");
            Console.WriteLine($"CategoryId: {categoryId}");
            Console.WriteLine($"UserType: {userType}");
            Console.WriteLine($"Has Profile Image: {profileimage != null}");
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

            // Validate category and level if provided
            if (categoryId.HasValue)
            {
                var category = await _context.Categories.FindAsync(categoryId.Value);
                if (category == null)
                {
                    return BadRequest($"Category with ID {categoryId.Value} not found.");
                }
            }

            if (levelId.HasValue)
            {
                var level = await _context.Levels.FindAsync(levelId.Value);
                if (level == null)
                {
                    return BadRequest($"Level with ID {levelId.Value} not found.");
                }
            }

            // Parse DOB
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
                FirstName = firstName ?? "",
                LastName = lastName ?? "",
                Gender = gender ?? "",
                DOB = parsedDob,
                LevelId = levelId,
                CategoryId = categoryId,
                CreatedAt = DateTime.UtcNow,
                UserType = userType ?? "user" // Use provided userType or default to "user"
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
    public async Task<IActionResult> UpdateUser(int id, [FromForm] User update, IFormFile? profileimage, [FromForm] string? adminLogin = null, [FromForm] string? adminPassword = null)
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
            // Handle password change: require admin validation
            if (!string.IsNullOrWhiteSpace(update.Password))
            {
                // Admin credentials must be provided to change another user's password
                if (string.IsNullOrWhiteSpace(adminLogin) || string.IsNullOrWhiteSpace(adminPassword))
                {
                    return BadRequest("Admin credentials are required to change a user's password.");
                }

                var adminUser = await _context.Users
                    .Where(u => u.DeletedAt == null && u.UserType == "admin" &&
                        (u.Username.ToLower() == adminLogin.ToLower() || u.Email.ToLower() == adminLogin.ToLower()))
                    .FirstOrDefaultAsync();

                if (adminUser == null || !BCrypt.Net.BCrypt.Verify(adminPassword, adminUser.Password))
                {
                    return Unauthorized("Invalid admin credentials.");
                }

                // Hash new password before storing
                user.Password = BCrypt.Net.BCrypt.HashPassword(update.Password);
            }

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
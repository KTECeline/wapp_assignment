using Microsoft.EntityFrameworkCore;

namespace Server.Data;

public static class DatabaseSeeder
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Ensure database is created and migrations are applied
        context.Database.Migrate();

        // Only seed if database is empty
        if (context.Users.Any())
        {
            return; // DB has already been seeded
        }

        // Add test users
        var users = new[]
        {
            new User
            {
                Username = "admin",
                UserType = "admin",
                Email = "admin@example.com",
                Password = "admin123", // In production, this should be hashed
                FirstName = "Admin",
                LastName = "User",
                ProfileImg = "default.jpg",
                Gender = "M",
                DOB = new DateTime(1990, 1, 1),
                CreatedAt = DateTime.UtcNow
            },
            new User
            {
                Username = "testuser",
                UserType = "user",
                Email = "test@example.com",
                Password = "test123", // In production, this should be hashed
                FirstName = "Test",
                LastName = "User",
                ProfileImg = "default.jpg",
                Gender = "F",
                DOB = new DateTime(1995, 5, 15),
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        
        // Add test categories

        var categories = new[]
        {
            new Category { Title = "Bread", Description = "All types of bread recipes and techniques" },
            new Category { Title = "Pastry", Description = "Delicate pastry creations" },
            new Category { Title = "Cookies", Description = "Cookie recipes and decorating techniques" },
            new Category { Title = "Cake", Description = "Cake baking and decorating" },
            new Category { Title = "Pie & Tarts", Description = "Sweet and savory pies and tarts" },
            new Category { Title = "Sourdough", Description = "Sourdough bread making" },
            new Category { Title = "Pizza", Description = "Pizza dough and toppings" },
            new Category { Title = "Scones & Muffins", Description = "Quick breads and breakfast pastries" },
            new Category { Title = "Others", Description = "Other baking specialties" }
        };

        context.Categories.AddRange(categories);

        // Add test levels

        var levels = new[]
        {
            new Level { Title = "Level 1", Description = "First level" },
            new Level { Title = "Level 2", Description = "Second level" },
            new Level { Title = "Level 3", Description = "Third level" }
        };

        context.Levels.AddRange(levels);

        // Save all seeded data
        context.SaveChanges();
    }
}
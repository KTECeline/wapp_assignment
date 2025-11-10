using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories
            .Where(c => !c.Deleted)
            .ToListAsync();
        
        Console.WriteLine($"Found {categories.Count} categories:");
        foreach (var category in categories)
        {
            Console.WriteLine($"- {category.CategoryId}: {category.Title}");
        }
        
        return categories;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.CategoryId == id && !c.Deleted);

        if (category == null) return NotFound();
        return category;
    }

    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        category.Deleted = false;
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, Category update)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        // Log incoming update for debugging
        try
        {
            var title = update?.Title ?? "(null)";
            var descLen = update?.Description?.Length ?? 0;
            var catImg = update?.CatImg ?? "(null)";
            var catBanner = update?.CatBanner ?? "(null)";
            Console.WriteLine($"UpdateCategory called for id={id} with payload: Title='{title}', Description length={descLen}, CatImg='{catImg}', CatBanner='{catBanner}'");
        }
        catch { /* ignore logging errors */ }

        // Model validation
        if (!ModelState.IsValid)
        {
            Console.WriteLine("ModelState invalid while updating category:");
            foreach (var key in ModelState.Keys)
            {
                var state = ModelState[key];
                if (state?.Errors == null) continue;
                foreach (var error in state.Errors)
                {
                    Console.WriteLine($" - {key}: {error.ErrorMessage}");
                }
            }
            return BadRequest(ModelState);
        }

    // update is expected to be non-null because model binding succeeded
    category.Title = update?.Title ?? category.Title;
    category.Description = update?.Description ?? category.Description;
    category.CatImg = update?.CatImg ?? category.CatImg;
    category.CatBanner = update?.CatBanner ?? category.CatBanner;

        await _context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        category.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

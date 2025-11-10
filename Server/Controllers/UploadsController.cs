using Microsoft.AspNetCore.Mvc;
using System.IO;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private readonly ILogger<UploadsController> _logger;

    public UploadsController(ILogger<UploadsController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> UploadSingle(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("No file provided");

        var fileName = $"{Guid.NewGuid()}_{file.FileName}";
        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

        var filePath = Path.Combine(uploadsFolder, fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = $"/uploads/{fileName}";
        // Build absolute URL using current request so frontend can use it directly
        var absoluteUrl = $"{Request.Scheme}://{Request.Host}{relativePath}";

        _logger.LogInformation("Uploaded file saved to {Path}, served at {Url}", filePath, absoluteUrl);

        // Return both relative and absolute path for flexibility
        return Ok(new { path = relativePath, url = absoluteUrl });
    }
}

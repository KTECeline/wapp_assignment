using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class UserPostsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserPostsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/UserPosts
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetUserPosts([FromQuery] string? filter = null, [FromQuery] int? userId = null)
    {
        var query = _context.UserPosts
            .Include(p => p.User)
            .Include(p => p.Course)
                .ThenInclude(c => c.Category)
            .Where(p => p.DeletedAt == null && p.ApproveStatus == "Approved");

        // Filter by user if userId is provided
        if (userId.HasValue)
        {
            query = query.Where(p => p.UserId == userId.Value);
        }

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        // Get like counts for each post
        var postIds = posts.Select(p => p.PostId).ToList();
        var likeCounts = await _context.PostLikes
            .Where(pl => postIds.Contains(pl.PostId))
            .GroupBy(pl => pl.PostId)
            .Select(g => new { PostId = g.Key, Count = g.Count() })
            .ToListAsync();

        // Check if current user has liked each post (if userId provided)
        var userLikes = new HashSet<int>();
        if (userId.HasValue)
        {
            userLikes = (await _context.PostLikes
                .Where(pl => pl.UserId == userId.Value && postIds.Contains(pl.PostId))
                .Select(pl => pl.PostId)
                .ToListAsync())
                .ToHashSet();
        }

        var result = posts.Select(p => new
        {
            postId = p.PostId,
            userId = p.UserId,
            userName = p.User.Username,
            userFirstName = p.User.FirstName,
            userLastName = p.User.LastName,
            type = p.Type,
            courseId = p.CourseId,
            courseName = p.Course.Title,
            categoryName = p.Course.Category.Title,
            title = p.Title,
            description = p.Description,
            postImg = p.PostImg,
            createdAt = p.CreatedAt,
            likeCount = likeCounts.FirstOrDefault(lc => lc.PostId == p.PostId)?.Count ?? 0,
            isLiked = userLikes.Contains(p.PostId)
        });

        return Ok(result);
    }

    // GET: api/UserPosts/liked/{userId}
    [HttpGet("liked/{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetLikedPosts(int userId)
    {
        var likedPostIds = await _context.PostLikes
            .Where(pl => pl.UserId == userId)
            .Select(pl => pl.PostId)
            .ToListAsync();

        var posts = await _context.UserPosts
            .Include(p => p.User)
            .Include(p => p.Course)
                .ThenInclude(c => c.Category)
            .Where(p => likedPostIds.Contains(p.PostId) && p.DeletedAt == null)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var postIds = posts.Select(p => p.PostId).ToList();
        var likeCounts = await _context.PostLikes
            .Where(pl => postIds.Contains(pl.PostId))
            .GroupBy(pl => pl.PostId)
            .Select(g => new { PostId = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = posts.Select(p => new
        {
            postId = p.PostId,
            userId = p.UserId,
            userName = p.User.Username,
            userFirstName = p.User.FirstName,
            userLastName = p.User.LastName,
            type = p.Type,
            courseId = p.CourseId,
            courseName = p.Course.Title,
            categoryName = p.Course.Category.Title,
            title = p.Title,
            description = p.Description,
            postImg = p.PostImg,
            createdAt = p.CreatedAt,
            likeCount = likeCounts.FirstOrDefault(lc => lc.PostId == p.PostId)?.Count ?? 0,
            isLiked = true
        });

        return Ok(result);
    }

    // GET: api/UserPosts/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetUserPost(int id, [FromQuery] int? userId = null)
    {
        var post = await _context.UserPosts
            .Include(p => p.User)
            .Include(p => p.Course)
                .ThenInclude(c => c.Category)
            .Where(p => p.PostId == id && p.DeletedAt == null)
            .FirstOrDefaultAsync();

        if (post == null)
        {
            return NotFound();
        }

        var likeCount = await _context.PostLikes
            .Where(pl => pl.PostId == id)
            .CountAsync();

        var isLiked = false;
        if (userId.HasValue)
        {
            isLiked = await _context.PostLikes
                .AnyAsync(pl => pl.PostId == id && pl.UserId == userId.Value);
        }

        var result = new
        {
            postId = post.PostId,
            userId = post.UserId,
            userName = post.User.Username,
            userFirstName = post.User.FirstName,
            userLastName = post.User.LastName,
            type = post.Type,
            courseId = post.CourseId,
            courseName = post.Course.Title,
            categoryName = post.Course.Category.Title,
            title = post.Title,
            description = post.Description,
            postImg = post.PostImg,
            createdAt = post.CreatedAt,
            likeCount = likeCount,
            isLiked = isLiked
        };

        return Ok(result);
    }

    // POST: api/UserPosts/{postId}/like
    [HttpPost("{postId}/like")]
    public async Task<ActionResult> ToggleLike(int postId, [FromBody] LikeRequest request)
    {
        var existingLike = await _context.PostLikes
            .FirstOrDefaultAsync(pl => pl.PostId == postId && pl.UserId == request.UserId);

        if (existingLike != null)
        {
            // Unlike
            _context.PostLikes.Remove(existingLike);
        }
        else
        {
            // Like
            var newLike = new PostLike
            {
                PostId = postId,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            };
            _context.PostLikes.Add(newLike);
        }

        await _context.SaveChangesAsync();

        var likeCount = await _context.PostLikes
            .Where(pl => pl.PostId == postId)
            .CountAsync();

        return Ok(new { likeCount = likeCount, isLiked = existingLike == null });
    }

    // POST: api/UserPosts
    [HttpPost]
    public async Task<ActionResult<UserPost>> CreateUserPost([FromBody] CreateUserPostRequest request)
    {
        var userPost = new UserPost
        {
            UserId = request.UserId,
            Type = request.Type,
            CourseId = request.CourseId,
            Title = request.Title,
            Description = request.Description,
            PostImg = request.PostImg,
            ApproveStatus = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.UserPosts.Add(userPost);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserPost), new { id = userPost.PostId }, userPost);
    }
}

public class LikeRequest
{
    public int UserId { get; set; }
}

public class CreateUserPostRequest
{
    public int UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PostImg { get; set; } = string.Empty;
}

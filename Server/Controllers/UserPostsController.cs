using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Server.Controllers;

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
    public async Task<ActionResult<IEnumerable<object>>> GetUserPosts([FromQuery] string? filter = null, [FromQuery] int? userId = null, [FromQuery] int? courseId = null)
    {
        // Build base query with includes
        var query = _context.UserPosts
            .Include(p => p.User)
            .Include(p => p.Course)
                .ThenInclude(c => c!.Category)
            .Where(p => p.DeletedAt == null);

        // Apply filter: default to only approved posts for public consumption.
        // For admin views, caller can pass ?filter=pending to retrieve pending posts,
        // or filter=all to retrieve everything (not recommended for public).
        if (!string.IsNullOrWhiteSpace(filter))
        {
            var f = filter.Trim().ToLower();
            if (f == "pending")
                query = query.Where(p => p.ApproveStatus.ToLower() == "pending");
            else if (f == "approved")
                query = query.Where(p => p.ApproveStatus.ToLower() == "approved");
            else if (f == "rejected")
                query = query.Where(p => p.ApproveStatus.ToLower() == "rejected");
            else if (f == "all")
            {
                // no additional filter - return all non-deleted posts
            }
            else
                query = query.Where(p => p.ApproveStatus.ToLower() == f);
        }
        else
        {
            // default behavior: only return approved posts (public listing)
            query = query.Where(p => p.ApproveStatus == "Approved");
        }

        if (userId.HasValue)
        {
            // ensure user-specific requests can still filter by user id
            query = query.Where(p => p.UserId == userId.Value);
        }

        if (courseId.HasValue)
        {
            // filter by course id
            query = query.Where(p => p.CourseId == courseId.Value);
        }

        var posts = await query
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var postIds = posts.Select(p => p.PostId).ToList();
        var likeCounts = await _context.PostLikes
            .Where(pl => postIds.Contains(pl.PostId))
            .GroupBy(pl => pl.PostId)
            .Select(g => new { PostId = g.Key, Count = g.Count() })
            .ToListAsync();

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
            // provide both userName and user for frontend convenience
            userName = p.User?.Username ?? "Unknown",
            user = p.User?.Username ?? "Unknown",
            userFirstName = p.User?.FirstName ?? "",
            userLastName = p.User?.LastName ?? "",
            userProfileImg = p.User?.ProfileImg ?? "",
            type = p.Type,
            courseId = p.CourseId,
            course = p.Course != null ? new { id = p.Course.CourseId, name = p.Course.Title } : null,
            courseName = p.Course?.Title ?? "",
            categoryName = p.Course?.Category?.Title ?? "",
            title = p.Title,
            description = p.Description,
            postImg = p.PostImg,
            createdAt = p.CreatedAt,
            // provide fields matching frontend expectations
            approveStatus = p.ApproveStatus,
            likes = likeCounts.FirstOrDefault(lc => lc.PostId == p.PostId)?.Count ?? 0,
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
                .ThenInclude(c => c!.Category)
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
            userName = p.User?.Username ?? "Unknown",
            userFirstName = p.User?.FirstName ?? "",
            userLastName = p.User?.LastName ?? "",
            userProfileImg = p.User?.ProfileImg ?? "",
            type = p.Type,
            courseId = p.CourseId,
            courseName = p.Course?.Title ?? "",
            categoryName = p.Course?.Category?.Title ?? "",
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
                .ThenInclude(c => c!.Category)
            .Where(p => p.PostId == id && p.DeletedAt == null)
            .FirstOrDefaultAsync();

        if (post == null) return NotFound();

        var likeCount = await _context.PostLikes.CountAsync(pl => pl.PostId == id);

        var isLiked = false;
        if (userId.HasValue)
        {
            isLiked = await _context.PostLikes.AnyAsync(pl => pl.PostId == id && pl.UserId == userId.Value);
        }

        return Ok(new
        {
            postId = post.PostId,
            userId = post.UserId,
            userName = post.User?.Username ?? "Unknown",
            userFirstName = post.User?.FirstName ?? "",
            userLastName = post.User?.LastName ?? "",
            userProfileImg = post.User?.ProfileImg ?? "",
            type = post.Type,
            courseId = post.CourseId,
            courseName = post.Course?.Title ?? "",
            categoryName = post.Course?.Category?.Title ?? "",
            title = post.Title,
            description = post.Description,
            postImg = post.PostImg,
            createdAt = post.CreatedAt,
            likeCount = likeCount,
            isLiked = isLiked
        });
    }

    // POST toggle like
    [HttpPost("{postId}/like")]
    public async Task<ActionResult> ToggleLike(int postId, [FromBody] LikeRequest request)
    {
        var existingLike = await _context.PostLikes
            .FirstOrDefaultAsync(pl => pl.PostId == postId && pl.UserId == request.UserId);

        if (existingLike != null)
        {
            _context.PostLikes.Remove(existingLike);
        }
        else
        {
            _context.PostLikes.Add(new PostLike
            {
                PostId = postId,
                UserId = request.UserId,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();

        var likeCount = await _context.PostLikes.CountAsync(pl => pl.PostId == postId);

        return Ok(new { likeCount = likeCount, isLiked = existingLike == null });
    }

    // POST create
    [HttpPost]
    public async Task<ActionResult<UserPost>> CreateUserPost([FromBody] CreateUserPostRequest request)
    {
        // Validate that if Type is "course", CourseId must be provided
        if (request.Type.ToLower() == "course" && (!request.CourseId.HasValue || request.CourseId.Value <= 0))
        {
            return BadRequest(new { message = "CourseId is required when post type is 'course'" });
        }

        // Validate that user is enrolled in the course before allowing them to post about it
        if (request.Type.ToLower() == "course" && request.CourseId.HasValue)
        {
            var isEnrolled = await _context.CourseUserActivities
                .AnyAsync(a => a.UserId == request.UserId && a.CourseId == request.CourseId.Value && a.Registered == true);
            
            if (!isEnrolled)
            {
                return BadRequest(new { message = "You must be enrolled in this course to post about it" });
            }
        }

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

    // ADMIN: Approve
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApprovePost(int id)
    {
        var post = await _context.UserPosts.FindAsync(id);
        if (post == null) return NotFound();

        post.ApproveStatus = "Approved";
        
        // If this is a course-related post, check if user completed quiz, then mark course as completed
        if (post.CourseId.HasValue && post.CourseId > 0)
        {
            var activity = await _context.CourseUserActivities
                .FirstOrDefaultAsync(a => a.UserId == post.UserId && a.CourseId == post.CourseId.Value);
            
            // Only mark as completed if quiz is completed AND post is approved
            if (activity != null && !string.IsNullOrEmpty(activity.QuizStatus) && activity.QuizStatus.ToLower() == "completed")
            {
                activity.Completed = true;
            }
        }
        
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    // ADMIN: Reject
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectPost(int id)
    {
        var post = await _context.UserPosts.FindAsync(id);
        if (post == null) return NotFound();

        post.ApproveStatus = "Rejected";
        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }

    // DELETE Post
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var post = await _context.UserPosts.FindAsync(id);
        if (post == null) return NotFound();

        var likes = _context.PostLikes.Where(pl => pl.PostId == id);
        _context.PostLikes.RemoveRange(likes);

        _context.UserPosts.Remove(post);
        await _context.SaveChangesAsync();

        return NoContent();
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
    public int? CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PostImg { get; set; } = string.Empty;
}

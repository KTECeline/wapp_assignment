using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: /api/Reports/UsersGrowth
    // Returns weekly new user counts for the last 4 weeks (oldest first)
    [HttpGet("UsersGrowth")]
    public async Task<ActionResult<IEnumerable<object>>> GetUsersGrowth([FromQuery] int weeks = 4)
    {
        weeks = Math.Max(1, Math.Min(52, weeks));
        var now = DateTime.UtcNow;
        var start = now.AddDays(-weeks * 7);
        var users = await _context.Users
            .Where(u => u.CreatedAt >= start && u.DeletedAt == null)
            .ToListAsync();
        var result = new List<object>();
        for (int i = 0; i < weeks; i++)
        {
            var wStart = start.AddDays(i * 7);
            var wEnd = wStart.AddDays(7);
            var count = users.Count(u => u.CreatedAt >= wStart && u.CreatedAt < wEnd);
            result.Add(new { name = $"W{i + 1}", value = count });
        }
        return Ok(result);
    }

    // GET: /api/Reports/CoursePopularity
    // Returns courses ordered by total enrollments (uses CourseStats when available)
    [HttpGet("CoursePopularity")]
    public async Task<ActionResult<IEnumerable<object>>> GetCoursePopularity()
    {
        var stats = await _context.CourseStats
            .Include(s => s.Course)
            .OrderByDescending(s => s.TotalEnrollments)
            .ToListAsync();

        var list = stats.Select(s => new { name = s.Course.Title, value = s.TotalEnrollments }).ToList();
        // Fallback: if no stats, return basic course list with zero values
        if (!list.Any())
        {
            var courses = await _context.Courses.Where(c => !c.Deleted).ToListAsync();
            return Ok(courses.Select(c => new { name = c.Title, value = 0 }));
        }
        return Ok(list);
    }

    // GET: /api/Reports/Engagement
    // Returns monthly engagement counts for the last `months` months (month name + count)
    [HttpGet("Engagement")]
    public async Task<ActionResult<IEnumerable<object>>> GetEngagement([FromQuery] int months = 6)
    {
        months = Math.Max(1, Math.Min(24, months));
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1).AddMonths(-(months - 1));
        var activities = await _context.CourseUserActivities
            .Where(a => (a.QuizStartTime.HasValue && a.QuizStartTime.Value >= start))
            .ToListAsync();

        var result = new List<object>();
        for (int i = 0; i < months; i++)
        {
            var month = start.AddMonths(i);
            var monthStart = new DateTime(month.Year, month.Month, 1);
            var monthEnd = monthStart.AddMonths(1);
            var count = activities.Count(a => a.QuizStartTime >= monthStart && a.QuizStartTime < monthEnd);
            result.Add(new { name = monthStart.ToString("MMM yyyy"), value = count });
        }
        return Ok(result);
    }

    // GET: /api/Reports/Feedbacks
    // Returns counts grouped by feedback Type
    [HttpGet("Feedbacks")]
    public async Task<ActionResult<IEnumerable<object>>> GetFeedbacks()
    {
        var fb = await _context.UserFeedbacks
            .Where(f => f.DeletedAt == null)
            .ToListAsync();

        var grouped = fb.GroupBy(f => string.IsNullOrWhiteSpace(f.Type) ? "Other" : f.Type)
            .Select(g => new { name = g.Key, value = g.Count() })
            .ToList();

        return Ok(grouped);
    }

    // GET: /api/Reports/CompletionRate?months=6
    // Returns completion rate (%) per month for the last `months` months (default 6)
    [HttpGet("CompletionRate")]
    public async Task<ActionResult<IEnumerable<object>>> GetCompletionRate([FromQuery] int months = 6)
    {
        months = Math.Max(1, Math.Min(24, months));
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1).AddMonths(-(months - 1));

        var result = new List<object>();
        for (int i = 0; i < months; i++)
        {
            var month = start.AddMonths(i);
            var monthStart = new DateTime(month.Year, month.Month, 1);
            var monthEnd = monthStart.AddMonths(1);

            var startedCount = await _context.CourseUserActivities
                .Where(a => a.QuizStartTime.HasValue && a.QuizStartTime.Value >= monthStart && a.QuizStartTime.Value < monthEnd)
                .CountAsync();

            var completedCount = await _context.CourseUserActivities
                .Where(a => a.QuizStartTime.HasValue && a.QuizStartTime.Value >= monthStart && a.QuizStartTime.Value < monthEnd
                            && (a.QuizProgress >= 100 || a.QuizEndTime.HasValue))
                .CountAsync();

            double rate = startedCount == 0 ? 0 : (double)completedCount / startedCount * 100.0;
            result.Add(new { name = monthStart.ToString("MMM yyyy"), value = Math.Round(rate, 2) });
        }
        return Ok(result);
    }

    // GET: /api/Reports/AvgRating?months=6
    // Returns average rating per month for the last `months` months (default 6)
    [HttpGet("AvgRating")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvgRating([FromQuery] int months = 6)
    {
        months = Math.Max(1, Math.Min(24, months));
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1).AddMonths(-(months - 1));

        var result = new List<object>();
        for (int i = 0; i < months; i++)
        {
            var month = start.AddMonths(i);
            var monthStart = new DateTime(month.Year, month.Month, 1);
            var monthEnd = monthStart.AddMonths(1);

            var ratingsQuery = _context.UserFeedbacks
                .Where(f => f.CreatedAt >= monthStart && f.CreatedAt < monthEnd && f.DeletedAt == null);

            double avg = 0.0;
            var any = await ratingsQuery.AnyAsync();
            if (any)
            {
                avg = await ratingsQuery.AverageAsync(f => (double)f.Rating);
            }
            // round to one decimal for display
            result.Add(new { name = monthStart.ToString("MMM yyyy"), value = Math.Round(avg, 2) });
        }
        return Ok(result);
    }

    // GET: /api/Reports/Export?months=6
    // Returns a CSV export of key report metrics: CompletionRate (monthly), AvgRating (monthly), CoursePopularity, Feedbacks
    [HttpGet("Export")]
    public async Task<IActionResult> Export([FromQuery] int months = 6)
    {
        months = Math.Max(1, Math.Min(24, months));
        // Gather data
        var completion = (await GetCompletionRate(months)).Value as IEnumerable<object> ?? Enumerable.Empty<object>();
        var avgr = (await GetAvgRating(months)).Value as IEnumerable<object> ?? Enumerable.Empty<object>();
        var coursePop = (await GetCoursePopularity()).Value as IEnumerable<object> ?? Enumerable.Empty<object>();
        var feedbacks = (await GetFeedbacks()).Value as IEnumerable<object> ?? Enumerable.Empty<object>();

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("section,name,value");

        foreach (var item in completion)
        {
            // item is anonymous { name, value }
            var props = item.GetType().GetProperty("name");
            var pval = item.GetType().GetProperty("value");
            var name = props?.GetValue(item)?.ToString() ?? "";
            var val = pval?.GetValue(item)?.ToString() ?? "";
            sb.AppendLine($"CompletionRate,{EscapeCsv(name)},{EscapeCsv(val)}");
        }

        foreach (var item in avgr)
        {
            var props = item.GetType().GetProperty("name");
            var pval = item.GetType().GetProperty("value");
            var name = props?.GetValue(item)?.ToString() ?? "";
            var val = pval?.GetValue(item)?.ToString() ?? "";
            sb.AppendLine($"AvgRating,{EscapeCsv(name)},{EscapeCsv(val)}");
        }

        foreach (var item in coursePop)
        {
            var props = item.GetType().GetProperty("name");
            var pval = item.GetType().GetProperty("value");
            var name = props?.GetValue(item)?.ToString() ?? "";
            var val = pval?.GetValue(item)?.ToString() ?? "";
            sb.AppendLine($"CoursePopularity,{EscapeCsv(name)},{EscapeCsv(val)}");
        }

        foreach (var item in feedbacks)
        {
            var props = item.GetType().GetProperty("name");
            var pval = item.GetType().GetProperty("value");
            var name = props?.GetValue(item)?.ToString() ?? "";
            var val = pval?.GetValue(item)?.ToString() ?? "";
            sb.AppendLine($"Feedbacks,{EscapeCsv(name)},{EscapeCsv(val)}");
        }

        var csv = sb.ToString();
        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", "reports.csv");
    }

    private string EscapeCsv(string s)
    {
        if (s == null) return string.Empty;
        if (s.Contains(",") || s.Contains("\n") || s.Contains("\""))
        {
            return "\"" + s.Replace("\"", "\"\"") + "\"";
        }
        return s;
    }
}

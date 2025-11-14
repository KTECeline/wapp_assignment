using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetCourses([FromQuery] int? categoryId = null)
    {
        var query = _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .Where(c => !c.Deleted);

        if (categoryId.HasValue)
        {
            query = query.Where(c => c.CategoryId == categoryId.Value);
        }

        var courses = await query.ToListAsync();

        // Calculate average ratings and review counts for each course
        var courseIds = courses.Select(c => c.CourseId).ToList();
        
        var reviewStats = await _context.UserFeedbacks
            .Where(f => courseIds.Contains(f.CourseId) && f.Type.ToLower() == "review" && f.DeletedAt == null)
            .GroupBy(f => f.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                AverageRating = g.Average(f => (double)f.Rating),
                TotalReviews = g.Count()
            })
            .ToListAsync();

        var result = courses.Select(c =>
        {
            var stats = reviewStats.FirstOrDefault(r => r.CourseId == c.CourseId);
            return new
            {
                courseId = c.CourseId,
                title = c.Title,
                description = c.Description,
                courseImg = c.CourseImg,
                cookingTimeMin = c.CookingTimeMin,
                servings = c.Servings,
                video = c.Video,
                badgeImg = c.BadgeImg,
                quizBadgeImg = c.QuizBadgeImg,
                levelId = c.LevelId,
                level = c.Level,
                categoryId = c.CategoryId,
                category = c.Category,
                deleted = c.Deleted,
                rating = c.Rating,
                averageRating = stats?.AverageRating ?? 0.0,
                totalReviews = stats?.TotalReviews ?? 0
            };
        });

        return Ok(result);
    }

    // GET: /api/Courses/withstats
    // Returns courses with an added totalEnrollments property (0 when missing)
    [HttpGet("withstats")]
    public async Task<ActionResult<IEnumerable<object>>> GetCoursesWithStats()
    {
        var courses = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .Where(c => !c.Deleted)
            .ToListAsync();

        // Calculate total enrollments from CourseUserActivities
        var enrollmentCounts = await _context.CourseUserActivities
            .Where(a => a.Registered)
            .GroupBy(a => a.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                TotalEnrollments = g.Count()
            })
            .ToListAsync();

        // Calculate average ratings from UserFeedbacks for each course
        var courseRatings = await _context.UserFeedbacks
            .Where(f => f.Type.ToLower() == "review" && f.DeletedAt == null)
            .GroupBy(f => f.CourseId)
            .Select(g => new
            {
                CourseId = g.Key,
                AverageRating = g.Average(f => f.Rating)
            })
            .ToListAsync();

        var result = courses.Select(c =>
        {
            var enrollment = enrollmentCounts.FirstOrDefault(e => e.CourseId == c.CourseId);
            var rating = courseRatings.FirstOrDefault(r => r.CourseId == c.CourseId);
            
            // Update the course rating property with calculated average
            c.Rating = rating != null ? (float)rating.AverageRating : 0;
            
            return new
            {
                course = c,
                totalEnrollments = enrollment?.TotalEnrollments ?? 0
            };
        });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetCourse(int id, [FromQuery] int? userId = null)
    {
        var course = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == id && !c.Deleted);

        if (course == null) return NotFound();

        if (userId.HasValue)
        {
            var activity = await _context.CourseUserActivities
                .FirstOrDefaultAsync(a => a.CourseId == id && a.UserId == userId.Value);
            var registered = activity != null && activity.Registered;
            return Ok(new { course, registered });
        }

        return Ok(new { course, registered = false });
    }

    [HttpGet("{id}/full")]
    public async Task<ActionResult<object>> GetCourseWithDetails(int id, [FromQuery] int? userId = null)
    {
        var course = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == id && !c.Deleted);

        if (course == null) return NotFound();

        var tips = await _context.CourseTips
            .Where(t => t.CourseId == id && !t.Deleted)
            .ToListAsync();

        var prepItems = await _context.CoursePrepItems
            .Where(p => p.CourseId == id && !p.Deleted)
            .ToListAsync();

        var steps = await _context.CourseSteps
            .Where(s => s.CourseId == id && !s.Deleted)
            .OrderBy(s => s.Step)
            .ToListAsync();

        var questions = await _context.Questions
            .Where(q => q.CourseId == id && !q.Deleted)
            .ToListAsync();

        // Load MCQ and DragDrop details for each question
        var questionsWithDetails = new List<object>();
        foreach (var q in questions)
        {
            var questionType = (q.QuestionType ?? "").ToLowerInvariant();
            
            if (questionType == "mcq")
            {
                var mcq = await _context.McqQuestions.FindAsync(q.QuestionId);
                if (mcq != null)
                {
                    // Helper to determine if a value is an image URL or text
                    var isImageUrl = (string val) => !string.IsNullOrEmpty(val) && (val.StartsWith("http://") || val.StartsWith("https://") || val.StartsWith("/uploads/"));
                    
                    questionsWithDetails.Add(new
                    {
                        questionId = q.QuestionId,
                        questionText = q.QuestionText,
                        questionType = q.QuestionType,
                        questionImg = mcq.QuestionMedia,
                        correctAnswer = int.TryParse(mcq.QuestionAnswer, out var answer) ? answer : 0,
                        options = new[]
                        {
                            new { 
                                optionText = isImageUrl(mcq.Option1) ? string.Empty : mcq.Option1, 
                                optionImg = isImageUrl(mcq.Option1) ? mcq.Option1 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(mcq.Option2) ? string.Empty : mcq.Option2, 
                                optionImg = isImageUrl(mcq.Option2) ? mcq.Option2 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(mcq.Option3) ? string.Empty : mcq.Option3, 
                                optionImg = isImageUrl(mcq.Option3) ? mcq.Option3 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(mcq.Option4) ? string.Empty : mcq.Option4, 
                                optionImg = isImageUrl(mcq.Option4) ? mcq.Option4 : string.Empty 
                            }
                        }
                    });
                }
            }
            else if (questionType == "dragdrop")
            {
                var dd = await _context.DragDropQuestions.FindAsync(q.QuestionId);
                if (dd != null)
                {
                    // Helper to determine if a value is an image URL or text
                    var isImageUrl = (string val) => !string.IsNullOrEmpty(val) && (val.StartsWith("http://") || val.StartsWith("https://") || val.StartsWith("/uploads/"));
                    
                    questionsWithDetails.Add(new
                    {
                        questionId = q.QuestionId,
                        questionText = q.QuestionText,
                        questionType = q.QuestionType,
                        items = new[]
                        {
                            new { 
                                itemText = isImageUrl(dd.Item1) ? string.Empty : dd.Item1, 
                                itemImg = isImageUrl(dd.Item1) ? dd.Item1 : string.Empty 
                            },
                            new { 
                                itemText = isImageUrl(dd.Item2) ? string.Empty : dd.Item2, 
                                itemImg = isImageUrl(dd.Item2) ? dd.Item2 : string.Empty 
                            },
                            new { 
                                itemText = isImageUrl(dd.Item3) ? string.Empty : dd.Item3, 
                                itemImg = isImageUrl(dd.Item3) ? dd.Item3 : string.Empty 
                            },
                            new { 
                                itemText = isImageUrl(dd.Item4) ? string.Empty : dd.Item4, 
                                itemImg = isImageUrl(dd.Item4) ? dd.Item4 : string.Empty 
                            }
                        },
                        options = new[]
                        {
                            new { 
                                optionText = isImageUrl(dd.Option1) ? string.Empty : dd.Option1, 
                                optionImg = isImageUrl(dd.Option1) ? dd.Option1 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(dd.Option2) ? string.Empty : dd.Option2, 
                                optionImg = isImageUrl(dd.Option2) ? dd.Option2 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(dd.Option3) ? string.Empty : dd.Option3, 
                                optionImg = isImageUrl(dd.Option3) ? dd.Option3 : string.Empty 
                            },
                            new { 
                                optionText = isImageUrl(dd.Option4) ? string.Empty : dd.Option4, 
                                optionImg = isImageUrl(dd.Option4) ? dd.Option4 : string.Empty 
                            }
                        }
                    });
                }
            }
            else
            {
                // Unknown type or no details, just return basic question
                questionsWithDetails.Add(new
                {
                    questionId = q.QuestionId,
                    questionText = q.QuestionText,
                    questionType = q.QuestionType,
                    options = new object[0]
                });
            }
        }

        var registered = false;
        if (userId.HasValue)
        {
            var activity = await _context.CourseUserActivities
                .FirstOrDefaultAsync(a => a.CourseId == id && a.UserId == userId.Value);
            registered = activity != null && activity.Registered;
        }

        return Ok(new
        {
            course,
            tips,
            prepItems,
            steps,
            questions = questionsWithDetails,
            registered
        });
    }

    [HttpPost]
    public async Task<ActionResult<Course>> CreateCourse(Course course)
    {
        // Validate that LevelId and CategoryId exist
        var levelExists = await _context.Levels.AnyAsync(l => l.LevelId == course.LevelId && !l.Deleted);
        var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == course.CategoryId && !c.Deleted);

        if (!levelExists)
        {
            return BadRequest(new { error = "Invalid LevelId. Level does not exist." });
        }

        if (!categoryExists)
        {
            return BadRequest(new { error = "Invalid CategoryId. Category does not exist." });
        }

        course.Deleted = false;

        // Clear navigation properties to avoid validation issues
        course.Level = null!;
        course.Category = null!;

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        var createdCourse = await _context.Courses
            .Include(c => c.Level)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.CourseId == course.CourseId);

        return CreatedAtAction(nameof(GetCourse), new { id = course.CourseId }, createdCourse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, Course update)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();

        course.Title = update.Title;
        course.Description = update.Description;
        course.CourseImg = update.CourseImg;
        course.CookingTimeMin = update.CookingTimeMin;
        course.Servings = update.Servings;
        course.Video = update.Video;
        course.BadgeImg = update.BadgeImg;
        course.QuizBadgeImg = update.QuizBadgeImg;
        course.LevelId = update.LevelId;
        course.CategoryId = update.CategoryId;

        await _context.SaveChangesAsync();
        return Ok(course);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null) return NotFound();

        course.Deleted = true;
        await _context.SaveChangesAsync();
        return NoContent();
    }

}

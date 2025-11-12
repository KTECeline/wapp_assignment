using Microsoft.EntityFrameworkCore;

namespace Server.Data;

public static class DatabaseSeeder
{
    public static void Initialize(ApplicationDbContext context)
    {
        // Try to apply migrations; if the model has pending changes relative to migrations
        // (common when local model was updated but migrations weren't created), fall back
        // to EnsureCreated so seeding can still run in local/dev environments.
        try
        {
            context.Database.Migrate();
        }
        catch (InvalidOperationException ex)
        {
            // If EF reports pending model changes, use EnsureCreated as a best-effort fallback.
            if (ex.Message?.Contains("PendingModelChangesWarning") == true || ex.Message?.Contains("pending changes") == true)
            {
                context.Database.EnsureCreated();
            }
            else
            {
                throw;
            }
        }

        // Do not early-return just because some users exist.
        // Instead, we'll add any missing seed entries (idempotent by key) so running
        // the seeder repeatedly is safe and will not skip other tables.

    // Add test users (only insert those that don't already exist)
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
                Username = "alice",
                UserType = "instructor",
                Email = "alice@example.com",
                Password = "alice123",
                FirstName = "Alice",
                LastName = "Baker",
                ProfileImg = "alice.jpg",
                Gender = "F",
                DOB = new DateTime(1988, 3, 12),
                CreatedAt = DateTime.UtcNow.AddDays(-90)
            },
            new User
            {
                Username = "bob",
                UserType = "user",
                Email = "bob@example.com",
                Password = "bob123",
                FirstName = "Bob",
                LastName = "Cook",
                ProfileImg = "bob.jpg",
                Gender = "M",
                DOB = new DateTime(1992, 7, 22),
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            },
            new User
            {
                Username = "carol",
                UserType = "user",
                Email = "carol@example.com",
                Password = "carol123",
                FirstName = "Carol",
                LastName = "Dough",
                ProfileImg = "carol.jpg",
                Gender = "F",
                DOB = new DateTime(1997, 11, 2),
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new User
            {
                Username = "dave",
                UserType = "user",
                Email = "dave@example.com",
                Password = "dave123",
                FirstName = "Dave",
                LastName = "Roll",
                ProfileImg = "dave.jpg",
                Gender = "M",
                DOB = new DateTime(2000, 6, 5),
                CreatedAt = DateTime.UtcNow.AddDays(-1)
            }
        };

        // Only add users that are missing (by username) to avoid duplicates
        var existingUsernames = context.Users.Select(u => u.Username).ToHashSet();
        var usersToAdd = users.Where(u => !existingUsernames.Contains(u.Username)).ToArray();
        if (usersToAdd.Any())
        {
            context.Users.AddRange(usersToAdd);
            context.SaveChanges();
        }

        // Load the canonical user entities from the DB so we have their IDs and tracked instances
    var dbUsers = users.Select(u => context.Users.First(x => x.Username == u.Username)).ToArray();

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

        // Only add categories that don't already exist (by title) to avoid duplicates
        var existingCategoryTitles = context.Categories.Select(c => c.Title).ToHashSet();
        var categoriesToAdd = categories.Where(c => !existingCategoryTitles.Contains(c.Title)).ToArray();
        if (categoriesToAdd.Any())
        {
            context.Categories.AddRange(categoriesToAdd);
        }

        // Add test levels

        var levels = new[]
        {
            new Level { Title = "Level 1", Description = "First level" },
            new Level { Title = "Level 2", Description = "Second level" },
            new Level { Title = "Level 3", Description = "Third level" }
        };

        // Only add levels that don't already exist (by title)
        var existingLevelTitles = context.Levels.Select(l => l.Title).ToHashSet();
        var levelsToAdd = levels.Where(l => !existingLevelTitles.Contains(l.Title)).ToArray();
        if (levelsToAdd.Any())
        {
            context.Levels.AddRange(levelsToAdd);
        }

        // Persist categories and levels so we can reference their generated IDs
        context.SaveChanges();

        // Load DB-backed categories and levels so we can reference their real IDs
        var dbCategories = categories.Select(c => context.Categories.First(x => x.Title == c.Title)).ToArray();
        var dbLevels = levels.Select(l => context.Levels.First(x => x.Title == l.Title)).ToArray();

        // Create some courses tied to the existing categories and levels (use DB IDs)
        var courses = new[]
        {
            new Course
            {
                Title = "Sourdough Basics",
                Description = "Learn to build and maintain a sourdough starter and bake your first loaf.",
                Rating = 4.7f,
                CourseImg = "sourdough.jpg",
                CookingTimeMin = 240,
                Servings = 2,
                Video = "",
                Deleted = false,
                BadgeImg = "",
                QuizBadgeImg = "",
                LevelId = dbLevels[2].LevelId, // Level 3
                CategoryId = dbCategories.First(c => c.Title == "Sourdough").CategoryId
            },
            new Course
            {
                Title = "Perfect Pizza Dough",
                Description = "Make restaurant-style pizza at home: dough, stretch, sauce and bake tips.",
                Rating = 4.5f,
                CourseImg = "pizza.jpg",
                CookingTimeMin = 90,
                Servings = 4,
                Video = "",
                Deleted = false,
                BadgeImg = "",
                QuizBadgeImg = "",
                LevelId = dbLevels[1].LevelId, // Level 2
                CategoryId = dbCategories.First(c => c.Title == "Pizza").CategoryId
            },
            new Course
            {
                Title = "Basic Cake Decorating",
                Description = "Buttercream basics, filling and simple piping for beginners.",
                Rating = 4.2f,
                CourseImg = "cake.jpg",
                CookingTimeMin = 120,
                Servings = 8,
                Video = "",
                Deleted = false,
                BadgeImg = "",
                QuizBadgeImg = "",
                LevelId = dbLevels[0].LevelId, // Level 1
                CategoryId = dbCategories.First(c => c.Title == "Cake").CategoryId
            }
        };

        // Insert courses using a raw SQL statement to supply the legacy `course_type` column
        // (the model intentionally does not include CourseType). This keeps the model clean
        // while satisfying the DB schema. Use DB-backed IDs when inserting.
        foreach (var c in courses)
        {
            // Skip if a course with the same title already exists
            if (context.Courses.Any(x => x.Title == c.Title))
                continue;

            // Ensure level_id and category_id resolve to existing rows
            var levelId = c.LevelId;
            var categoryId = c.CategoryId;
            context.Database.ExecuteSqlInterpolated($"INSERT INTO Courses (title, description, rating, course_img, cooking_time_min, servings, video, deleted, badge_img, quiz_badge_img, level_id, category_id, course_type) VALUES ({c.Title}, {c.Description}, {c.Rating}, {c.CourseImg}, {c.CookingTimeMin}, {c.Servings}, {c.Video}, {c.Deleted}, {c.BadgeImg}, {c.QuizBadgeImg}, {levelId}, {categoryId}, '')");
        }

        // Reload EF-tracked course entities so we can reference their generated IDs below
        var dbCourses = courses.Select(cc => context.Courses.First(x => x.Title == cc.Title)).ToArray();

        // Add course child items (prep items, steps, tips)
        var prepItems = new List<CoursePrepItem>
        {
            new CoursePrepItem { Title = "Flour", Amount = 500, Metric = "g", Type = "ingredient", CourseId = dbCourses[0].CourseId },
            new CoursePrepItem { Title = "Water", Amount = 350, Metric = "g", Type = "ingredient", CourseId = dbCourses[0].CourseId },
            new CoursePrepItem { Title = "Yeast", Amount = 7, Metric = "g", Type = "ingredient", CourseId = dbCourses[1].CourseId },
            new CoursePrepItem { Title = "Strong Bread Flour", Amount = 600, Metric = "g", Type = "ingredient", CourseId = dbCourses[1].CourseId },
            new CoursePrepItem { Title = "Butter", Amount = 200, Metric = "g", Type = "ingredient", CourseId = dbCourses[2].CourseId }
        };

        var steps = new List<CourseStep>
        {
            new CourseStep { Step = 1, Description = "Mix starter with water and flour.", CourseId = dbCourses[0].CourseId },
            new CourseStep { Step = 2, Description = "Bulk ferment for 4 hours.", CourseId = dbCourses[0].CourseId },
            new CourseStep { Step = 1, Description = "Mix flour, water and yeast.", CourseId = dbCourses[1].CourseId },
            new CourseStep { Step = 2, Description = "Knead for 10 minutes and rest.", CourseId = dbCourses[1].CourseId },
            new CourseStep { Step = 1, Description = "Make buttercream with butter and sugar.", CourseId = dbCourses[2].CourseId }
        };

        var tips = new List<CourseTip>
        {
            new CourseTip { Description = "Use a digital scale for consistent results.", CourseId = dbCourses[0].CourseId },
            new CourseTip { Description = "Preheat your oven with a baking stone.", CourseId = dbCourses[1].CourseId },
            new CourseTip { Description = "Chill the cake layers before stacking.", CourseId = dbCourses[2].CourseId }
        };

        // Only add prep items/steps/tips if they don't already exist for the course
        if (!context.CoursePrepItems.Any(ci => ci.CourseId == dbCourses[0].CourseId))
            context.CoursePrepItems.AddRange(prepItems.Where(p => p.CourseId == dbCourses[0].CourseId || p.CourseId == dbCourses[1].CourseId || p.CourseId == dbCourses[2].CourseId));

        if (!context.CourseSteps.Any(cs => cs.CourseId == dbCourses[0].CourseId))
            context.CourseSteps.AddRange(steps.Where(s => s.CourseId == dbCourses[0].CourseId || s.CourseId == dbCourses[1].CourseId || s.CourseId == dbCourses[2].CourseId));

        if (!context.CourseTips.Any(ct => ct.CourseId == dbCourses[0].CourseId))
            context.CourseTips.AddRange(tips.Where(t => t.CourseId == dbCourses[0].CourseId || t.CourseId == dbCourses[1].CourseId || t.CourseId == dbCourses[2].CourseId));

        context.SaveChanges();

        // Course registrations / activities
        var activities = new List<CourseUserActivity>
        {
            new CourseUserActivity { UserId = dbUsers[1].UserId, CourseId = dbCourses[0].CourseId, Registered = true, Bookmark = true }, // alice registered to sourdough
            new CourseUserActivity { UserId = dbUsers[2].UserId, CourseId = dbCourses[0].CourseId, Registered = true }, // bob
            new CourseUserActivity { UserId = dbUsers[3].UserId, CourseId = dbCourses[1].CourseId, Registered = true }, // carol
            new CourseUserActivity { UserId = dbUsers[4].UserId, CourseId = dbCourses[2].CourseId, Registered = true }  // dave
        };

        // Add activities only if the specific (UserId,CourseId) pair doesn't already exist
        foreach (var act in activities)
        {
            if (!context.CourseUserActivities.Any(a => a.UserId == act.UserId && a.CourseId == act.CourseId))
            {
                context.CourseUserActivities.Add(act);
            }
        }
        context.SaveChanges();

        // Add user feedbacks (reviews/ratings) for courses
        var feedbacks = new[]
        {
            new UserFeedback { UserId = dbUsers[2].UserId, CourseId = dbCourses[0].CourseId, Rating = 5, Type = "review", Title = "Great starter guide", Description = "Followed the steps and my starter came to life.", CreatedAt = DateTime.UtcNow.AddDays(-7) },
            new UserFeedback { UserId = dbUsers[3].UserId, CourseId = dbCourses[0].CourseId, Rating = 4, Type = "review", Title = "Good, long proofs", Description = "Takes time, but worth it.", CreatedAt = DateTime.UtcNow.AddDays(-3) },
            new UserFeedback { UserId = dbUsers[4].UserId, CourseId = dbCourses[1].CourseId, Rating = 4, Type = "review", Title = "Tasty dough", Description = "Crispy crust at home.", CreatedAt = DateTime.UtcNow.AddDays(-2) }
        };

        // Add feedbacks only if the user hasn't already left feedback for the course
        foreach (var fb in feedbacks)
        {
            if (!context.UserFeedbacks.Any(f => f.UserId == fb.UserId && f.CourseId == fb.CourseId && f.Title == fb.Title))
            {
                context.UserFeedbacks.Add(fb);
            }
        }
        context.SaveChanges();

        // Help sessions with messages (users open sessions and admin/instructors reply)
        var helpSessionBob = new HelpSession
        {
            UserId = dbUsers[2].UserId, // bob
            StartSession = DateTime.UtcNow.AddDays(-1),
            EndSession = DateTime.UtcNow.AddHours(-20),
            Messages = new List<Message>
            {
                new Message { Content = "Hi, my dough isn't rising.", SentDate = DateTime.UtcNow.AddDays(-1).AddHours(1), SentByAdmin = false, ViewByAdmin = false, ViewByUser = true },
                new Message { Content = "Can you tell me the temperature of your proofing area?", SentDate = DateTime.UtcNow.AddDays(-1).AddHours(2), SentByAdmin = true, ViewByAdmin = true, ViewByUser = true }
            }
        };

        var helpSessionAlice = new HelpSession
        {
            UserId = dbUsers[1].UserId, // alice (instructor user opened a session as a student in this seed)
            StartSession = DateTime.UtcNow.AddDays(-3),
            EndSession = DateTime.UtcNow.AddDays(-3).AddHours(1),
            Messages = new List<Message>
            {
                new Message { Content = "I'm seeing inconsistent crumb structure when using wholemeal flour.", SentDate = DateTime.UtcNow.AddDays(-3).AddMinutes(10), SentByAdmin = false, ViewByAdmin = false, ViewByUser = true },
                new Message { Content = "Try increasing hydration by 2-3% and mix a little longer to develop gluten.", SentDate = DateTime.UtcNow.AddDays(-3).AddHours(0).AddMinutes(45), SentByAdmin = true, ViewByAdmin = true, ViewByUser = true }
            }
        };

        var helpSessionDave = new HelpSession
        {
            UserId = dbUsers[4].UserId, // dave
            StartSession = DateTime.UtcNow.AddHours(-5),
            EndSession = null, // still open
            Messages = new List<Message>
            {
                new Message { Content = "I started the dough 2 hours ago and it's still sticky. Is that normal?", SentDate = DateTime.UtcNow.AddHours(-4).AddMinutes(30), SentByAdmin = false, ViewByAdmin = false, ViewByUser = true }
            }
        };

        // Add help sessions only when there isn't an existing session for that user with the same start time
        foreach (var hs in new[] { helpSessionBob, helpSessionAlice, helpSessionDave })
        {
            if (!context.HelpSessions.Any(s => s.UserId == hs.UserId && s.StartSession == hs.StartSession))
            {
                context.HelpSessions.Add(hs);
            }
        }
        context.SaveChanges();

        // Posts and likes
        var post = new UserPost
        {
            UserId = dbUsers[2].UserId,
            CourseId = dbCourses[0].CourseId,
            Type = "question",
            Title = "Starter bubbling but not rising",
            Description = "My starter bubbles but the dough remains dense. Any tips?",
            PostImg = "",
            ApproveStatus = "approved",
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        // Add post only if a post with the same title/user doesn't already exist
        var existingPost = context.UserPosts.FirstOrDefault(p => p.UserId == post.UserId && p.Title == post.Title);
        if (existingPost == null)
        {
            context.UserPosts.Add(post);
            context.SaveChanges();
        }
        else
        {
            // use the existing DB post so we have a valid PostId for likes
            post = existingPost;
        }

        var likes = new[]
        {
            new PostLike { UserId = dbUsers[1].UserId, PostId = post.PostId }, // alice likes bob's post
            new PostLike { UserId = dbUsers[3].UserId, PostId = post.PostId }  // carol likes
        };

        foreach (var like in likes)
        {
            if (!context.PostLikes.Any(pl => pl.UserId == like.UserId && pl.PostId == like.PostId))
            {
                context.PostLikes.Add(like);
            }
        }
        context.SaveChanges();

        // Course stats
        var stats = new List<CourseStats>
        {
            new CourseStats { CourseId = dbCourses[0].CourseId, TotalEnrollments = 2, CompletionRate = 20, AverageRating = 5, TotalReviews = 2, UpdatedAt = DateTime.UtcNow },
            new CourseStats { CourseId = dbCourses[1].CourseId, TotalEnrollments = 1, CompletionRate = 0, AverageRating = 4, TotalReviews = 1, UpdatedAt = DateTime.UtcNow },
            new CourseStats { CourseId = dbCourses[2].CourseId, TotalEnrollments = 1, CompletionRate = 0, AverageRating = 0, TotalReviews = 0, UpdatedAt = DateTime.UtcNow }
        };

        // Add or update course stats: if stats exist for the course, update; otherwise insert
        foreach (var st in stats)
        {
            var existing = context.CourseStats.FirstOrDefault(cs => cs.CourseId == st.CourseId);
            if (existing == null)
            {
                context.CourseStats.Add(st);
            }
            else
            {
                existing.TotalEnrollments = st.TotalEnrollments;
                existing.CompletionRate = st.CompletionRate;
                existing.AverageRating = st.AverageRating;
                existing.TotalReviews = st.TotalReviews;
                existing.UpdatedAt = st.UpdatedAt;
            }
        }
        context.SaveChanges();
    }
}
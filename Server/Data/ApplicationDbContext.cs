using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Level> Levels { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<UserStatistic> UserStatistics { get; set; }
    public DbSet<CourseStats> CourseStats { get; set; }
    public DbSet<AdminActivity> AdminActivities { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<Badge> Badges { get; set; }
    public DbSet<CoursePrepItem> CoursePrepItems { get; set; }
    public DbSet<CourseStep> CourseSteps { get; set; }
    public DbSet<CourseTip> CourseTips { get; set; }
    public DbSet<CourseUserActivity> CourseUserActivities { get; set; }
    public DbSet<DragDropQuestion> DragDropQuestions { get; set; }
    public DbSet<HelpSession> HelpSessions { get; set; }
    public DbSet<McqQuestion> McqQuestions { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<PostLike> PostLikes { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<UserFeedback> UserFeedbacks { get; set; }
    public DbSet<UserLoginActivity> UserLoginActivities { get; set; }
    public DbSet<UserPost> UserPosts { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=app.db");  // SQLite DB file
    }
}
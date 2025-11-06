using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserStatistic
{
    [Key]
    [Column("stats_id")]
    public int StatsId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("total_courses_done")]
    public int TotalCoursesDone { get; set; }

    [Column("total_posts")]
    public int TotalPosts { get; set; }

    [Column("total_likes_received")]
    public int TotalLikesReceived { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseStats
{
    [Key]
    [Column("course_stats_id")]
    public int CourseStatsId { get; set; }

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    [Column("total_enrollments")]
    public int TotalEnrollments { get; set; }

    [Column("completion_rate")]
    public int CompletionRate { get; set; }

    [Column("average_rating")]
    public int AverageRating { get; set; }

    [Column("total_reviews")]
    public int TotalReviews { get; set; }

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}
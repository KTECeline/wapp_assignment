using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Course
{
    [Key]
    [Column("course_id")]
    public int CourseId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("rating")]
    public float Rating { get; set; }

    [Column("course_img")]
    [StringLength(255)]
    public string CourseImg { get; set; } = string.Empty;

    [Column("cooking_time_min")]
    public int CookingTimeMin { get; set; }

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_type")]
    [StringLength(255)]
    public string CourseType { get; set; } = string.Empty;

    [Column("badge_img")]
    [StringLength(255)]
    public string BadgeImg { get; set; } = string.Empty;

    [Column("quiz_badge_img")]
    [StringLength(255)]
    public string QuizBadgeImg { get; set; } = string.Empty;

    [Column("level_id")]
    [ForeignKey("Level")]
    public int LevelId { get; set; }
    public Level Level { get; set; } = null!;

    [Column("category_id")]
    [ForeignKey("Category")]
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
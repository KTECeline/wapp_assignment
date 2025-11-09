using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
    public string CourseImg { get; set; } = string.Empty;

    [Column("cooking_time_min")]
    public int CookingTimeMin { get; set; }

    [Column("servings")]
    public int Servings { get; set; }

    [Column("video")]
    [StringLength(500)]
    public string Video { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_type")]
    [StringLength(255)]
    public string CourseType { get; set; } = string.Empty;

    [Column("badge_img")]
    public string BadgeImg { get; set; } = string.Empty;

    [Column("quiz_badge_img")]
    public string QuizBadgeImg { get; set; } = string.Empty;

    [Column("level_id")]
    [ForeignKey("Level")]
    public int LevelId { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public Level? Level { get; set; }

    [Column("category_id")]
    [ForeignKey("Category")]
    public int CategoryId { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public Category? Category { get; set; }
}
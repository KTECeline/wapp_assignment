using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserPost
{
    [Key]
    [Column("post_id")]
    public int PostId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("type")]
    [StringLength(255)]
    public string Type { get; set; } = string.Empty;

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    [Column("file")]
    [StringLength(255)]
    public string File { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("post_main")]
    [StringLength(255)]
    public string PostMain { get; set; } = string.Empty;

    [Column("created_AT")]
    public DateTime CreatedAt { get; set; }

    [Column("deleted_AT")]
    public DateTime? DeletedAt { get; set; }
}
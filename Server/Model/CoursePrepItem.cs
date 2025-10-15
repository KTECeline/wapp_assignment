using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CoursePrepItem
{
    [Key]
    [Column("course_prep_item_id")]
    public int CoursePrepItemId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("type")]
    [StringLength(255)]
    public string Type { get; set; } = string.Empty;

    [Column("amount")]
    public float Amount { get; set; }

    [Column("metric")]
    public float Metric { get; set; }

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}
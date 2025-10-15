using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseTip
{
    [Key]
    [Column("course_tip_id")]
    public int CourseTipId { get; set; }

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}
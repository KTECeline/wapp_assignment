using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseStep
{
    [Key]
    [Column("course_step_id")]
    public int CourseStepId { get; set; }

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("step")]
    public int Step { get; set; }

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_step_img")]
    [StringLength(255)]
    public string CourseStepImg { get; set; } = string.Empty;

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}
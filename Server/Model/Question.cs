using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Question
{
    [Key]
    [Column("question_id")]
    public int QuestionId { get; set; }

    [Column("question")]
    public string QuestionText { get; set; } = string.Empty;

    [Column("question_type")]
    [StringLength(255)]
    public string QuestionType { get; set; } = string.Empty;

    [Column("test_type")]
    [StringLength(255)]
    public string TestType { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}
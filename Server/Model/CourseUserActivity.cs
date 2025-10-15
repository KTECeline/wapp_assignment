using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CourseUserActivity
{
    [Key]
    [Column("activity_id")]
    public int ActivityId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("course_id")]
    [ForeignKey("Course")]
    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    [Column("quiz_status")]
    public string QuizStatus { get; set; } = string.Empty;

    [Column("quiz_start_time")]
    public DateTime? QuizStartTime { get; set; }

    [Column("quiz_end_time")]
    public DateTime? QuizEndTime { get; set; }

    [Column("quiz_total_time")]
    public TimeSpan? QuizTotalTime { get; set; }

    [Column("quiz_mistake")]
    public int QuizMistake { get; set; }

    [Column("quiz_progress")]
    public int QuizProgress { get; set; }

    [Column("exam_status")]
    public string ExamStatus { get; set; } = string.Empty;

    [Column("exam_atternpt")]
    public int ExamAttempt { get; set; }

    [Column("exam_correct")]
    public int ExamCorrect { get; set; }

    [Column("bookmark")]
    public bool Bookmark { get; set; }
}
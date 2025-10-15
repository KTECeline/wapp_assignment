using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class McqQuestion
{
    [Key]
    [Column("question_id")]
    [ForeignKey("Question")]
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    [Column("question_media")]
    [StringLength(255)]
    public string QuestionMedia { get; set; } = string.Empty;

    [Column("option_1")]
    [StringLength(255)]
    public string Option1 { get; set; } = string.Empty;

    [Column("option_2")]
    [StringLength(255)]
    public string Option2 { get; set; } = string.Empty;

    [Column("option_3")]
    [StringLength(255)]
    public string Option3 { get; set; } = string.Empty;

    [Column("option_4")]
    [StringLength(255)]
    public string Option4 { get; set; } = string.Empty;

    [Column("question_answer")]
    [StringLength(255)]
    public string QuestionAnswer { get; set; } = string.Empty;
}
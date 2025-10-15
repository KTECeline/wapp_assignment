using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class DragDropQuestion
{
    [Key]
    [Column("dragdrop_id")]
    [ForeignKey("Question")]
    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    [Column("Item_1")]
    [StringLength(255)]
    public string Item1 { get; set; } = string.Empty;

    [Column("Item_2")]
    [StringLength(255)]
    public string Item2 { get; set; } = string.Empty;

    [Column("Item_3")]
    [StringLength(255)]
    public string Item3 { get; set; } = string.Empty;

    [Column("Item_4")]
    [StringLength(255)]
    public string Item4 { get; set; } = string.Empty;

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
}
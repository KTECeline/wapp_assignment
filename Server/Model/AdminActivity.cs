using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class AdminActivity
{
    [Key]
    [Column("activity_id")]
    public int ActivityId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("date")]
    public DateTime Date { get; set; }

    [Column("action_type")]
    [StringLength(255)]
    public string ActionType { get; set; } = string.Empty;

    [Column("entity")]
    [StringLength(255)]
    public string Entity { get; set; } = string.Empty;

    [Column("entity_id")]
    public int EntityId { get; set; }
}
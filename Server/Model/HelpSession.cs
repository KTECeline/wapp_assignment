using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HelpSession
{
    [Key]
    [Column("session_id")]
    public int SessionId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User? User { get; set; } = null!;

    [Column("start_session")]
    public DateTime StartSession { get; set; }

    [Column("end_session")]
    public DateTime? EndSession { get; set; }

    // Navigation property
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
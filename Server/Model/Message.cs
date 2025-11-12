using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Message
{
    [Key]
    [Column("message_id")]
    public int MessageId { get; set; }

    [Column("session_id")]
    [ForeignKey("Session")]
    public int SessionId { get; set; }
    // Make navigation property nullable so creating a Message does not require the full Session payload
    public HelpSession? Session { get; set; }

    [Column("content")]
    public string Content { get; set; } = string.Empty;

    [Column("sent_date")]
    public DateTime SentDate { get; set; }

    [Column("sent_by_admin")]
    public bool SentByAdmin { get; set; }

    [Column("view_by_user")]
    public bool ViewByUser { get; set; }

    [Column("view_by_admin")]
    public bool ViewByAdmin { get; set; }
}
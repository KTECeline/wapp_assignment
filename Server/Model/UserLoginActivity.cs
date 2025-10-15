using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserLoginActivity
{
    [Key]
    [Column("activity_id")]
    public int ActivityId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("login_date")]
    public DateTime LoginDate { get; set; }

    [Column("logout_date")]
    public DateTime? LogoutDate { get; set; }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class PostLike
{
    [Key]
    [Column("like_id")]
    public int LikeId { get; set; }

    [Column("user_id")]
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column("post_id")]
    [ForeignKey("UserPost")]
    public int PostId { get; set; }
    public UserPost UserPost { get; set; } = null!;
}
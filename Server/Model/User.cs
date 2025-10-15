using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("username")]
    [Required]
    [StringLength(255)]
    public string Username { get; set; } = string.Empty;

    [Column("usertype")]
    [StringLength(255)]
    public string UserType { get; set; } = string.Empty;

    [Column("email")]
    [Required]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [Column("password")]
    [Required]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;

    [Column("first_name")]
    [StringLength(255)]
    public string FirstName { get; set; } = string.Empty;

    [Column("last_name")]
    [StringLength(255)]
    public string LastName { get; set; } = string.Empty;

    [Column("profile_img")]
    [StringLength(255)]
    public string ProfileImg { get; set; } = string.Empty;

    [Column("gender")]
    [StringLength(255)]
    public string Gender { get; set; } = string.Empty;

    [Column("DOB")]
    public DateTime? DOB { get; set; }

    [Column("created_AT")]
    public DateTime CreatedAt { get; set; }

    [Column("deleted_AT")]
    public DateTime? DeletedAt { get; set; }

    [Column("level_id")]
    [ForeignKey("Level")]
    public int? LevelId { get; set; }
    public Level? Level { get; set; }

    [Column("category_id")]
    [ForeignKey("Category")]
    public int? CategoryId { get; set; }
    public Category? Category { get; set; }
}
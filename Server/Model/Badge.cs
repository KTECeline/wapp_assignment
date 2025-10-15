using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Badge
{
    [Key]
    [Column("badge_id")]
    public int BadgeId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("type")]
    [StringLength(255)]
    public string Type { get; set; } = string.Empty;

    [Column("entity_id")]
    public int EntityId { get; set; }

    [Column("requirement")]
    public int Requirement { get; set; }

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("badge_img")]
    [StringLength(255)]
    public string BadgeImg { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }
}
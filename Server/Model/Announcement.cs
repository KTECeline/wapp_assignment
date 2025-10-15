using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Announcement
{
    [Key]
    [Column("ann_id")]
    public int AnnId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("ann_img")]
    [StringLength(255)]
    public string AnnImg { get; set; } = string.Empty;

    [Column("visible")]
    public bool Visible { get; set; }

    [Column("deleted")]
    public bool Deleted { get; set; }
}
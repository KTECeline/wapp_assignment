using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Level
{
    [Key]
    [Column("level_id")]
    public int LevelId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }

    // Navigation property
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
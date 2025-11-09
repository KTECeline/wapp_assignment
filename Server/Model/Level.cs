using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

    // Navigation property - ignore to prevent circular references
    [JsonIgnore]
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
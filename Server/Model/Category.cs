using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Category
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(255)]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("deleted")]
    public bool Deleted { get; set; }

    [Column("cat_img")]
    [StringLength(255)]
    public string CatImg { get; set; } = string.Empty;

    [Column("cat_banner")]
    [StringLength(255)]
    public string CatBanner { get; set; } = string.Empty;

    // Navigation property
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
using System;

public class UserUpdateDto
{
    public string? Username { get; set; }
    public string? UserType { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfileImg { get; set; }
    public string? Gender { get; set; }
    public DateTime? DOB { get; set; }
    public int? LevelId { get; set; }
    public int? CategoryId { get; set; }
}

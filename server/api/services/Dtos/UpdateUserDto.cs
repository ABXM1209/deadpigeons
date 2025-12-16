namespace api.services.Dtos;

public class UpdateUserDto
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Email { get; set; } = null!;
    public int Balance { get; set; }
    public bool Isactive { get; set; }

    // OPTIONAL password
    public string? Password { get; set; }
}
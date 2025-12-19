using System.ComponentModel.DataAnnotations;

namespace api.services.Dtos;

public record CreateUserDto
{
    [Required]
    public required string Name { get; set; }

    [Required]
    public required string Phone { get; set; }

    [Required]
    public required string Email { get; set; }

   
    public  string? Password { get; set; }

    public required int Balance { get; set; }

    public required bool Isactive { get; set; }
}

using Microsoft.AspNetCore.Mvc;
using efscaffold;
using api.services;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MyDbContext _db;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;

    public AuthController(MyDbContext db, IPasswordService passwordService, IJwtService jwtService)
    {
        _db = db;
        _passwordService = passwordService;
        _jwtService = jwtService;
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse
    {
        public string Username { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            return BadRequest(new { error = "EMAIL_OR_PASSWORD_EMPTY" });

        // Check Admins
        var admin = _db.Admins.FirstOrDefault(a => a.Email == request.Email);
        if (admin != null)
        {
            if (!_passwordService.VerifyPassword(request.Password, admin.Password))
                return BadRequest(new { error = "Password is incorrect. Contact support to reset your password." });

            var token = _jwtService.GenerateToken(admin.Email, "admin");
            return Ok(new LoginResponse
            {
                Username = admin.Email,
                Role = "admin",
                Token = token
            });
        }

        // Check Users
        var user = _db.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user != null)
        {
            if (!_passwordService.VerifyPassword(request.Password, user.Password))
                return BadRequest(new { error = "Password is incorrect. Contact support to reset your password." });

            var token = _jwtService.GenerateToken(user.Email, "user");
            return Ok(new LoginResponse
            {
                Username = user.Email,
                Role = "user",
                Token = token
            });
        }

        return BadRequest(new { error = "User not found" });
    }
}

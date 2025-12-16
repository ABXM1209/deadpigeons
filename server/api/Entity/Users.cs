using api.services;
using api.services.Dtos;
using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly IPasswordService _passwordService;

    public UsersController(MyDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    // ----------------------
    // GET: /api/users
    // ----------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // ----------------------
    // GET: /api/users/{id}
    // ----------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound($"User with id {id} not found.");
        return Ok(user);
    }

    // ----------------------
    // POST: /api/users
    // ----------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Password = _passwordService.HashPassword(dto.Password),
            Balance = dto.Balance,
            Isactive = dto.Isactive
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
    
    // ----------------------
    // PUT: /api/users/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
            return NotFound($"User with id {id} not found.");

        existingUser.Name = dto.Name;
        existingUser.Phone = dto.Phone;
        existingUser.Email = dto.Email;
        existingUser.Balance = dto.Balance;
        existingUser.Isactive = dto.Isactive;

        // ✅ ONLY hash if user explicitly changed password
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            existingUser.Password = _passwordService.HashPassword(dto.Password);
        }

        await _context.SaveChangesAsync();
        return Ok(existingUser);
    }


    // ----------------------
    // DELETE: /api/users/{id}
    // ----------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound($"User with id {id} not found.");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok($"User with id {id} deleted successfully.");
    }
}

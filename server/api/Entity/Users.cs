using api.services;
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
    public async Task<IActionResult> Create([FromBody] User user)
    {
        if (user == null)
            return BadRequest("User is null.");

        // ✅ Hash password before saving
        if (!string.IsNullOrEmpty(user.Password))
            user.Password = _passwordService.HashPassword(user.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // ----------------------
    // PUT: /api/users/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] User user)
    {
        if (id != user.Id)
            return BadRequest("Id mismatch.");

        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
            return NotFound($"User with id {id} not found.");

        existingUser.Name = user.Name;
        existingUser.Phone = user.Phone;
        existingUser.Email = user.Email;
        existingUser.Balance = user.Balance;
        existingUser.Isactive = user.Isactive;

        // ✅ Hash password if updated
        if (!string.IsNullOrEmpty(user.Password))
            existingUser.Password = _passwordService.HashPassword(user.Password);

        _context.Users.Update(existingUser);
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

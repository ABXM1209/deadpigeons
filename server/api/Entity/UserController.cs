using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.services; // استدعاء خدمة PasswordService

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

    // GET: /api/Users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // GET: /api/Users/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound($"User with id {id} not found.");

        return Ok(user);
    }

    // POST: /api/Users
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        if (user == null)
            return BadRequest("User is null.");

        user.Id = Guid.NewGuid().ToString();

        // تشفير كلمة المرور قبل الحفظ
        if (!string.IsNullOrEmpty(user.Password))
        {
            user.Password = _passwordService.HashPassword(user.Password);
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    // PUT: /api/Users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] User updatedUser)
    {
        if (id != updatedUser.Id)
            return BadRequest("Id mismatch.");

        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
            return NotFound($"User with id {id} not found.");

        // تحديث الحقول المطلوبة
        existingUser.Name = updatedUser.Name ?? existingUser.Name;
        existingUser.Phone = updatedUser.Phone ?? existingUser.Phone;
        existingUser.Email = updatedUser.Email ?? existingUser.Email;
        existingUser.Balance = updatedUser.Balance != default ? updatedUser.Balance : existingUser.Balance;
        existingUser.Isactive = updatedUser.Isactive;

        // تحديث كلمة المرور فقط إذا تم تمريرها
        if (!string.IsNullOrEmpty(updatedUser.Password))
        {
            existingUser.Password = _passwordService.HashPassword(updatedUser.Password);
        }

        _context.Users.Update(existingUser);
        await _context.SaveChangesAsync();

        return Ok(existingUser);
    }

    // DELETE: /api/Users/{id}
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

using api.services;
using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class AdminsController : ControllerBase
{
    private readonly MyDbContext _context;
    private readonly IPasswordService _passwordService;

    public AdminsController(MyDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    // ----------------------
    // GET: /api/admins
    // ----------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var admins = await _context.Admins.ToListAsync();
        return Ok(admins);
    }

    // ----------------------
    // GET: /api/admins/{id}
    // ----------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var admin = await _context.Admins.FindAsync(id);
        if (admin == null)
            return NotFound($"Admin with id {id} not found.");
        return Ok(admin);
    }

    // ----------------------
    // POST: /api/admins
    // ----------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Admin admin)
    {
        if (admin == null)
            return BadRequest("Admin is null.");

        // ✅ Hash password before saving
        if (!string.IsNullOrEmpty(admin.Password))
            admin.Password = _passwordService.HashPassword(admin.Password);

        _context.Admins.Add(admin);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = admin.Id }, admin);
    }

    // ----------------------
    // PUT: /api/admins/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Admin admin)
    {
        if (id != admin.Id)
            return BadRequest("Id mismatch.");

        var existingAdmin = await _context.Admins.FindAsync(id);
        if (existingAdmin == null)
            return NotFound($"Admin with id {id} not found.");

        existingAdmin.Name = admin.Name;
        existingAdmin.Email = admin.Email;

        // ✅ Hash password if updated
        if (!string.IsNullOrEmpty(admin.Password))
            existingAdmin.Password = _passwordService.HashPassword(admin.Password);

        _context.Admins.Update(existingAdmin);
        await _context.SaveChangesAsync();
        return Ok(existingAdmin);
    }

    // ----------------------
    // DELETE: /api/admins/{id}
    // ----------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var admin = await _context.Admins.FindAsync(id);
        if (admin == null)
            return NotFound($"Admin with id {id} not found.");

        _context.Admins.Remove(admin);
        await _context.SaveChangesAsync();
        return Ok($"Admin with id {id} deleted successfully.");
    }
}

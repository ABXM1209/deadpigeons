using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class BoardHistoryController : ControllerBase
{
    private readonly MyDbContext _context;

    public BoardHistoryController(MyDbContext context)
    {
        _context = context;
    }

    // ----------------------
    // GET: /api/boardhistory
    // ----------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var history = await _context.BoardHistory.ToListAsync();
        return Ok(history);
    }

    // ----------------------
    // GET: /api/boardhistory/{id}
    // ----------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var entry = await _context.BoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"BoardHistory entry with id {id} not found.");
        return Ok(entry);
    }

    // ----------------------
    // GET: /api/boardhistory/user/{userId}  --> history for a specific user
    // ----------------------
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var history = await _context.BoardHistory
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.PlayedAt)
            .ToListAsync();

        return Ok(history);
    }

    // ----------------------
    // POST: /api/boardhistory
    // ----------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BoardHistory entry)
    {
        if (entry == null)
            return BadRequest("BoardHistory entry is null.");

        _context.BoardHistory.Add(entry);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
    }

    // ----------------------
    // PUT: /api/boardhistory/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] BoardHistory entry)
    {
        if (id != entry.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.BoardHistory.FindAsync(id);
        if (existing == null)
            return NotFound($"BoardHistory entry with id {id} not found.");

        // update fields
        existing.UserId = entry.UserId;
        existing.BoardId = entry.BoardId;
        existing.Won = entry.Won;
        existing.PlayedAt = entry.PlayedAt;

        _context.BoardHistory.Update(existing);
        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // ----------------------
    // DELETE: /api/boardhistory/{id}
    // ----------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entry = await _context.BoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"BoardHistory entry with id {id} not found.");

        _context.BoardHistory.Remove(entry);
        await _context.SaveChangesAsync();
        return Ok($"BoardHistory entry with id {id} deleted successfully.");
    }
}

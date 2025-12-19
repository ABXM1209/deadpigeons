using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class UserBoardHistoryController : ControllerBase
{
    private readonly MyDbContext _context;

    public UserBoardHistoryController(MyDbContext context)
    {
        _context = context;
    }

    // GET: /api/userboardhistory
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var history = await _context.UserBoardHistory.ToListAsync();
        return Ok(history);
    }

    // GET: /api/userboardhistory/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var entry = await _context.UserBoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"UserBoardHistory entry with id {id} not found.");

        return Ok(entry);
    }

    // GET: /api/userboardhistory/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var history = await _context.UserBoardHistory
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.Date)
            .ToListAsync();

        return Ok(history);
    }

    // POST: /api/userboardhistory
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserBoardHistory entry)
    {
        if (entry == null)
            return BadRequest("UserBoardHistory entry is null.");

        _context.UserBoardHistory.Add(entry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
    }

    // PUT: /api/userboardhistory/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UserBoardHistory entry)
    {
        if (id != entry.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.UserBoardHistory.FindAsync(id);
        if (existing == null)
            return NotFound($"UserBoardHistory entry with id {id} not found.");

        existing.UserId = entry.UserId;
        existing.BoardId = entry.BoardId;
        existing.IsWinner = entry.IsWinner;
        existing.Date = entry.Date;

        _context.UserBoardHistory.Update(existing);
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: /api/userboardhistory/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entry = await _context.UserBoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"UserBoardHistory entry with id {id} not found.");

        _context.UserBoardHistory.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok($"UserBoardHistory entry with id {id} deleted successfully.");
    }
}

using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class AdminBoardHistoryController : ControllerBase
{
    private readonly MyDbContext _context;

    public AdminBoardHistoryController(MyDbContext context)
    {
        _context = context;
    }

    // GET: /api/adminboardhistory
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var history = await _context.AdminBoardHistory.ToListAsync();
        return Ok(history);
    }

    // GET: /api/adminboardhistory/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var entry = await _context.AdminBoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"AdminBoardHistory entry with id {id} not found.");

        return Ok(entry);
    }

    // POST: /api/adminboardhistory
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdminBoardHistory entry)
    {
        if (entry == null)
            return BadRequest("AdminBoardHistory entry is null.");

        _context.AdminBoardHistory.Add(entry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, entry);
    }

    // PUT: /api/adminboardhistory/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] AdminBoardHistory entry)
    {
        if (id != entry.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.AdminBoardHistory.FindAsync(id);
        if (existing == null)
            return NotFound($"AdminBoardHistory entry with id {id} not found.");

        existing.BoardId = entry.BoardId;
        existing.TotalWinners = entry.TotalWinners;
        existing.WinningUsers = entry.WinningUsers;
        existing.Date = entry.Date;

        _context.AdminBoardHistory.Update(existing);
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: /api/adminboardhistory/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var entry = await _context.AdminBoardHistory.FindAsync(id);
        if (entry == null)
            return NotFound($"AdminBoardHistory entry with id {id} not found.");

        _context.AdminBoardHistory.Remove(entry);
        await _context.SaveChangesAsync();

        return Ok($"AdminBoardHistory entry with id {id} deleted successfully.");
    }
}

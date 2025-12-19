using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class AdminBoardController : ControllerBase
{
    private readonly MyDbContext _context;

    public AdminBoardController(MyDbContext context)
    {
        _context = context;
    }

    // GET: /api/adminboard
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.AdminBoard.ToListAsync();
        return Ok(items);
    }

    // GET: /api/adminboard/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _context.AdminBoard.FindAsync(id);
        if (item == null)
            return NotFound($"AdminBoard with id {id} not found.");

        return Ok(item);
    }

    // POST: /api/adminboard
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdminBoard adminBoard)
    {
        if (adminBoard == null)
            return BadRequest("AdminBoard is null.");

        _context.AdminBoard.Add(adminBoard);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = adminBoard.Id },
            adminBoard);
    }

    // PUT: /api/adminboard/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] AdminBoard adminBoard)
    {
        if (id != adminBoard.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.AdminBoard.FindAsync(id);
        if (existing == null)
            return NotFound($"AdminBoard with id {id} not found.");

        existing.BoardId = adminBoard.BoardId;
        existing.WinningNumbers = adminBoard.WinningNumbers;

        _context.AdminBoard.Update(existing);
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: /api/adminboard/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.AdminBoard.FindAsync(id);
        if (item == null)
            return NotFound($"AdminBoard with id {id} not found.");

        _context.AdminBoard.Remove(item);
        await _context.SaveChangesAsync();

        return Ok($"AdminBoard with id {id} deleted successfully.");
    }
}

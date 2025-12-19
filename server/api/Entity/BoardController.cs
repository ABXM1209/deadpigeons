using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly MyDbContext _context;

    public BoardController(MyDbContext context)
    {
        _context = context;
    }

    // GET: /api/board
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var boards = await _context.Boards.ToListAsync();
        return Ok(boards);
    }

    // GET: /api/board/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound($"Board with id {id} not found.");

        return Ok(board);
    }

    // POST: /api/board
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Board board)
    {
        if (board == null)
            return BadRequest("Board is null.");

        _context.Boards.Add(board);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
    }

    // PUT: /api/board/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Board board)
    {
        if (id != board.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.Boards.FindAsync(id);
        if (existing == null)
            return NotFound($"Board with id {id} not found.");

        existing.IsOpen = board.IsOpen;
        existing.WeekNumber = board.WeekNumber;

        _context.Boards.Update(existing);
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: /api/board/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound($"Board with id {id} not found.");

        _context.Boards.Remove(board);
        await _context.SaveChangesAsync();

        return Ok($"Board with id {id} deleted successfully.");
    }
}

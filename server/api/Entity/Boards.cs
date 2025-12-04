using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class BoardsController : ControllerBase
{
    private readonly MyDbContext _context;

    public BoardsController(MyDbContext context)
    {
        _context = context;
    }

    // ----------------------
    // GET: /api/boards
    // ----------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var boards = await _context.Boards.ToListAsync();
        return Ok(boards);
    }

    // ----------------------
    // GET: /api/boards/{id}
    // ----------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var board = await _context.Boards.FindAsync(id);
        if (board == null)
            return NotFound($"Board with id {id} not found.");
        return Ok(board);
    }

    // ----------------------
    // POST: /api/boards
    // ----------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Board board)
    {
        if (board == null)
            return BadRequest("Board is null.");

        _context.Boards.Add(board);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);
    }

    // ----------------------
    // PUT: /api/boards/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Board board)
    {
        if (id != board.Id)
            return BadRequest("Id mismatch.");

        var existingBoard = await _context.Boards.FindAsync(id);
        if (existingBoard == null)
            return NotFound($"Board with id {id} not found.");

        // update fields
        existingBoard.Name = board.Name;
        existingBoard.Weeknumber = board.Weeknumber;
        existingBoard.Totalwinners = board.Totalwinners;
        existingBoard.Winningnumbers = board.Winningnumbers;
        existingBoard.Winningusers = board.Winningusers;
        existingBoard.Isopen = board.Isopen;

        _context.Boards.Update(existingBoard);
        await _context.SaveChangesAsync();
        return Ok(existingBoard);
    }

    // ----------------------
    // DELETE: /api/boards/{id}
    // ----------------------
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

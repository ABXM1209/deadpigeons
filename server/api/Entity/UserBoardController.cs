using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/[controller]")]
public class UserBoardController : ControllerBase
{
    private readonly MyDbContext _context;

    public UserBoardController(MyDbContext context)
    {
        _context = context;
    }

    // GET: /api/userboard
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _context.UserBoard.ToListAsync();
        return Ok(items);
    }

    // GET: /api/userboard/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _context.UserBoard.FindAsync(id);
        if (item == null)
            return NotFound($"UserBoard entry with id {id} not found.");

        return Ok(item);
    }

    // POST: /api/userboard
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserBoard userBoard)
    {
        if (userBoard == null)
            return BadRequest("UserBoard is null.");

        _context.UserBoard.Add(userBoard);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById),
            new { id = userBoard.Id },
            userBoard);
    }

    // PUT: /api/userboard/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UserBoard userBoard)
    {
        if (id != userBoard.Id)
            return BadRequest("Id mismatch.");

        var existing = await _context.UserBoard.FindAsync(id);
        if (existing == null)
            return NotFound($"UserBoard entry with id {id} not found.");

        existing.BoardId = userBoard.BoardId;
        existing.UserId = userBoard.UserId;
        existing.GuessingNumbers = userBoard.GuessingNumbers;
        existing.WeekRepeat = userBoard.WeekRepeat;

        _context.UserBoard.Update(existing);
        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: /api/userboard/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.UserBoard.FindAsync(id);
        if (item == null)
            return NotFound($"UserBoard entry with id {id} not found.");

        _context.UserBoard.Remove(item);
        await _context.SaveChangesAsync();

        return Ok($"UserBoard entry with id {id} deleted successfully.");
    }
}

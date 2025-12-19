using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Entity;

[ApiController]
[Route("api/transactions")]
public class TransactionController : ControllerBase
{
    private readonly MyDbContext _context;

    public TransactionController(MyDbContext context)
    {
        _context = context;
    }

    // ----------------------
    // GET: /api/transactions
    // ----------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _context.Transactions.ToListAsync();
        return Ok(transactions);
    }

    // ----------------------
    // GET: /api/transactions/{id}
    // ----------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return NotFound($"Transaction with id {id} not found.");
        return Ok(transaction);
    }

    // ----------------------
    // POST: /api/transactions
    // ----------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Transaction transaction)
    {
        if (transaction == null)
            return BadRequest("Transaction is null.");

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, transaction);
    }

    // ----------------------
    // PUT: /api/transactions/{id}
    // ----------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Transaction transaction)
    {
        if (id != transaction.Id)
            return BadRequest("Id mismatch.");

        var existingTransaction = await _context.Transactions.FindAsync(id);
        if (existingTransaction == null)
            return NotFound($"Transaction with id {id} not found.");

        // updating fields
        existingTransaction.Id = transaction.Id;
        existingTransaction.Username = transaction.Username;
        existingTransaction.UserId = transaction.UserId;
        existingTransaction.Transactionid = transaction.Transactionid;
        existingTransaction.Status = transaction.Status;
        existingTransaction.Balance = transaction.Balance;
        existingTransaction.TransactionDate = transaction.TransactionDate;
        
        _context.Transactions.Update(existingTransaction);
        await _context.SaveChangesAsync();
        return Ok(existingTransaction);
    }

    // ----------------------
    // DELETE: /api/transactions/{id}
    // ----------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null)
            return NotFound($"Transaction with id {id} not found.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return Ok($"Transaction with id {id} deleted successfully.");
    }
}

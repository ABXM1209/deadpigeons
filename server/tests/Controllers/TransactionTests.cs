using api.Entity;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;

public class TransactionsTests : TestBase
{
    public TransactionsTests(PostgresFixture fixture) : base(fixture) {}

    [Fact]
    public async Task Create_Transaction_Works()
    {
        var controller = GetController<Transactions>();

        var transaction = new Transaction
        {
            Id = "t1",
            Username = "john",
            Status = "pending"
        };

        var result = await controller.Create(transaction);
        Assert.IsType<CreatedAtActionResult>(result);
    }
}
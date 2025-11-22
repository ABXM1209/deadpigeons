using api.Entity;
using efscaffold;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;


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
            Status = 0
        };

        var result = await controller.Create(transaction);
        Assert.IsType<CreatedAtActionResult>(result);
    }
}
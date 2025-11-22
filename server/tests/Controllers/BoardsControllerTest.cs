using api.Entity;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;

public class BoardsControllerTests : TestBase
{
    public BoardsControllerTests(PostgresFixture fixture) : base(fixture) {}

    [Fact]
    public async Task Create_Board_Works()
    {
        var controller = GetController<BoardsController>();

        var board = new Board
        {
            Id = "b1",
            Name = "Week 1",
            Weeknumber = 1,
            Totalwinners = 0
        };

        var result = await controller.Create(board);
        Assert.IsType<CreatedAtActionResult>(result);
    }
}
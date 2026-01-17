using api.Entity;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;
using efscaffold;
using efscaffold.Models;

namespace tests.Controllers;

[Collection("Postgres")]
public class UserBoardHistoryTests : TestBase
{
    public UserBoardHistoryTests(
        PostgresFixture fixture)
        : base(fixture) { }

    [Fact]
    public async Task GetByUserId_ShouldReturnOrderedHistory()
    {
        var userId = "u1";

        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();

        db.UserBoardHistory.AddRange(
            new UserBoardHistory { Id = Guid.NewGuid().ToString(), UserId = userId, BoardId = "b1", Date = DateTime.UtcNow },
            new UserBoardHistory { Id = Guid.NewGuid().ToString(), UserId = userId, BoardId = "b1", Date = DateTime.UtcNow.AddDays(-1) }
        );

        await db.SaveChangesAsync();

        var controller = GetController<UserBoardHistoryController>();
        var result = await controller.GetByUserId(userId);

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsAssignableFrom<List<UserBoardHistory>>(ok.Value);

        Assert.True(list[0].Date > list[1].Date);
    }

}
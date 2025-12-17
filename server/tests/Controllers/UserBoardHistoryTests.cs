using api.Entity;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using api;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;
using efscaffold;
using efscaffold.Models;

namespace tests.Controllers;

[Collection("Postgres")]
public class UserBoardHistoryTests : TestBase
{
    public UserBoardHistoryTests(
        IServiceProvider services,
        PostgresFixture fixture)
        : base(services, fixture) { }

    [Fact]
    public async Task GetByUserId_ShouldReturnOrderedHistory()
    {
        var userId = "u1";

        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();

        db.UserBoardHistory.AddRange(
            new UserBoardHistory { UserId = userId, Date = DateTime.UtcNow },
            new UserBoardHistory { UserId = userId, Date = DateTime.UtcNow.AddDays(-1) }
        );

        await db.SaveChangesAsync();

        var controller = GetController<UserBoardHistoryController>();
        var result = await controller.GetByUserId(userId);

        var ok = Assert.IsType<OkObjectResult>(result);
        var list = Assert.IsAssignableFrom<List<UserBoardHistory>>(ok.Value);

        Assert.True(list[0].Date > list[1].Date);
    }
}
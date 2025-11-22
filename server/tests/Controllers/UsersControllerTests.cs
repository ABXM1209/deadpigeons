using api.Entity;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;

public class UsersControllerTests : TestBase
{
    public UsersControllerTests(PostgresFixture fixture) : base(fixture) {}

    [Fact]
    public async Task Create_User_Works()
    {
        var controller = GetController<UsersController>();

        var user = new User
        {
            Id = "u1",
            Name = "John",
            Email = "john@test.com"
        };

        var result = await controller.Create(user);
        Assert.IsType<CreatedAtActionResult>(result);
    }
}
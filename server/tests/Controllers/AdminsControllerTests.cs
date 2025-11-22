using api.Entity;
using efscaffold.Models;
using Microsoft.AspNetCore.Mvc;

public class AdminsControllerTests : TestBase
{
    public AdminsControllerTests(PostgresFixture fixture) : base(fixture) {}

    [Fact]
    public async Task Create_Admin_Works()
    {
        var controller = GetController<AdminsController>();

        var newAdmin = new Admin
        {
            Id = "admin1",
            Name = "Test Admin",
            Email = "admin@test.com",
            Password = "pass"
        };

        var result = await controller.Create(newAdmin);
        Assert.IsType<CreatedAtActionResult>(result);

        var getResult = await controller.GetById("admin1") as OkObjectResult;
        Assert.NotNull(getResult);

        var admin = getResult.Value as Admin;
        Assert.Equal("Test Admin", admin!.Name);
    }
}
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using api.Controllers;
using efscaffold.Models;
using tests.Containers;
using efscaffold;

namespace tests.Controllers;

[Collection("Postgres")]
public class AuthControllerTests : TestBase
{
    public AuthControllerTests(
        IServiceProvider services,
        PostgresFixture fixture)
        : base(services, fixture) { }

    [Fact]
    public void Login_ShouldFail_WhenEmailEmpty()
    {
        var controller = GetController<AuthController>();

        var result = controller.Login(new AuthController.LoginRequest
        {
            Email = "",
            Password = "x"
        });

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public void Login_ShouldReturnToken_ForValidUser()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MyDbContext>();
        var passwordService = scope.ServiceProvider.GetRequiredService<IPasswordService>();

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = "test@test.com",
            Password = passwordService.HashPassword("password")
        };

        db.Users.Add(user);
        db.SaveChanges();

        var controller = GetController<AuthController>();

        var result = controller.Login(new AuthController.LoginRequest
        {
            Email = user.Email,
            Password = "password"
        });

        var ok = Assert.IsType<OkObjectResult>(result);
        var response = Assert.IsType<AuthController.LoginResponse>(ok.Value);
        Assert.NotNull(response.Token);
    }
}
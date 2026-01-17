using Xunit;
using api.Controllers;
using Microsoft.AspNetCore.Mvc;
using tests.Containers;

namespace tests.Controllers
{
    [Collection("Postgres collection")]
    public class AuthControllerTests : TestBase
    {
        public AuthControllerTests(IServiceProvider services,PostgresFixture fixture)
            : base(fixture)
        {
        }

        [Fact]
        public void Login_ShouldFail_WhenEmailEmpty()
        {
            var controller = GetController<AuthController>();
            var result = controller.Login(new AuthController.LoginRequest
            {
                Email = "",
                Password = "x"
            });

            var objectResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(400, objectResult.StatusCode);
        }
        [Fact]
        public void Login_ShouldReturnToken_ForValidUser()
        {
            var controller = GetController<AuthController>();
            using var db = Fixture.CreateDbContext();
            var passwordService = new PasswordService();

            var user = new efscaffold.Models.User
            {
                Id = Guid.NewGuid().ToString(),
                Email = "test@test.com",
                Password = passwordService.HashPassword("password")
            };

            db.Users.Add(user);
            db.SaveChanges();

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
}
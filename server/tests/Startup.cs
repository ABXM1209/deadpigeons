using Microsoft.Extensions.DependencyInjection;
using api.services;
using efscaffold;
using tests.Containers;
using api;
using api.Entity;
using api.Controllers;

namespace tests;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {

        services.AddScoped<MyDbContext>(sp =>
        {
            var fixture = sp.GetRequiredService<PostgresFixture>();
            return fixture.CreateDbContext();
        });

        services.AddScoped<IPasswordService, PasswordService>();

        services.AddScoped<IJwtService>(_ =>
            new JwtService(new AppOptions
            {
                JWTSecret = "TEST_SECRET_12345678901234567890123456789012"
            })
        );

        services.AddScoped<IUserService, UserService>();

        // Controllers
        services.AddScoped<AuthController>();
        services.AddScoped<UserBoardHistoryController>();
    }

}
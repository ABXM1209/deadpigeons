using api;
using api.Controllers;
using api.services;
using Microsoft.Extensions.DependencyInjection;

namespace tests.Containers;

using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Configurations;
using Microsoft.EntityFrameworkCore;
using efscaffold;
using Xunit;
public class PostgresFixture : IAsyncLifetime
{
    public IServiceProvider Services { get; private set; } = null!;

    public PostgreSqlTestcontainer Container { get; private set; } = null!;

    public string ConnectionString => Container.ConnectionString;

    public async Task InitializeAsync()
    {
        Container = new TestcontainersBuilder<PostgreSqlTestcontainer>()
            .WithDatabase(new PostgreSqlTestcontainerConfiguration
            {
                Database = "testdb",
                Username = "postgres",
                Password = "postgres"
            })
            .WithImage("postgres:15")
            .Build();

        await Container.StartAsync();

        // Configure DI
        var serviceCollection = new ServiceCollection();
        serviceCollection.AddScoped<MyDbContext>(sp =>
        {
            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseNpgsql(Container.ConnectionString)
                .Options;
            return new MyDbContext(options);
        });
        serviceCollection.AddScoped<IPasswordService, PasswordService>();
        serviceCollection.AddScoped<IJwtService>(_ =>
            new JwtService(new AppOptions { JWTSecret = "TEST_SECRET_12345678901234567890123456789012" }));
        serviceCollection.AddScoped<IUserService, UserService>();
        serviceCollection.AddScoped<AuthController>();

        Services = serviceCollection.BuildServiceProvider();

        using var ctx = Services.GetRequiredService<MyDbContext>();
        await ctx.Database.EnsureCreatedAsync();
    }

    public MyDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseNpgsql(ConnectionString)
            .Options;

        return new MyDbContext(options);
    }

    public async Task DisposeAsync()
    {
        if (Container.State == TestcontainersState.Running)
            await Container.DisposeAsync();
    }
}

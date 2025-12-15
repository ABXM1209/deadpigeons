namespace tests.Containers;

using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Configurations;
using Microsoft.EntityFrameworkCore;
using efscaffold;
using Xunit;

public class PostgresFixture : IAsyncLifetime
{
    public PostgreSqlTestcontainer Container { get; private set; } = null!;

    public string ConnectionString => Container.ConnectionString;

    public async Task InitializeAsync()
    {
        TestcontainersSettings.ResourceReaperEnabled = false;

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

        using var db = CreateDbContext();
        await db.Database.EnsureCreatedAsync();
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

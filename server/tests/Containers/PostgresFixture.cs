using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Microsoft.EntityFrameworkCore;
using efscaffold;

public class PostgresFixture : IAsyncLifetime
{
    public PostgreSqlTestcontainer Container { get; private set; } = null!;
    public MyDbContext DbContext { get; private set; } = null!;

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
            .WithCleanUp(true)
            .Build();

        await Container.StartAsync();

        var options = new DbContextOptionsBuilder<MyDbContext>()
            .UseNpgsql(Container.ConnectionString)
            .Options;

        DbContext = new MyDbContext(options);
        await DbContext.Database.EnsureCreatedAsync();
    }

    public async Task DisposeAsync()
    {
        await Container.StopAsync();
    }
}
using Xunit;
using DotNet.Testcontainers.Containers;
using tests.Containers;

namespace tests.Health;

[Collection("Postgres")]
public class ContainerHealthTests : IClassFixture<PostgresFixture>
{
    private readonly PostgresFixture _fixture;

    public ContainerHealthTests(PostgresFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public void PostgresContainer_IsRunning()
    {
        Assert.Equal(TestcontainersState.Running, _fixture.Container.State);
    }

    [Fact]
    public async Task Database_CanConnect()
    {
        using var db = _fixture.CreateDbContext();
        Assert.True(await db.Database.CanConnectAsync());
    }
}
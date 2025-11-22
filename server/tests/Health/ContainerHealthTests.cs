public class ContainerHealthTests : IClassFixture<PostgresFixture>
{
    private readonly PostgresFixture _fixture;

    public ContainerHealthTests(PostgresFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task PostgresContainer_IsRunning()
    {
        Assert.True(_fixture.Container.State == TestcontainersStates.Running);
    }

    [Fact]
    public async Task Database_CanConnect()
    {
        var canConnect = await _fixture.DbContext.Database.CanConnectAsync();
        Assert.True(canConnect);
    }
}
using Xunit;

namespace tests.Integration;

public class DatabaseTests
{
    [Fact]
    public void Placeholder_Database_ShouldStart()
    {
        // Later: Start PostgreSQL or SQLServer container
        Assert.True(true);
    }
}
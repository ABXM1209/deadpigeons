using Xunit;
using api;
using api.services;

namespace tests.Services;

public class JwtServiceTests
{
    [Fact]
    public void GenerateToken_ShouldReturnValidJwt()
    {
        var jwt = new JwtService(new AppOptions
        {
            JWTSecret = "TEST_SECRET_12345678901234567890123456789012"
        });

        var token = jwt.GenerateToken("user", "admin");

        Assert.NotNull(token);
        Assert.Contains(".", token); // JWT format
    }
}

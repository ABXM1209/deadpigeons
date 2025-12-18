using Xunit;

namespace tests.Services;

public class PasswordTests
{
    private readonly PasswordService _passwordService = new();

    [Fact]
    public void HashPassword_ShouldProduceDifferentHash()
    {
        var hash1 = _passwordService.HashPassword("test");
        var hash2 = _passwordService.HashPassword("test");

        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void VerifyPassword_ShouldReturnTrue_WhenCorrect()
    {
        var password = "hello";
        var hash = _passwordService.HashPassword(password);

        Assert.True(_passwordService.VerifyPassword(password, hash));
    }

    [Fact]
    public void VerifyPassword_ShouldReturnFalse_WhenIncorrect()
    {
        var hash = _passwordService.HashPassword("hello");

        Assert.False(_passwordService.VerifyPassword("wrong", hash));
    }
}
using api.services;
using Xunit;

namespace tests;

public class PasswordTests
{
    private readonly IPasswordService _passwordService;
    
    public PasswordTests(IPasswordService passwordService)
    {
        _passwordService =  passwordService;
    }
    
    [Fact]
    public void HashPassword_ShouldPrefixHash()
    {
        // Arrange
        var password = "test123";

        // Act
        var hash = _passwordService.HashPassword(password);

        // Assert
        Assert.StartsWith("HASHED:", hash);
        Assert.Equal("HASHED:test123", hash);
    }
    
    [Fact]
    public void VerifyPassword_ShouldReturnTrue_WhenCorrect()
    {
        // Arrange
        var password = "hello";
        var hash = _passwordService.HashPassword(password);

        // Act
        var result = _passwordService.VerifyPassword(password, hash);

        // Assert
        Assert.True(result);
    }
    
    [Fact]
    public void VerifyPassword_ShouldReturnFalse_WhenIncorrect()
    {
        // Arrange
        var password = "hello";
        var hash = _passwordService.HashPassword(password);

        // Act
        var result = _passwordService.VerifyPassword("wrong", hash);

        // Assert
        Assert.False(result);
    }
}
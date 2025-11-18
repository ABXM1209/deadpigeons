using api.Services;

namespace tests;

public class PasswordTests
{
    private readonly IPasswordService _service;

    public PasswordTests(IPasswordService service)
    {
        _service = service;
    }

    [Fact]
    public void HasPassword_ShouldReturn_NonEmptyHash()
    {
        var hash = _service.HashPassword("service123");
        
        Assert.False(string.IsNullOrWhiteSpace(hash));
        Assert.StartsWith("HASHED:", hash); //placeholder expectation
    }
    
    [Fact]
    public void VerifyPassword_ShouldPass_WithValidPassword()
    {
        var hash = _service.HashPassword("secret123");

        Assert.True(_service.VerifyPassword("secret123", hash));
    }
    
    [Fact]
    public void VerifyPassword_ShouldFail_WithWrongPassword()
    {
        var hash = _service.HashPassword("secret123");

        Assert.False(_service.VerifyPassword("wrong_pw", hash));
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void HashPassword_ShouldThrow_OnInvalidInput(string? badPassword)
    {
        Assert.Throws<ArgumentNullException>(() => _service.HashPassword(badPassword));
    }
    
    [Fact]
    public void VerifyPassword_ShouldFail_WithMalformedHash()
    {
        Assert.False(_service.VerifyPassword("anything", "not-real-hash"));
    }
}
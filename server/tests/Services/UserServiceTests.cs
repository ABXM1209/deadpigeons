using api.services;
using api.services.Dtos;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;
using Xunit;

namespace tests.Services;

[Collection("Postgres")]
public class UserServiceTests : TestBase
{
    private readonly IUserService _userService;

    public UserServiceTests(
        IServiceProvider services,
        PostgresFixture fixture)
        : base(services, fixture)
    {
        _userService = services.GetRequiredService<IUserService>();
    }
    
    [Fact]
    public async Task CreateAsync_ShouldCreateUser_WhenDataIsValid()
    {
        // Arrange
        var dto = new CreateUserDto
        {
            Name = "Ahmed",
            Phone = "12345678",
            Email = "ahmed@test.com",
            Password = "secret",
            Balance = 100,
            Isactive = true
        };

        // Act
        var user = await _userService.CreateAsync(dto);

        // Assert
        Assert.NotNull(user);
        Assert.Equal(dto.Email, user.Email);
        Assert.NotEqual(dto.Password, user.Password); // hashed
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnUser_WhenUserExists()
    {
        // Arrange
        var user = await _userService.CreateAsync(new CreateUserDto
        {
            Name = "Test",
            Phone = "000",
            Email = "get@test.com",
            Password = "pass",
            Balance = 0,
            Isactive = true
        });

        // Act
        var found = await _userService.GetByIdAsync(user.Id);

        // Assert
        Assert.Equal(user.Id, found.Id);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _userService.GetByIdAsync("non-existing-id"));
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateUser_WhenUserExists()
    {
        // Arrange
        var user = await _userService.CreateAsync(new CreateUserDto
        {
            Name = "Old",
            Phone = "1",
            Email = "update@test.com",
            Password = "pass",
            Balance = 10,
            Isactive = true
        });

        var updateDto = new UpdateUserDto
        {
            Name = "New",
            Phone = "2",
            Email = "new@test.com",
            Balance = 50,
            Isactive = false
        };

        // Act
        var updated = await _userService.UpdateAsync(user.Id, updateDto);

        // Assert
        Assert.Equal("New", updated.Name);
        Assert.Equal(50, updated.Balance);
        Assert.False(updated.Isactive);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveUser_WhenUserExists()
    {
        // Arrange
        var user = await _userService.CreateAsync(new CreateUserDto
        {
            Name = "Delete",
            Phone = "9",
            Email = "delete@test.com",
            Password = "pass",
            Balance = 0,
            Isactive = true
        });

        // Act
        await _userService.DeleteAsync(user.Id);

        // Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _userService.GetByIdAsync(user.Id));
    }
}

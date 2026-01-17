using api.services;
using api.services.Dtos;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;
using Xunit;

namespace tests.Services;

[Collection("Postgres")]
public class UserServiceTests : TestBase
{
    private readonly PostgresFixture _fixture;

    public UserServiceTests(PostgresFixture fixture)
        : base(fixture)
    {
        _fixture = fixture;
    }

    private IUserService GetUserService()
    {
        // Make sure you get a single instance of all services inside a scope
        var scope = _fixture.Services.CreateScope();
        return scope.ServiceProvider.GetRequiredService<IUserService>();
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateUser_WhenDataIsValid()
    {
        var service = GetUserService();

        var dto = new CreateUserDto
        {
            Name = "Ahmed",
            Phone = "12345678",
            Email = "ahmed@test.com",
            Password = "secret",
            Balance = 100,
            Isactive = true
        };

        var user = await service.CreateAsync(dto);

        Assert.NotNull(user);
        Assert.Equal(dto.Email, user.Email);
        Assert.NotEqual(dto.Password, user.Password); // hashed
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnUser_WhenUserExists()
    {
        var service = GetUserService();

        var user = await service.CreateAsync(new CreateUserDto
        {
            Name = "Test",
            Phone = "000",
            Email = "get@test.com",
            Password = "pass",
            Balance = 0,
            Isactive = true
        });

        var found = await service.GetByIdAsync(user.Id);
        Assert.Equal(user.Id, found.Id);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldThrow_WhenUserDoesNotExist()
    {
        var service = GetUserService();
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.GetByIdAsync("non-existing-id"));
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateUser_WhenUserExists()
    {
        var service = GetUserService();

        var user = await service.CreateAsync(new CreateUserDto
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
            Isactive = false,
            Password = "newpass"
        };

        var updated = await service.UpdateAsync(user.Id, updateDto);

        Assert.Equal("New", updated.Name);
        Assert.Equal(50, updated.Balance);
        Assert.False(updated.Isactive);
    }

    [Fact]
    public async Task DeleteAsync_ShouldRemoveUser_WhenUserExists()
    {
        var service = GetUserService();

        var user = await service.CreateAsync(new CreateUserDto
        {
            Name = "Delete",
            Phone = "9",
            Email = "delete@test.com",
            Password = "pass",
            Balance = 0,
            Isactive = true
        });

        await service.DeleteAsync(user.Id);

        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            service.GetByIdAsync(user.Id));
    }
}

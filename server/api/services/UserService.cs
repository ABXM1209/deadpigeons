using api.services.Dtos;
using efscaffold;
using efscaffold.Models;
using Microsoft.EntityFrameworkCore;

namespace api.services;

public class UserService : IUserService
{
    private readonly MyDbContext _context;
    private readonly IPasswordService _passwordService;

    public UserService(MyDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }

    public async Task<User> GetByIdAsync(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");
        return user;
    }

    public async Task<User> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name,
            Phone = dto.Phone,
            Email = dto.Email,
            Password = _passwordService.HashPassword(dto.Password),
            Balance = dto.Balance,
            Isactive = dto.Isactive
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(string id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        user.Name = dto.Name;
        user.Phone = dto.Phone;
        user.Email = dto.Email;
        user.Balance = dto.Balance;
        user.Isactive = dto.Isactive;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.Password = _passwordService.HashPassword(dto.Password);

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task DeleteAsync(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            throw new KeyNotFoundException("User not found");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
    }
}

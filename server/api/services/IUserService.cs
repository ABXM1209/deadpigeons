using api.services.Dtos;
using efscaffold.Models;

namespace api.services;

public interface IUserService
{
    Task<List<User>> GetAllAsync();
    Task<User> GetByIdAsync(string id);
    Task<User> CreateAsync(CreateUserDto dto);
    Task<User> UpdateAsync(string id, UpdateUserDto dto);
    Task DeleteAsync(string id);
}
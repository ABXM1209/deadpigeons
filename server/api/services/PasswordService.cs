namespace api.services;

public class PasswordService : IPasswordService
{
    // placeholder service
    
    public string HashPassword(string password)
    {
        return $"HASHED:{password}";
    }

    public bool VerifyPassword(string password, string hash)
    {
        return hash == $"HASHED:{password}";
    }
}
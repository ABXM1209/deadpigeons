public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashed);
}

public class PasswordService : IPasswordService
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hashed)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hashed);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            return false; // hash is invalid
        }
    }
}
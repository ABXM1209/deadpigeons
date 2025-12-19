using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace efscaffold;

public class MyDbContextFactory : IDesignTimeDbContextFactory<MyDbContext>
{
    public MyDbContext CreateDbContext(string[] args)
    {
        // =================== Build configuration ===================
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory()) // important: absolute path
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables();

        var config = builder.Build();

        // =================== Read connection string ===================
        var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
                               ?? config["AppOptions:DbConnectionString"];

        if (string.IsNullOrEmpty(connectionString))
            throw new InvalidOperationException(
                "Connection string 'AppOptions:DbConnectionString' not found"
            );

        // =================== Setup DbContext options ===================
        var optionsBuilder = new DbContextOptionsBuilder<MyDbContext>();
        optionsBuilder.UseNpgsql(
            connectionString,
            o => o.EnableRetryOnFailure()
        );

        return new MyDbContext(optionsBuilder.Options);
    }
}
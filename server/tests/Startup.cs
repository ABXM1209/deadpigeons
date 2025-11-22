using api.services;
using efscaffold;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit.DependencyInjection;
using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using DotNet.Testcontainers.Configurations;


namespace tests;

public class Startup
{
    
    public static void ConfigureServices(IServiceCollection services)
    {
        Program.ConfigureServices(services);
        services.RemoveAll(typeof(MyDbContext));
        
        services.AddScoped<MyDbContext>(factory =>
        {
            var postgreSqlContainer = new TestcontainersBuilder<PostgreSqlTestcontainer>()
                .WithDatabase(new PostgreSqlTestcontainerConfiguration
                {
                    Database = "testdb",
                    Username = "postgres",
                    Password = "postgres"
                })
                .WithImage("postgres:15")
                .WithCleanUp(true)
                .Build();

            postgreSqlContainer.StartAsync().GetAwaiter().GetResult();

            var options = new DbContextOptionsBuilder<MyDbContext>()
                .UseNpgsql(postgreSqlContainer.ConnectionString)
                .Options;

            var ctx = new MyDbContext(options);
            ctx.Database.EnsureCreated();
            return ctx;
        });

    }
}
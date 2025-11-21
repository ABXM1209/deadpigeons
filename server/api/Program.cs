using System.Text.Json;
using Microsoft.OpenApi.Models;
using api;
using api.services;
using efscaffold.Entities;
using Infrastructure.Postgres.Scaffolding;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        var app = Program.BuildApp(args);
        app.Run();
    }
    public static void ConfigureServices(IServiceCollection services)
    {
        var provider = services.BuildServiceProvider();
        var configuration = provider.GetRequiredService<IConfiguration>();
        
        // Registration of appOptions
        var appOptions = services.AddAppOptions(configuration);
        Console.WriteLine(JsonSerializer.Serialize(appOptions));

        static void ConfigureServicesInternal(IServiceCollection servicesInternal)
        {
            // Dependency Injections Here
        }

        ConfigureServicesInternal(services);

        services.AddDbContext<MyDbContext>(conf => { conf.UseNpgsql(appOptions.DbConnectionString);});
        services.AddEndpointsApiExplorer();
        services.AddScoped<IPasswordService, PasswordService>();
        
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "My API",
                Version = "v1",
                Description = "Sample API with Swagger for local testing"
            });
        });

        services.AddCors();
        services.AddControllers();
        services.AddProblemDetails();
    }

    public static WebApplication BuildApp(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        
        builder.Services.AddSingleton<IConfiguration>(builder.Configuration);
        ConfigureServices(builder.Services);

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
            options.RoutePrefix = string.Empty;
        });

        app.UseRouting();

        app.UseCors(config => config
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowAnyOrigin()
            .SetIsOriginAllowed(_ => true));

        app.MapControllers();

        return app;
    }

}




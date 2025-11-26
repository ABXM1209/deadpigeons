using System.Text;
using System.Text.Json;
using Microsoft.OpenApi.Models;
using api;
using api.services;
using efscaffold;
using efscaffold.Models; 
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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

        // Load options from configuration
        var appOptions = services.AddAppOptions(configuration);

        if (string.IsNullOrEmpty(appOptions.JWTSecret))
        {
            throw new InvalidOperationException(
                "JWTSecret is not set. Please configure it in appsettings.json or environment variables."
            );
        }
        //  Register AppOptions as singleton
        services.AddSingleton(appOptions);

        services.AddDbContext<MyDbContext>(conf => { conf.UseNpgsql(appOptions.DbConnectionString);});
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IJwtService, JwtService>();


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
        
        // Add JWT authentication
        var key = Encoding.ASCII.GetBytes(appOptions.JWTSecret);
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = "JwtBearer";
            options.DefaultChallengeScheme = "JwtBearer";
        }).AddJwtBearer("JwtBearer", options =>
        {
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddScoped<IJwtService, JwtService>();
        
        
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
        
        
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        return app;
    }

}




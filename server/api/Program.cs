using System.Text;
using api;
using api.services;
using efscaffold;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// =================== Configuration ===================
// Load configuration from appsettings.json and environment variables
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

var configuration = builder.Configuration;

// =================== AppOptions ===================
// Read app options from environment variables first, fallback to appsettings.json
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") 
                ?? configuration["AppOptions:JWTSecret"];
var dbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
                         ?? configuration["AppOptions:DbConnectionString"];

if (string.IsNullOrWhiteSpace(jwtSecret))
    throw new InvalidOperationException(
        "JWTSecret is not set. Configure it in environment variables or appsettings.json."
    );

if (string.IsNullOrWhiteSpace(dbConnectionString))
    throw new InvalidOperationException(
        "DbConnectionString is not set. Configure it in environment variables or appsettings.json."
    );

// Register AppOptions as singleton
builder.Services.AddSingleton(new AppOptions
{
    JWTSecret = jwtSecret,
    DbConnectionString = dbConnectionString
});

// =================== Database ===================
// Configure DbContext using the connection string
builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseNpgsql(dbConnectionString, npgsqlOptions =>
    {
        npgsqlOptions.EnableRetryOnFailure(5);
    });
});

// =================== Services ===================
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// =================== Controllers & ProblemDetails ===================
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// =================== Swagger ===================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "DeadPigeon API",
        Version = "v1",
        Description = "API for DeadPigeon project"
    });

    // JWT support in Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// =================== CORS ===================
builder.Services.AddCors();

// =================== JWT Authentication ===================
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// =================== Middleware ===================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DeadPigeon API v1");
    c.RoutePrefix = string.Empty;
});

app.UseCors(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
);

app.UseAuthentication();
app.UseAuthorization();

// =================== Map Controllers ===================
app.MapControllers();

app.Run();

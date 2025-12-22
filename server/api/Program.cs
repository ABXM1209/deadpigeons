using System.Text;
using api;
using api.services;
using efscaffold;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
DotNetEnv.Env.Load();
var builder = WebApplication.CreateBuilder(args);

// =================== Configuration ===================
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true)
    .AddEnvironmentVariables();

// =================== Read ENV ===================
var jwtSecret = builder.Configuration["JWTSecret"];
var dbConnectionString = builder.Configuration["DbConnectionString"];

if (string.IsNullOrWhiteSpace(jwtSecret))
    throw new Exception("JWTSecret is missing");

if (string.IsNullOrWhiteSpace(dbConnectionString))
    throw new Exception("DbConnectionString is missing");

// =================== AppOptions ===================
builder.Services.AddSingleton(new AppOptions
{
    JWTSecret = jwtSecret,
    DbConnectionString = dbConnectionString
});

// =================== Database ===================
builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseNpgsql(dbConnectionString);
});

// =================== Services ===================
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// =================== Controllers ===================
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// =================== CORS ===================
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://deadpigeon-web.fly.dev"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// =================== JWT ===================
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),

            ValidateIssuer = false,
            ValidateAudience = false,

            ClockSkew = TimeSpan.Zero
        };
    });

// =================== Swagger ===================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "DeadPigeon API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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

var app = builder.Build();

// =================== Middleware ===================
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using api.services;

public abstract class TestBase : IClassFixture<PostgresFixture>
{
    protected readonly PostgresFixture _fixture;
    protected readonly IServiceProvider _services;

    protected TestBase(PostgresFixture fixture)
    {
        _fixture = fixture;

        var services = new ServiceCollection();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddSingleton(_fixture.DbContext);

        _services = services.BuildServiceProvider();
    }

    protected T GetController<T>() where T : ControllerBase
    {
        return ActivatorUtilities.CreateInstance<T>(_services);
    }
}
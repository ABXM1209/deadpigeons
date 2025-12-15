using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;

namespace tests;

public abstract class TestBase
{
    protected readonly IServiceProvider Services;
    protected readonly PostgresFixture Fixture;

    protected TestBase(
        IServiceProvider services,
        PostgresFixture fixture)
    {
        Services = services;
        Fixture = fixture;
    }

    protected T GetController<T>() where T : ControllerBase
    {
        var scope = Services.CreateScope();
        return ActivatorUtilities.CreateInstance<T>(scope.ServiceProvider);
    }
}
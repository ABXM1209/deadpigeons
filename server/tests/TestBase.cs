using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using tests.Containers;

namespace tests
{public abstract class TestBase
    {
        protected readonly PostgresFixture Fixture;

        protected TestBase(PostgresFixture fixture)
        {
            Fixture = fixture;
        }

        protected IServiceProvider Services => Fixture.Services;

        protected T GetController<T>() where T : ControllerBase
        {
            var scope = Services.CreateScope();
            var controller = ActivatorUtilities.CreateInstance<T>(scope.ServiceProvider);

            controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    RequestServices = scope.ServiceProvider
                }
            };

            return controller;
        }
    }
}
using api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Xunit.DependencyInjection;

namespace tests;


public class TestStartup
{
    
    public void ConfigureServices(IServiceCollection services)
    {
        // Register your password service
        services.AddSingleton<IPasswordService, PasswordService>();
        
    }

    public void Configure(IServiceProvider provider, ITestOutputHelperAccessor accessor)
    {
        
    }

}
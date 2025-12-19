using System.ComponentModel.DataAnnotations;

namespace api
{
    public static class AppOptionsExtensions
    {
        public static AppOptions AddAppOptions(this IServiceCollection services, IConfiguration configuration)
        {
            var appOptions = new AppOptions();
            // Bind values from "AppOptions" section
            configuration.GetSection("AppOptions").Bind(appOptions);

            // Register AppOptions in DI
            services.Configure<AppOptions>(configuration.GetSection("AppOptions"));
            services.AddSingleton(appOptions);

            // Validate required properties
            var results = new List<ValidationResult>();
            bool valid = Validator.TryValidateObject(appOptions, new ValidationContext(appOptions), results, true);
            if (!valid)
            {
                throw new Exception(
                    "AppOptions validation failed. Missing required configuration values: " +
                    string.Join(", ", results.Select(r => r.ErrorMessage))
                );
            }

            return appOptions;
        }
    }
}
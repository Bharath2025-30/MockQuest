using MockQuestAPI.ServiceContracts;
using MockQuestAPI.Services;

namespace MockQuestAPI.Configurations
{
    public static class ApplicationServicesConfiguration
    {
        /// <summary>
        /// Registers application and infrastructure services for dependency injection.
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IClerkWebhookService, ClerkWebhookService>();
            services.AddScoped<IStreamService, StreamService>();
            services.AddScoped<ISessionService, SessionService>();
            return services;
        }
    }
}

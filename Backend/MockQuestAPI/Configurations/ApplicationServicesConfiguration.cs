using System.Runtime.CompilerServices;

namespace MockQuestAPI.Configurations
{
    public static class ApplicationServicesConfiguration
    {
        /// <summary>
        /// Registers application and infrastructure services for dependency injection.
        /// </summary>
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            return services;
        }
    }
}

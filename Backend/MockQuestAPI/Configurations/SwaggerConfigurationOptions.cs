using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace MockQuestAPI.Configurations
{
    public class SwaggerConfigurationOptions:IConfigureOptions<SwaggerGenOptions>
    {
        public SwaggerConfigurationOptions()
        {
            
        }

        public void Configure(SwaggerGenOptions options)
        {

        }
    }
}

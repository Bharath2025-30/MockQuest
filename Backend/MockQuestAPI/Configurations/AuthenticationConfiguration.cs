using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace MockQuestAPI.Configurations
{
    public static class AuthenticationConfiguration
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {

            var clerkDomain = configuration["JwtConfiguration:Issuer"];

            if (string.IsNullOrEmpty(clerkDomain))
            {
                throw new InvalidOperationException(
                    "Clerk:Domain must be configured in appsettings.json"
                );
            }

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    // Clerk's JWKS endpoint
                    options.Authority = $"https://{clerkDomain}";
                    options.RequireHttpsMetadata = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        // Validate issuer
                        ValidateIssuer = true,
                        ValidIssuer = $"https://{clerkDomain}",

                        // Clerk doesn't use audience
                        ValidateAudience = false,

                        // Validate lifetime
                        ValidateLifetime = true,

                        // Validate signature
                        ValidateIssuerSigningKey = true,

                        // Clock skew
                        ClockSkew = TimeSpan.FromMinutes(5),

                        // Claim mapping
                        NameClaimType = "name",
                        RoleClaimType = "role"
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine($"Auth failed: {context.Exception.Message}");
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            var userId = context.Principal?.FindFirst("sub")?.Value;
                            Console.WriteLine($"Token validated for user: {userId}");
                            return Task.CompletedTask;
                        },
                        OnChallenge = context =>
                        {
                            Console.WriteLine($"Challenge: {context.Error}, {context.ErrorDescription}");
                            return Task.CompletedTask;
                        }
                    };
                });

            return services;
        }
    }
}
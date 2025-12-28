using Microsoft.AspNetCore.HostFiltering;
using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Configurations;
using MockQuestAPI.Data;
using MockQuestAPI.Entities;
using Newtonsoft.Json.Serialization;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        // Use CamelCase instead of DefaultContractResolver (which uses PascalCase)
        options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// MongoDB Service Configuration
var mongoDbSettings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>()!;
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDbSettings"));
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseMongoDB(mongoDbSettings.AtlasURI!,mongoDbSettings.DatabaseName!);
});

// ApplicationServices
builder.Services.AddApplicationServices();

// ApplicationDbContext Configuration

// Authentication Configuration
builder.Services.AddJwtAuthentication(builder.Configuration);

// Authorization Configuration
builder.Services.AddAuthorization();

// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("MockQuestCorsPolicy", poilicyBuilder =>
    {
        // Added ngrok public URL - TODO : Need to remove this after development
        poilicyBuilder.WithOrigins("http://localhost:5173/", " https://inconvincible-ally-wilton.ngrok-free.dev/");
        poilicyBuilder.AllowAnyHeader();
        poilicyBuilder.AllowAnyMethod();
        poilicyBuilder.AllowCredentials();
    });
});



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureOptions<SwaggerConfigurationOptions>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // TODO: Need to remove this after development
    // Add this middleware to handle ngrok hostname
    app.Use(async (context, next) =>
    {
        // Accept any host in development
        if (context.Request.Headers.ContainsKey("X-Forwarded-Host"))
        {
            context.Request.Host = new HostString(context.Request.Headers["X-Forwarded-Host"]);
        }
        await next();
    });
}

app.UseRouting();

// CORS Middleware
app.UseCors("MockQuestCorsPolicy");

//Middlewares for authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.UseHttpsRedirection();


app.Run();

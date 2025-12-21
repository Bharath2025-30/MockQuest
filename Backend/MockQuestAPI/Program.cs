using MockQuestAPI.Configurations;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
        poilicyBuilder.WithOrigins("http://localhost:5173");
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

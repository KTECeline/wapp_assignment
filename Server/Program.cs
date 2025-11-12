using Server.Data;
var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddControllers(); 

// Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policyBuilder =>
        policyBuilder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Enable CORS before mapping controllers/endpoints
app.UseCors("AllowFrontend");

// Configure middleware in the correct order
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowFrontend"); // Make sure CORS is after UseRouting
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();

        // Run seeding in the background so app startup is not blocked by long-running DB operations.
        // Any exceptions during seeding are logged.
        _ = System.Threading.Tasks.Task.Run(() =>
        {
            try
            {
                logger.LogInformation("Starting database seeder in background");
                DatabaseSeeder.Initialize(context);
                logger.LogInformation("Database seeding finished");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Database seeder failed");
            }
        });
    }
    catch (Exception ex)
    {
        var loggerScoped = services.GetRequiredService<ILogger<Program>>();
        loggerScoped.LogError(ex, "Failed to resolve services for background seeding");
    }
}

app.Run();





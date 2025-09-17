var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.Services.AddDbContext<ApplicationDbContext>();
builder.Services.AddControllers(); 

// 👉 Add CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder =>
        policyBuilder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();
app.Run();

// 👉 Enable CORS before mapping controllers/endpoints
app.UseCors("AllowAll");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (!db.Users.Any())
    {
        db.Users.AddRange(
            new User { Username = "Alice" },
            new User { Username = "Bob" },
            new User { Username = "Charlie" }
        );
        db.SaveChanges();
    }
}





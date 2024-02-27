using AuctionApi.Models;
using AuctionApi.Services;

// https://learn.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-8.0&preserve-view=true 
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// 
builder.Services.Configure<AuctionDatabaseSettings>(
    builder.Configuration.GetSection("AuctionDatabase"));
builder.Services.AddSingleton<RoomsService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:9000").AllowAnyMethod().AllowAnyHeader();
                      });
});

builder.Services.AddControllers();

// https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-6.0
// Limit Cors to endpoints. See endpoint routing
// https://stackoverflow.com/questions/57530680/enable-cors-for-any-port-on-localhost

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

//app.UseAuthorization(); // TODO: look into adding this

app.MapControllers();

app.Run();
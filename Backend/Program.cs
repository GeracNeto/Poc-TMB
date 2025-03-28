using Azure.Messaging.ServiceBus;
using Backend.Context;
using Backend.Hubs;
using Backend.Services;
using Backend.Workers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


Console.WriteLine($"Connected DataBase: {builder.Configuration.GetConnectionString("DefaultConnection")}");

// Adicionando serviços ao container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var frontendUrl = builder.Configuration["FrontendUrl"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddHostedService<OrderProcessingWorker>();

// Configuração do Azure Service Bus
builder.Services.AddSingleton(serviceProvider =>
{
    var connectionString = builder.Configuration["AzureServiceBus:ConnectionString"];
    var queueName = builder.Configuration["AzureServiceBus:QueueName"];
    var client = new ServiceBusClient(connectionString);
    return client.CreateSender(queueName);
});

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddSignalR();

var app = builder.Build();

try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    db.Database.Migrate();
    Console.WriteLine("Migrations aplicadas com sucesso!");
}
catch (Exception ex)
{
    Console.WriteLine($"Falha ao aplicar migrations: {ex.Message}");
}

if (app.Environment.IsDevelopment())
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Access-Control-Allow-Origin", frontendUrl);
        context.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        await next();
    });
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapHub<OrderHub>("order-hub");
app.MapControllers();

app.Run();

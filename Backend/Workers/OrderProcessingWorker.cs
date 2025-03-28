using Azure.Messaging.ServiceBus;
using Backend.Context;
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace Backend.Workers
{
    public class OrderProcessingWorker(IServiceScopeFactory scopeFactory, ILogger<OrderProcessingWorker> logger, IConfiguration configuration) : BackgroundService
    {
        private readonly string _connectionString = configuration["AzureServiceBus:ConnectionString"];
        private readonly string _queueName = configuration["AzureServiceBus:QueueName"];
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
        private readonly ILogger<OrderProcessingWorker> _logger = logger;
        private ServiceBusProcessor? _processor;

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Iniciando o OrderProcessingWorker...");

            var client = new ServiceBusClient(_connectionString);
            _processor = client.CreateProcessor(_queueName, new ServiceBusProcessorOptions());

            _processor.ProcessMessageAsync += ProcessMessageAsync;
            _processor.ProcessErrorAsync += ErrorHandlerAsync;

            await _processor.StartProcessingAsync(cancellationToken);
        }

        private async Task ProcessMessageAsync(ProcessMessageEventArgs args) 
        {
            var messageBody = args.Message.Body.ToString();
            _logger.LogInformation($"Mensagem recebida: {messageBody}");

            try
            {
                var orderMessage = JsonSerializer.Deserialize<OrderMessage>(messageBody);
                if (orderMessage == null || orderMessage.OrderId == Guid.Empty)
                {
                    _logger.LogWarning("Mensagem inválida recebida.");
                    return;
                }

                using var scope = _scopeFactory.CreateScope();
                DataContext dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
                IOrderService orderService = scope.ServiceProvider.GetRequiredService<IOrderService>();

                Order order = await dbContext.Orders.FirstOrDefaultAsync(o => o.ID == orderMessage.OrderId);
                if (order == null)
                {
                    _logger.LogWarning($"Pedido {orderMessage.OrderId} não encontrado.");
                    return;
                }

                // Espera 5 segundos para mudar para "Processando"
                await Task.Delay(TimeSpan.FromSeconds(5));

                // Atualizar status para "Processando"
                order.Status = "Processando";
                await dbContext.SaveChangesAsync();
                _logger.LogInformation($"Pedido {order.ID} atualizado para 'Processando'.");

                orderService.NotifyOrderUpdate(order.ID, order.Status);

                // Espera 5 segundos antes de finalizar o pedido
                await Task.Delay(TimeSpan.FromSeconds(5));

                // Atualizar status para "Finalizado"
                order.Status = "Finalizado";
                await dbContext.SaveChangesAsync();
                _logger.LogInformation($"Pedido {order.ID} atualizado para 'Finalizado'.");

                orderService.NotifyOrderUpdate(order.ID, order.Status);

                await args.CompleteMessageAsync(args.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao processar mensagem: {ex.Message}");
            }
        }

        private Task ErrorHandlerAsync(ProcessErrorEventArgs args)
        {
            _logger.LogError($"Erro no processamento da fila: {args.Exception.Message}");
            return Task.CompletedTask;
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Parando o OrderProcessingWorker...");

            if (_processor != null)
            {
                await _processor.StopProcessingAsync(cancellationToken);
                await _processor.DisposeAsync();
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            throw new NotImplementedException();
        }
    }

    public record OrderMessage(Guid OrderId);
}

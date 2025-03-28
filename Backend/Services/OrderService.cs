using Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Services
{
    public class OrderService(IHubContext<OrderHub> orderHub) : IOrderService
    {
        private readonly IHubContext<OrderHub> _orderHub = orderHub;

        public async Task NotifyOrderUpdate(Guid orderId, string status)
        {
            await _orderHub.Clients.All.SendAsync("OrderUpdate", new {ID = orderId, Status = status });
        }
    }
}

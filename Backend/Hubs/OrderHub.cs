
using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public sealed class OrderHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("OrdeHubConnect", $"Order Hub has joined");
        }
    }
}

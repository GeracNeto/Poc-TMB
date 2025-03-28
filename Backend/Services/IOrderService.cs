namespace Backend.Services
{
    public interface IOrderService
    {
        Task NotifyOrderUpdate(Guid orderId, string status);
    }
}

using Azure.Messaging.ServiceBus;
using Backend.Context;
using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController(DataContext context, ServiceBusSender serviceBusSender) : ControllerBase
    {

        private readonly DataContext _context = context;
        private readonly ServiceBusSender _serviceBusSender = serviceBusSender;

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            return Ok(await _context.Orders.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(Guid id)
        {
            return Ok(await _context.Orders.FirstOrDefaultAsync(o => o.ID == id));
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order orderObj)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Dados inválidos.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
                }

                orderObj.ID = Guid.NewGuid();
                orderObj.Status = "Pendente";
                orderObj.DataCriacao = DateTime.UtcNow;

                await _context.Orders.AddAsync(orderObj);
                await _context.SaveChangesAsync();

                var messageBody = JsonSerializer.Serialize(new { OrderId = orderObj.ID });
                var message = new ServiceBusMessage(Encoding.UTF8.GetBytes(messageBody));

                await _serviceBusSender.SendMessageAsync(message);

                return StatusCode(201, orderObj);
            }
            catch (DbUpdateException dbEx)
            {
                return StatusCode(500, new { message = "Erro ao salvar no banco de dados.", error = dbEx.InnerException?.Message ?? dbEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro inesperado ao criar o pedido.", error = ex.Message });
            }
        }

    }
}

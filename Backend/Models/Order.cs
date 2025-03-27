using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Order(string cliente, string produto, decimal valor)
    {
        public Guid ID { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "O campo Cliente é obrigatório.")]
        public string Cliente { get; set; } = cliente;

        [Required(ErrorMessage = "O campo Produto é obrigatório.")]
        public string Produto { get; set; } = produto;

        [Range(0.01, double.MaxValue, ErrorMessage = "O campo Valor é obrigatório e deve ser maior que zero.")]
        public decimal Valor { get; set; } = valor;

        public string Status { get; set; } = "Pendente";

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}

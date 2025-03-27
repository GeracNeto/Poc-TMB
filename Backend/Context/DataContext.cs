using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Context
{
    public class DataContext(DbContextOptions<DataContext> options) : DbContext(options)
    {
        public DbSet<Order> Orders { get; set; }

    }
}

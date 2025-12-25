using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Entities;

namespace MockQuestAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        //DbSets
        public DbSet<Department> Departments { get; set; }

        //Constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Department>();
        }
    }
}

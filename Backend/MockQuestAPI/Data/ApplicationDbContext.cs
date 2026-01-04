using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Entities;

namespace MockQuestAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        //DbSets
        public IConfiguration _config;
        public DbSet<Department> Departments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SessionRoom> SessionRooms { get; set; }

        //Constructor
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IConfiguration config) : base(options)
        {
            _config = config;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Department>();
            #region User
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.ClerkId).IsUnique();
            #endregion
            #region SessionRoom
            modelBuilder.Entity<SessionRoom>();
            #endregion
        }
    }
}

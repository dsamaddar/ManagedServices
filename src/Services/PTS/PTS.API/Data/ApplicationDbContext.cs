using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;

namespace PTS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<ProductCode> ProductCodes { get; set; }

        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Product> Products { get; set; }

        public DbSet<CylinderCompany> CylinderCompanies { get; set; }
        public DbSet<PrintingCompany> PrintingCompanies { get; set; }

        public DbSet<ProductVersion> ProductVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Category>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<ProductCode>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<CylinderCompany>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<PrintingCompany>()
                .HasIndex(u => u.Name)
                .IsUnique(true);
        }

    }
}

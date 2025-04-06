using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;

namespace PTS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Project> Projects { get; set; }

        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Product> Products { get; set; }

        public DbSet<CylinderCompany> CylinderCompanies { get; set; }
        public DbSet<PrintingCompany> PrintingCompanies { get; set; }



    }
}

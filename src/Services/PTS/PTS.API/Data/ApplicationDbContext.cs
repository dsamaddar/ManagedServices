using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;
using System.Data;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Reflection.Emit;
using System.Xml;

namespace PTS.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Product> Products { get; set; }

        public DbSet<ProductCode> ProductCodes { get; set; }

        public DbSet<CylinderCompany> CylinderCompanies { get; set; }
        public DbSet<PrintingCompany> PrintingCompanies { get; set; }

        public DbSet<ProductVersion> ProductVersions { get; set; }

        public DbSet<PackType> PackTypes { get; set; }

        public DbSet<BarCodes> BarCodes { get; set; }

        public DbSet<RefreshToken> RefreshTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Ignore<ProductCode>();

            builder.Entity<Category>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<CylinderCompany>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<PrintingCompany>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<PackType>()
                .HasIndex(u => u.Name)
                .IsUnique(true);

            builder.Entity<ProductVersion>()
                .HasIndex(u => u.Version)
                .IsUnique(true);

            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "BAKERY", Description = ".", UserId= "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 2, Name = "BEVERAGE", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 3, Name = "CONDIMENTS", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 4, Name = "CONFECTIONARY", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 5, Name = "DAIRY", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 6, Name = "DRINKING WATER", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 7, Name = "FRUIT DRINK", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 8, Name = "GRAINS", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 9, Name = "MEAT", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 10, Name = "PERSONAL CARE", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new Category { Id = 11, Name = "SNACKS", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
            );

            builder.Entity<PackType>().HasData(
                new PackType { Id = 1, Name = "BAG", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 2, Name = "BOX", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 3, Name = "BRICK", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 4, Name = "CAN", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 5, Name = "CHASE", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 6, Name = "CLUSTER", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 7, Name = "COMBIFIT", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 8, Name = "CONTAINER", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 9, Name = "CUP", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 10, Name = "FAT CAN", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 11, Name = "FOIL", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 12, Name = "GLASS BOTTLE", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 13, Name = "GLASS JAR", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 14, Name = "MASTER CARTON", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 15, Name = "PET", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 16, Name = "PILLOW", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 17, Name = "PLASTIC JAR", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 18, Name = "POLY", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 19, Name = "POUCH", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 20, Name = "PRISMA", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 21, Name = "SASSY", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 22, Name = "SHRINK", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 23, Name = "STANDING POUCH", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 24, Name = "TIN CONTAINER", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 25, Name = "UHT POUCH", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PackType { Id = 26, Name = "WRAPPER", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
            );

            builder.Entity<CylinderCompany>().HasData(
                new CylinderCompany { Id = 1, Name = "BANGLA - SHANGHAI PLATE MAKING LTD.", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new CylinderCompany { Id = 2, Name = "DIGITAL ENGRAVERS LTD.", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new CylinderCompany { Id = 3, Name = "MASTER PLATE MAKING(BD) CO.LTD.", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new CylinderCompany { Id = 4, Name = "PRINTO PACK SYNDICATE", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
            );

            builder.Entity<PrintingCompany>().HasData(
                new PrintingCompany { Id = 1, Name = "AFBL FOOD PARK", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 2, Name = "AKIJ PRINTING & PACKAGES LTD", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 3, Name = "ANNAN PACK LIMITED", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 4, Name = "ARBAB PACK LIMITED", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 5, Name = "BENGAL PRINTING & PACKAGING", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 6, Name = "FRESH PACK INDUSTRIES", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 7, Name = "MAHTAB FLEXIBLE PRINTING PRESS", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 8, Name = "PREMIAFLEX PLASTICS LTD", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 9, Name = "SHAJINAZ EXIM PACK LTD", Description = "." , UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" },
                new PrintingCompany { Id = 10, Name = "TAMPACO FOILS LTD", Description = ".", UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb" }
            );

        }

    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace PTS.API.Data
{
    public class AuthDbContext : IdentityDbContext
    {
        public AuthDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var readerRoleId = "637255cb-f655-4537-956a-075130dd9ac9";
            var managerRoleId = "15e6e97c-401d-4ba1-b124-4ffdcb577f6a";
            var adminRoleId = "1b9f33f8-0ff3-4669-9f87-89a5743efedb";

            // Create Reader, Manager, and Writer Role
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = readerRoleId,
                    Name = "Reader",
                    NormalizedName = "Reader".ToUpper(),
                    ConcurrencyStamp = readerRoleId
                },
                new IdentityRole()
                {
                    Id = managerRoleId,
                    Name = "Manager",
                    NormalizedName = "Manager".ToUpper(),
                    ConcurrencyStamp = managerRoleId
                },
                new IdentityRole()
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "Admin".ToUpper(),
                    ConcurrencyStamp = adminRoleId
                }
            };

            // Seed the roles
            builder.Entity<IdentityRole>().HasData(roles);

            // create a default Admin User
            var adminUserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb";
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "debayan.samaddar@neoscoder.com",
                Email = "debayan.samaddar@neoscoder.com",
                NormalizedEmail = "debayan.samaddar@neoscoder.com".ToUpper(),
                NormalizedUserName = "dsamaddar".ToUpper()
            };

            admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Farc1lgh#");
            builder.Entity<IdentityUser>().HasData(adminUserId);

            // Give Roles to Admin
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new()
                {
                    UserId = adminUserId,
                    RoleId = readerRoleId,
                },
                new()
                {
                    UserId = adminUserId,
                    RoleId = managerRoleId,
                },
                new()
                {
                    UserId = adminUserId,
                    RoleId = adminRoleId,
                }
            };

            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);
        }

    }
}

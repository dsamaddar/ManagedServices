﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace PTS.API.Data
{
    public class AuthDbContext : IdentityDbContext<IdentityUser>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Admin user credentials: {debayan.samaddar@neoscoder.com} {Farc1lgh#}
            // Test User Credentials: {test@neoscoder.com} {Asdf@1234}

            // Create Reader, Manager, and Writer Role

            // Seed the roles
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole() // Reader
                {
                    Id = "637255cb-f655-4537-956a-075130dd9ac9",
                    Name = "READER",
                    NormalizedName = "READER",
                    ConcurrencyStamp = "cbd4d134-aba9-461a-8c23-a31d777a8798",
                },
                new IdentityRole() // Manager
                {
                    Id = "15e6e97c-401d-4ba1-b124-4ffdcb577f6a",
                    Name = "MANAGER",
                    NormalizedName = "MANAGER",
                    ConcurrencyStamp = "cfc6c121-cb1b-48a6-942a-fb8cbb1a3b63",
                },
                new IdentityRole() // Admin
                {
                    Id = "1b9f33f8-0ff3-4669-9f87-89a5743efedb",
                    Name = "ADMIN",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "d4bd8428-bf22-4d8b-b0b3-6acc2fb4142c",
                }
            );

            // create a default Admin User

            //admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Farc1lgh#");
            builder.Entity<IdentityUser>().HasData(new IdentityUser
            {
                Id = "e07b4029-5a27-491d-9fc5-7043e22ae5eb",
                UserName = "debayan.samaddar@neoscoder.com",
                NormalizedUserName = "DEBAYAN.SAMADDAR@NEOSCODER.COM",
                Email = "debayan.samaddar@neoscoder.com",
                NormalizedEmail = "DEBAYAN.SAMADDAR@NEOSCODER.COM",
                EmailConfirmed = true,
                PasswordHash = "AQAAAAIAAYagAAAAEBZYK2AcpnXFPESoUdcPjsppX7q80XnHNd5x5mBHfvYDB0/qzdtBkpvb98FfscgIig==",
                ConcurrencyStamp = "8dc722aa-b923-4da8-8322-e2fe6267eeda"
            });

            // Give Roles to Admin
            
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string> // Reader
                {
                    UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb",
                    RoleId = "637255cb-f655-4537-956a-075130dd9ac9",
                },
                new IdentityUserRole<string> // Manager
                {
                    UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb",
                    RoleId = "15e6e97c-401d-4ba1-b124-4ffdcb577f6a",
                },
                new IdentityUserRole<string> // Admin
                {
                    UserId = "e07b4029-5a27-491d-9fc5-7043e22ae5eb",
                    RoleId = "1b9f33f8-0ff3-4669-9f87-89a5743efedb",
                }
            );
        }

    }
}

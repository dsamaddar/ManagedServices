using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PTS.API.Repositories.Implementation
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration configuration;
        private readonly ApplicationDbContext dbContext;

        public TokenRepository(IConfiguration configuration, ApplicationDbContext dbContext)
        {
            this.configuration = configuration;
            this.dbContext = dbContext;
        }
        public TokenResponse CreateJwtToken(IdentityUser user, List<string> roles)
        {
            // create claims from roles

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            // jwt security token parameters
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audiance"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // Generate secure refresh token
            var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            // Save refreshToken to DB (associated with user)
            SaveRefreshToken(user.Id, refreshToken);

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        private void SaveRefreshToken(string userId, string refreshToken)
        {
            var token = new RefreshToken
            {
                UserId = userId,
                Token = refreshToken,
                Expires = DateTime.UtcNow.AddDays(7),
                IsRevoked = false
            };

            dbContext.RefreshTokens.Add(token);
            dbContext.SaveChanges();
        }

        //public async Task<TokenResponse> GenerateTokensAsync(IdentityUser user)
        //{
        //    var roles = await user.GetRolesAsync(user);

        //    // JWT token
        //    var claims = new List<Claim>
        //{
        //    new Claim(ClaimTypes.Email, user.Email),
        //    new Claim(ClaimTypes.NameIdentifier, user.Id)
        //};

        //    claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        //    var jwtToken = new JwtSecurityToken(
        //        issuer: configuration["Jwt:Issuer"],
        //        audience: configuration["Jwt:Audience"],
        //        claims: claims,
        //        expires: DateTime.UtcNow.AddMinutes(15),
        //        signingCredentials: creds
        //    );

        //    var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

        //    // Refresh token
        //    var refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        //    var refreshTokenEntity = new RefreshToken
        //    {
        //        Token = refreshToken,
        //        UserId = user.Id,
        //        Expires = DateTime.UtcNow.AddDays(7),
        //        IsRevoked = false
        //    };

        //    dbContext.RefreshTokens.Add(refreshTokenEntity);
        //    await dbContext.SaveChangesAsync();

        //    return new TokenResponse
        //    {
        //        AccessToken = accessToken,
        //        RefreshToken = refreshToken
        //    };
        //}

        public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
        {
            return await dbContext.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token == token && !r.IsRevoked && r.Expires > DateTime.UtcNow);
        }

        public async Task RevokeRefreshTokenAsync(string token)
        {
            var existingToken = await dbContext.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
            if (existingToken != null)
            {
                existingToken.IsRevoked = true;
                dbContext.RefreshTokens.Update(existingToken);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}

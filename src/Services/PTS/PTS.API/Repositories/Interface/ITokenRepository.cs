using Microsoft.AspNetCore.Identity;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;

namespace PTS.API.Repositories.Interface
{
    public interface ITokenRepository
    {
        TokenResponse CreateJwtToken(IdentityUser user, List<string> roles);

        //Task<TokenResponse> GenerateTokensAsync(IdentityUser user);
        Task<RefreshToken?> GetRefreshTokenAsync(string token);
        Task RevokeRefreshTokenAsync(string token);
    }
}

using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IBarCodeRepository
    {
        Task<BarCodes> CreateAsync(BarCodes barCodes);
        Task<IEnumerable<BarCodes>> GetAllAsync();
        Task<BarCodes?> UpdateAsync(BarCodes barCodes);
        Task<BarCodes?> DeleteAsync(int id);
    }
}

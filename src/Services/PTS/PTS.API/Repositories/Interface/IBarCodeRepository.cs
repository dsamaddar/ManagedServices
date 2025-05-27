using PTS.API.Models.Domain;
using PTS.API.Models.DTO;

namespace PTS.API.Repositories.Interface
{
    public interface IBarCodeRepository
    {
        Task<BarCodes> CreateAsync(BarCodes barCodes);
        Task<IEnumerable<BarCodes>> GetAllAsync();
        Task<IEnumerable<BarCodes>> GetAllByProductIdAsync(int productId);
        Task<BarCodes?> UpdateAsync(BarCodes barCodes);
        Task<BarCodes?> DeleteAsync(int id);
        Task<List<BarCodes>?> DeleteByProdIdAsync(int productId);
        Task<BarCodes?> DeleteBarCodeByNameAsync(DeleteBarCodeRequestDto request);
    }
}

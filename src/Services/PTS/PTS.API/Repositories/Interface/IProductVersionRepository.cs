using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductVersionRepository
    {
        Task<ProductVersion> CreateAsync(ProductVersion productVersion);
        Task<IEnumerable<ProductVersion>> GetAllAsync();

        Task<ProductVersion?> GetByIdAsync(int id);
        Task<ProductVersion?> UpdateAsync(ProductVersion productVersion);
        Task<ProductVersion?> DeleteAsync(int id);
    }
}

using PTS.API.Models.Domain;
using PTS.API.Models.DTO;

namespace PTS.API.Repositories.Interface
{
    public interface IProductVersionRepository
    {
        Task<ProductVersion> CreateAsync(ProductVersion productVersion);
        Task<IEnumerable<ProductVersion>> GetAllAsync();

        Task<ProductVersion?> GetByIdAsync(int id);

        Task<ProductVersion[]?> GetProductVersionsByProductId(int productId);
        Task<Product?> GetShowProductVersionDetailById(int id);
        Task<ProductVersion?> UpdateAsync(ProductVersion productVersion);
        Task<ProductVersion?> DeleteAsync(int id);
    }
}

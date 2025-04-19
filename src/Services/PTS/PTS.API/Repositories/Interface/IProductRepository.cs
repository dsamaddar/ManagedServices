using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<Product> CreateAsync(Product product); 
        Task<IEnumerable<Product>> GetAllAsync(string? query = null, int? pageNumber = 1, int? pageSize = 5);

        Task<Product?> GetByIdAsync(int id);
        Task<Product?> UpdateAsync(Product product);
        Task<Product?> DeleteAsync(int id);

        Task<int> GetCount(string? query = null);
    }
}

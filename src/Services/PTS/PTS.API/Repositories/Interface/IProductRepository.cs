using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<Product> CreateAsync(Product product); 
        Task<IEnumerable<Product>> GetAllAsync();

        Task<Product?> GetById(int id);
        Task<Product?> UpdateAsync(Product product);
        Task<Product?> DeleteAsync(int id);
    }
}

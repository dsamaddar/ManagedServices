using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<Product> CreateAsync(Product product); 
        Task<IEnumerable<Product>> GetAllAsync();
    }
}

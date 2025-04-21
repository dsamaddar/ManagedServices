using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductCodeRepository
    {
        Task<ProductCode> CreateAsync(ProductCode productCode); 
        Task<IEnumerable<ProductCode>> GetAllAsync();

        Task<ProductCode?> GetById(int id);
        Task<ProductCode?> UpdateAsync(ProductCode productCode);
        Task<ProductCode?> DeleteAsync(int id);
    }
}

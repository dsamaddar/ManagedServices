using Microsoft.AspNetCore.Mvc;
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
        Task<IEnumerable<string>> GetSuggestionsBrand(string query);
        Task<IEnumerable<string>> GetSuggestionsFlavourType(string query);
        Task<IEnumerable<string>> GetSuggestionsOrigin(string query);
        Task<IEnumerable<string>> GetSuggestionsSKU(string query);
        Task<IEnumerable<string>> GetSuggestionsProductCode(string query);
        Task<IEnumerable<string>> GetSuggestionsBarCode(string query);
    }
}

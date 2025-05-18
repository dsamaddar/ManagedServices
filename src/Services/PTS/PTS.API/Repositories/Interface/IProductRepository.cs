using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProductRepository
    {
        Task<Product> CreateAsync(Product product); 
        Task<IEnumerable<Product>> GetAllAsync(string? query = null, int? pageNumber = 1, int? pageSize = 50,int[]? categoryid = null, string[]? brand = null, string[]? flavour = null, string[]? origin = null, string[]? sku = null, int[]? packtypeid = null, int[]? cylindercompanyid = null, int[]? printingcompanyid = null);

        Task<Product?> GetByIdAsync(int id);
        Task<Product?> UpdateAsync(Product product);
        Task<Product?> DeleteAsync(int id);
        Task<int> GetCount(string? query = null, int[] ? categoryid = null, string[]? brand = null, string[]? flavour = null, string[]? origin = null, string[]? sku = null, int[]? packtypeid = null, int[]? cylindercompanyid = null, int[]? printingcompanyid = null);
        Task<IEnumerable<string>> GetSuggestionsBrand(string? query, int[]? categoryId);
        Task<IEnumerable<string>> GetSuggestionsFlavourType(string? query, int[]? categoryId, string[]? brand);
        Task<IEnumerable<string>> GetSuggestionsOrigin(string query, int[]? categoryId, string[]? brand, string[]? flavour);
        Task<IEnumerable<string>> GetSuggestionsSKU(string query, int[]? categoryId, string[]? brand, string[]? flavour, string[]? origin);
        Task<IEnumerable<string>> GetSuggestionsProductCode(string query);
        Task<IEnumerable<string>> GetSuggestionsVersion(string query);

        Task<IEnumerable<string>> GetSuggestionsBarCode(string query);
        Task<Boolean> GetIsProductCodeUnique(string query);
        Task<Boolean> GetIsVersionUnique(string query);
        Task<Boolean> GetIsBarCodeUnique(string query);
    }
}

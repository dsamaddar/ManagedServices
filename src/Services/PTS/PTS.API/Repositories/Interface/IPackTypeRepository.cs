using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IPackTypeRepository
    {
        Task<PackType> CreateAsync(PackType packType);
        Task<IEnumerable<PackType>> GetAllAsync();
        Task<IEnumerable<PackType>> GetAllSuggestionAsync(string query, int[]? categoryId, string[]? brand, string[]? flavour, string[]? origin, string[]? sku);

        Task<PackType?> GetByIdAsync(int id);

        Task<PackType?> UpdateAsync(PackType packType);

        Task<PackType?> DeleteAsync(int id);
    }
}

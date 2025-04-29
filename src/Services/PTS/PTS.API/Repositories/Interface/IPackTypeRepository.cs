using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IPackTypeRepository
    {
        Task<PackType> CreateAsync(PackType packType);
        Task<IEnumerable<PackType>> GetAllAsync();

        Task<PackType?> GetByIdAsync(int id);

        Task<PackType?> UpdateAsync(PackType packType);

        Task<PackType?> DeleteAsync(int id);
    }
}

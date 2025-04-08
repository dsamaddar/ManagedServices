using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface ICategoryRepository
    {
        Task<Category> CreateAsync(Category category);
        Task<IEnumerable<Category>> GetAllAsync();

        Task<Category?> GetById(int id);

        Task<Category?> UpdateAsync(Category category);

        Task<Category?> DeleteAsync(int id);
    }
}

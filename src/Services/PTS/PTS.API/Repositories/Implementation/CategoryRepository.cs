using Microsoft.EntityFrameworkCore.ChangeTracking;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext dbContext;

        public CategoryRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await dbContext.Categories.AddAsync(category);
            await dbContext.SaveChangesAsync();

            return category;
        }
    }
}

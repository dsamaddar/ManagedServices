using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class ProductCodeRepository : IProductCodeRepository
    {
        private readonly ApplicationDbContext dbContext;

        public ProductCodeRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<ProductCode> CreateAsync(ProductCode project)
        {
            try
            {
                await dbContext.ProductCodes.AddAsync(project);
                await dbContext.SaveChangesAsync();
                return project;
            }
            catch (DbUpdateException dbEx)
            {
                // Handle specific EF Core exceptions like unique constraint violation
                throw new RepositoryException("Database update failed. Possibly a duplicate entry.", dbEx);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("An unexpected error occurred while adding the user.", ex);
            }
        }

        public async Task<ProductCode?> DeleteAsync(int id)
        {
            var existingProject = await dbContext.ProductCodes.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProject == null)
            {
                return null;
            }

            dbContext.ProductCodes.Remove(existingProject);
            await dbContext.SaveChangesAsync();

            return existingProject;
        }

        public async Task<IEnumerable<ProductCode>> GetAllAsync()
        {
            return await dbContext.ProductCodes.ToListAsync();
        }

        public async Task<ProductCode?> GetById(int id)
        {
            return await dbContext.ProductCodes.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<ProductCode?> UpdateAsync(ProductCode project)
        {
            var existingProject = await dbContext.ProductCodes.FirstOrDefaultAsync(x => x.Id == project.Id);

            if (existingProject != null)
            {
                dbContext.ProductCodes.Entry(existingProject).CurrentValues.SetValues(project);
                await dbContext.SaveChangesAsync();

                return project;
            }

            return null;
        }
    }
}

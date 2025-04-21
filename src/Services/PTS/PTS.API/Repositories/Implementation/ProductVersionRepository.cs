using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class ProductVersionRepository : IProductVersionRepository
    {
        private readonly ApplicationDbContext dbContext;

        public ProductVersionRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<ProductVersion> CreateAsync(ProductVersion productVersion)
        {
            try
            {
                await dbContext.ProductVersions.AddAsync(productVersion);
                await dbContext.SaveChangesAsync();

                return productVersion;
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

        public async Task<ProductVersion?> DeleteAsync(int id)
        {
            var existingProductVersion = await dbContext.ProductVersions.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProductVersion is null)
            {
                return null;
            }

            dbContext.ProductVersions.Remove(existingProductVersion);
            await dbContext.SaveChangesAsync();

            return existingProductVersion;
        }

        public async Task<IEnumerable<ProductVersion>> GetAllAsync()
        {
            return await dbContext.ProductVersions.ToListAsync();
        }

        public async Task<ProductVersion?> GetById(int id)
        {
            return await dbContext.ProductVersions.FirstOrDefaultAsync(x => x.Id == id);
        }

        public Task<ProductVersion?> UpdateAsync(ProductVersion productVersion)
        {
            throw new NotImplementedException();
        }
    }
}

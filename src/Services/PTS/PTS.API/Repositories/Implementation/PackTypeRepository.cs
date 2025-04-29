using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;

namespace PTS.API.Repositories.Implementation
{
    public class PackTypeRepository
    {
        private readonly ApplicationDbContext dbContext;

        public PackTypeRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<PackType> CreateAsync(PackType packType)
        {
            try
            {
                await dbContext.PackTypes.AddAsync(packType);
                await dbContext.SaveChangesAsync();

                return packType;
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

        public async Task<PackType?> DeleteAsync(int id)
        {
            var existingPackType = await dbContext.PackTypes.FirstOrDefaultAsync(x => x.Id == id);

            if (existingPackType is null)
            {
                return null;
            }

            dbContext.PackTypes.Remove(existingPackType);
            await dbContext.SaveChangesAsync();

            return existingPackType;

        }

        public async Task<IEnumerable<PackType>> GetAllAsync()
        {
            return await dbContext.PackTypes.ToListAsync();
        }

        public async Task<PackType?> GetById(int id)
        {
            return await dbContext.PackTypes.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PackType?> UpdateAsync(PackType packType)
        {
            var existingPackType = await dbContext.PackTypes.FirstOrDefaultAsync(x => x.Id == packType.Id);

            if (existingPackType != null)
            {
                dbContext.Entry(existingPackType).CurrentValues.SetValues(packType);
                await dbContext.SaveChangesAsync();

                return packType;
            }

            return null;
        }
    }
}

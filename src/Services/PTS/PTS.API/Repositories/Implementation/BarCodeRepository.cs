using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class BarCodeRepository : IBarCodeRepository
    {
        private readonly ApplicationDbContext dbContext;

        public BarCodeRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<BarCodes> CreateAsync(BarCodes barCodes)
        {
            try
            {
                await dbContext.BarCodes.AddAsync(barCodes);
                await dbContext.SaveChangesAsync();

                return barCodes;
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

        public async Task<BarCodes?> DeleteAsync(int id)
        {
            var barCodes = await dbContext.BarCodes.FirstOrDefaultAsync(x => x.Id == id);

            if (barCodes != null)
            {
                dbContext.BarCodes.Remove(barCodes);
                await dbContext.SaveChangesAsync();
            }

            return barCodes;
        }

        public async Task<IEnumerable<BarCodes>> GetAllAsync()
        {
            return await dbContext.BarCodes.ToListAsync();
        }

        public async Task<BarCodes?> UpdateAsync(BarCodes barCodes)
        {
            var existingBarCode = await dbContext.BarCodes.FirstOrDefaultAsync(x => x.Id == barCodes.Id);

            if (existingBarCode != null)
            {
                dbContext.Entry(existingBarCode).CurrentValues.SetValues(barCodes);
                await dbContext.SaveChangesAsync();

                return barCodes;
            }

            return null;
        }
    }
}

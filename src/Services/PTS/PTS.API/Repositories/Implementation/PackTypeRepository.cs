using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class PackTypeRepository: IPackTypeRepository
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
            return await dbContext.PackTypes.OrderBy(x => x.Name).ToListAsync();
        }

        public async Task<IEnumerable<PackType>> GetAllSuggestionAsync(string query, int[]? categoryId, string[]? brand, string[]? flavour, string[]? origin, string[]? sku)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<PackType>();

            var filtered_products = await dbContext.Products
                .Where(f =>
                    (f.SKU != null && EF.Functions.Like(f.SKU, $"%{query}%")) &&
                    (categoryId == null || categoryId.Length == 0 || (f.CategoryId.HasValue && categoryId.Contains(f.CategoryId.Value))) &&
                    (brand == null || brand.Length == 0 || (f.Brand != null && brand.Contains(f.Brand))) &&
                    (flavour == null || flavour.Length == 0 || (f.FlavourType != null && flavour.Contains(f.FlavourType))) &&
                    (origin == null || origin.Length == 0 || (f.Origin != null && origin.Contains(f.Origin))) &&
                    (sku == null || sku.Length == 0 || (f.SKU != null && sku.Contains(f.SKU)))
                 )
                .Select(f => f.PackTypeId)
                .Distinct()
                .ToListAsync();

            var packTypes = await dbContext.PackTypes
                                  .Where(p => filtered_products.Contains(p.Id))
                                  .OrderBy(p => p.Id)
                                  .ToListAsync();

            return packTypes;
        }

        public async Task<PackType?> GetByIdAsync(int id)
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

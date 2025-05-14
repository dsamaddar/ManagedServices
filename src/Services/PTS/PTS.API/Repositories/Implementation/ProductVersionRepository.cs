using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;
using System;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
            var productVersion = await dbContext.ProductVersions
                .Include(pv => pv.Attachments)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (productVersion?.Attachments != null && productVersion.Attachments.Any())
            {
                if (productVersion?.Attachments?.Any() == true)
                {
                    dbContext.Attachments.RemoveRange(productVersion.Attachments);
                }
            }

            if (productVersion != null)
            {
                dbContext.ProductVersions.Remove(productVersion);
                await dbContext.SaveChangesAsync();
            }

            return productVersion;
        }

        public async Task<IEnumerable<ProductVersion>> GetAllAsync()
        {
            return await dbContext.ProductVersions.ToListAsync();
        }

        public async Task<ProductVersion?> GetByIdAsync(int id)
        {
            return await dbContext.ProductVersions.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<ProductVersion>> GetProductVersionsByProductId(int productId)
        {
            return await dbContext.ProductVersions
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.Attachments)
                .Where(x => x.ProductId == productId)
                .OrderByDescending(x => x.VersionDate)
                .ToArrayAsync();
        }

        public async Task<Product?> GetShowProductVersionDetailById(int id)
        {
            return await dbContext.Products
                 .Include(x => x.CylinderCompany)
                 .Include(x => x.PrintingCompany)
                 .Include(x => x.PackType)
                 .Include(x => x.Category)
                 .Include(x => x.ProductVersions)
                     .ThenInclude(pv => pv.Attachments)
                 .Where(x => x.ProductVersions.Any(pv => pv.Id == id))
                 .FirstOrDefaultAsync();

        }

        public Task<ProductVersion?> UpdateAsync(ProductVersion productVersion)
        {
            throw new NotImplementedException();
        }
    }
}

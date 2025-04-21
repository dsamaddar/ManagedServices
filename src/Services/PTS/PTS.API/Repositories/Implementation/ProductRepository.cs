using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext dbContext;

        public ProductRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Product> CreateAsync(Product product)
        {
            try
            {
                await dbContext.Products.AddAsync(product);
                await dbContext.SaveChangesAsync();
                return product;
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

        public async Task<Product?> DeleteAsync(int id)
        {
            var existingProduct = await dbContext.Products.FirstOrDefaultAsync(x => x.Id == id);

            if(existingProduct == null)
            {
                return null;
            }

            dbContext.Products.Remove(existingProduct);
            await dbContext.SaveChangesAsync();

            return existingProduct;
        }

        public async Task<IEnumerable<Product>> GetAllAsync(string? query = null, int? pageNumber = 1, int? pageSize = 5)
        {
            // Query the database not actually retrieving anything
            var products = dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.Project)
                .Include(x => x.Category)
                .Include(x => x.Attachments)
                .OrderByDescending(x => x.ProjectDate)
                .AsQueryable();

            // Filtering

            if(string.IsNullOrWhiteSpace(query) == false)
            {
                products = products
                            .Where(x => 
                            (x.Barcode != null && x.Barcode.Contains(query)) ||
                            (x.Brand != null && x.Brand.Contains(query)) ||
                            (x.FlavourType != null && x.FlavourType.Contains(query)) ||
                            (x.Origin != null && x.Origin.Contains(query)) ||
                            (x.SKU != null && x.SKU.Contains(query)) ||
                            (x.PackType != null && x.PackType.Contains(query)) ||
                            (x.Version != null && x.Version.Contains(query))
                            )
                            .OrderByDescending(x => x.ProjectDate);
            }

            // Sorting

            // Pagination
            // pageNumber 1 pageSize 5 - skip 0, take 5
            // pageNumber 2 pageSize 5 - skip 5 take 5
            // pageNumber 3 pageSize 5 - skip 10 take 5

            var skipResults = (pageNumber - 1) * pageSize;
            products = products.Skip(skipResults ?? 0).Take(pageSize ?? 5); 

            // Return the list of products

            return await products.ToListAsync();


            /*
            return await dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.Project)
                .Include(x => x.Category)
                .Include(x => x.Attachments)
                .ToListAsync();
            */
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.Project)
                .Include(x => x.Category)
                .Include(x => x.Attachments)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<int> GetCount(string? query = null)
        {
            // Query the database not actually retrieving anything
            var products = dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.Project)
                .Include(x => x.Category)
                .Include(x => x.Attachments)
                .AsQueryable();

            // Filtering

            if (string.IsNullOrWhiteSpace(query) == false)
            {
                products = products
                            .Where(x =>
                            (x.Barcode != null && x.Barcode.Contains(query)) ||
                            (x.Brand != null && x.Brand.Contains(query)) ||
                            (x.FlavourType != null && x.FlavourType.Contains(query)) ||
                            (x.Origin != null && x.Origin.Contains(query)) ||
                            (x.SKU != null && x.SKU.Contains(query)) ||
                            (x.PackType != null && x.PackType.Contains(query)) ||
                            (x.Version != null && x.Version.Contains(query))
                            )
                            .OrderByDescending(x => x.ProjectDate);
            }

            return await products.CountAsync();
        }

        public async Task<Product?> UpdateAsync(Product product)
        {
            var existingProduct = await dbContext.Products.FirstOrDefaultAsync(x => x.Id == product.Id);

            if (existingProduct != null)
            {
                dbContext.Products.Entry(existingProduct).CurrentValues.SetValues(product);
                await dbContext.SaveChangesAsync();

                return product;
            }

            return null;
        }
    }
}

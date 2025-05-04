using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.EntityFrameworkCore.Query;
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

        public async Task<IEnumerable<Product>> GetAllAsync(string? query = null, int? pageNumber = 1, int? pageSize = 5, int? categoryid = null, string? brand = null, string? flavour = null, string? origin = null, string? sku = null, int? packtypeid = null, int? cylindercompanyid = null, int? printingcompanyid = null)
        {
            // Query the database not actually retrieving anything
            var products = dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .Include(x => x.ProductVersions)
                    .ThenInclude(pv => pv.Attachments)
                .OrderByDescending(x => x.ProjectDate)
                .AsQueryable();

            // Filtering

            if (string.IsNullOrWhiteSpace(query) == false)
            {
                query = "";
            }

            if (string.IsNullOrWhiteSpace(query) == false || categoryid != null  || brand != null || flavour != null || origin != null || sku != null || packtypeid != null || cylindercompanyid != null || printingcompanyid != null)
            {
                products = products
                            .Where(x =>
                            // OR-based query search
                            (string.IsNullOrWhiteSpace(query) || (
                            (x.Barcode != null && x.Barcode.Contains(query)) ||
                            (x.Brand != null && x.Brand.Contains(query)) ||
                            (x.FlavourType != null && x.FlavourType.Contains(query)) ||
                            (x.Origin != null && x.Origin.Contains(query)) ||
                            (x.SKU != null && x.SKU.Contains(query)) ||
                            (x.ProductCode != null && x.ProductCode.Contains(query)) ||
                            (x.Version != null && x.Version.Contains(query)) ||
                            (x.Category != null && x.Category.Name != null && x.Category.Name.Contains(query)) ||
                            (x.PrintingCompany != null && x.PrintingCompany.Name != null && x.PrintingCompany.Name.Contains(query)) ||
                            (x.CylinderCompany != null && x.CylinderCompany.Name != null && x.CylinderCompany.Name.Contains(query)) ||
                            (x.PackType != null && x.PackType.Name != null && x.PackType.Name.Contains(query)) ||
                            (x.CategoryId != null && x.CategoryId == categoryid) ||
                            (x.PackTypeId != null && x.PackTypeId == packtypeid) ||
                            (x.CylinderCompanyId != null && x.CylinderCompanyId == cylindercompanyid) ||
                            (x.PrintingCompanyId != null && x.PrintingCompanyId == printingcompanyid)
                            )
                            ) &&
                            // AND-based filters (apply only if filter has value)
                            (categoryid == null || x.CategoryId == categoryid) &&
                            (brand == null || x.Brand == brand) &&
                            (flavour == null || x.FlavourType == flavour) &&
                            (origin == null || x.Origin == origin) &&
                            (sku == null || x.SKU == sku) &&
                            (packtypeid == null || x.PackTypeId == packtypeid) &&
                            (cylindercompanyid == null || x.CylinderCompanyId == cylindercompanyid) &&
                            (printingcompanyid == null || x.PrintingCompanyId == printingcompanyid)
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
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .Include(x => x.ProductVersions)
                    .ThenInclude(pv => pv.Attachments)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<int> GetCount(string? query = null, int ? categoryid = null, string? brand = null, string? flavour = null, string? origin = null, string? sku = null, int? packtypeid = null, int? cylindercompanyid = null, int? printingcompanyid = null)
        {
            // Query the database not actually retrieving anything
            var products = dbContext.Products
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .Include(x => x.ProductVersions)
                .AsQueryable();

            // Filtering

            if (string.IsNullOrWhiteSpace(query) == false || categoryid != null || brand != null || flavour != null || origin != null || sku != null || packtypeid != null || cylindercompanyid != null || printingcompanyid != null)
            {
                products = products
                            
                            .Where(x =>
                            // OR-based query search
                            (string.IsNullOrWhiteSpace(query) || (
                            (x.Barcode != null && x.Barcode.Contains(query)) ||
                            (x.Brand != null && x.Brand.Contains(query)) ||
                            (x.FlavourType != null && x.FlavourType.Contains(query)) ||
                            (x.Origin != null && x.Origin.Contains(query)) ||
                            (x.SKU != null && x.SKU.Contains(query)) ||
                            (x.ProductCode != null && x.ProductCode.Contains(query)) ||
                            (x.Version != null && x.Version.Contains(query))
                            )
                            ) &&
                            // AND-based filters (apply only if filter has value)
                            (categoryid == null || x.CategoryId == categoryid) &&
                            (brand == null || x.Brand == brand) &&
                            (flavour == null || x.FlavourType == flavour) &&
                            (origin == null || x.Origin == origin) &&
                            (sku == null || x.SKU == sku) &&
                            (packtypeid == null || x.PackTypeId == packtypeid) &&
                            (cylindercompanyid == null || x.CylinderCompanyId == cylindercompanyid) &&
                            (printingcompanyid == null || x.PrintingCompanyId == printingcompanyid)
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

        public async Task<IEnumerable<string>> GetSuggestionsBrand(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f => 
                    (f.Brand != null && EF.Functions.Like(f.Brand, $"%{query}%")))
                .OrderBy(f => f.Brand)
                .Select(f => f.Brand!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsFlavourType(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.FlavourType != null && EF.Functions.Like(f.FlavourType, $"%{query}%")))
                .OrderBy(f => f.FlavourType)
                .Select(f => f.FlavourType!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsOrigin(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.Origin != null && EF.Functions.Like(f.Origin, $"%{query}%")))
                .OrderBy(f => f.Origin)
                .Select(f => f.Origin!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsSKU(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.SKU != null && EF.Functions.Like(f.SKU, $"%{query}%")))
                .OrderBy(f => f.SKU)
                .Select(f => f.SKU!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsProductCode(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.ProductCode != null && f.ProductCode.Contains(query)))
                .OrderBy(f => f.ProductCode)
                .Select(f => f.ProductCode!) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsVersion(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.Version != null && f.Version.Contains(query)))
                .OrderBy(f => f.Version)
                .Select(f => f.Version!) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<Boolean> GetIsVersionUnique(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return true;

            var results = await dbContext.Products
                .Where(f =>
                    (f.Version != null && f.Version == query))
                .Select(f => f.Version!) //null-forgiving operator (!)
                .ToListAsync();

            if (results.Any()) return false;

            return true;
        }

        public async Task<IEnumerable<string>> GetSuggestionsBarCode(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.Barcode != null && f.Barcode.Contains(query)))
                .OrderBy(f => f.Barcode)
                .Select(f => f.Barcode!) //null-forgiving operator (!)
                .Distinct()
                .Take(10)
                .ToListAsync();

            return results;
        }

        public async Task<Boolean> GetIsBarCodeUnique(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return true;

            var results = await dbContext.Products
                .Where(f =>
                    (f.Barcode != null && f.Barcode == query))
                .Select(f => f.Barcode!) //null-forgiving operator (!)
                .ToListAsync();

            if (results.Any()) return false;

            return true;
        }

    }
}

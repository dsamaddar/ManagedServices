using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using Microsoft.EntityFrameworkCore.Query;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;
using System.Runtime.CompilerServices;

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
            var existingProduct = await dbContext.Products
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.CylinderCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.PrintingCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.Attachments)
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            if(existingProduct == null)
            {
                return null;
            }

            // Remove attachments
            foreach (var version in existingProduct.ProductVersions)
            {
                if (version.Attachments != null && version.Attachments.Any())
                {
                    dbContext.Attachments.RemoveRange(version.Attachments);
                    await dbContext.SaveChangesAsync();
                }
            }

            // Remove ProductVersion
            if (existingProduct.ProductVersions != null && existingProduct.ProductVersions.Any()) {
                dbContext.ProductVersions.RemoveRange(existingProduct.ProductVersions);
                await dbContext.SaveChangesAsync();
            }
            
            dbContext.Products.Remove(existingProduct);
            await dbContext.SaveChangesAsync();

            return existingProduct;
        }

        public async Task<IEnumerable<Product>> GetAllAsync(string? query = null, int? pageNumber = 1, int? pageSize = 5, int[]? categoryid = null, string[]? brand = null, string[]? flavour = null, string[]? origin = null, string[]? sku = null, int[]? packtypeid = null, int[]? cylindercompanyid = null, int[]? printingcompanyid = null)
        {

            // Query the database not actually retrieving anything
            var products = dbContext.Products
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.CylinderCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.PrintingCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.Attachments)
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .AsQueryable();

            // Filtering
            if (string.IsNullOrWhiteSpace(query) == false || categoryid != null || brand != null || flavour != null || origin != null || sku != null || packtypeid != null || cylindercompanyid != null || printingcompanyid != null)
            {
                products = products
                            .Where(x =>
                            // OR-based query search
                            (string.IsNullOrWhiteSpace(query) ||
                                (
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
                                    (x.PackType != null && x.PackType.Name != null && x.PackType.Name.Contains(query))
                                )
                            )
                            );
            }

            // more filtering options

            if (categoryid != null && categoryid.Length > 0)
            {
                products = products.Where(x => x.CategoryId.HasValue && categoryid.Contains(x.CategoryId.Value));
            }

            if (packtypeid != null && packtypeid.Length > 0)
            {
                products = products.Where(x => x.PackTypeId.HasValue && packtypeid.Contains(x.PackTypeId.Value));
            }

            if (cylindercompanyid != null && cylindercompanyid.Length > 0)
            {
                products = products.Where(x => x.CylinderCompanyId.HasValue && cylindercompanyid.Contains(x.CylinderCompanyId.Value));
            }

            if (printingcompanyid != null && printingcompanyid.Length > 0)
            {
                products = products.Where(x => x.PrintingCompanyId.HasValue && printingcompanyid.Contains(x.PrintingCompanyId.Value));
            }

            if (brand != null && brand.Length > 0)
            {
                products = products.Where(x => brand.Contains(x.Brand));
            }

            if (flavour != null && flavour.Length > 0)
            {
                products = products.Where(x => flavour.Contains(x.FlavourType));
            }

            if (origin != null && origin.Length > 0)
            {
                products = products.Where(x => origin.Contains(x.Origin));
            }

            if (sku != null && sku.Length > 0)
            {
                products = products.Where(x => sku.Contains(x.SKU));
            }

            // Ordering
            products = products.OrderBy(x => x.Category.Name)
                            .ThenBy(x => x.Brand)
                            .ThenBy(x => x.FlavourType)
                            .ThenBy(x => x.Origin)
                            .ThenBy(x => x.SKU)
                            .ThenBy(x => x.ProductCode)
                            .ThenBy(x => x.PackType.Name)
                            .ThenBy(x => x.Barcode)
                            .ThenBy(x => x.CylinderCompany.Name)
                            .ThenBy(x => x.PrintingCompany.Name);

            // Pagination
            // pageNumber 1 pageSize 5 - skip 0, take 5
            // pageNumber 2 pageSize 5 - skip 5 take 5
            // pageNumber 3 pageSize 5 - skip 10 take 5

            var skipResults = (pageNumber - 1) * pageSize;
            products = products.Skip(skipResults ?? 0).Take(pageSize ?? 5);

            // Return the list of products
            var productsList = await products.ToListAsync();
            return productsList;

        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            var product = await dbContext.Products
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.CylinderCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.PrintingCompany)
                .Include(p => p.ProductVersions)
                    .ThenInclude(pv => pv.Attachments)
                .Include(x => x.CylinderCompany)
                .Include(x => x.PrintingCompany)
                .Include(x => x.PackType)
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product != null)
            {
                product.ProductVersions = product.ProductVersions
                    .OrderByDescending(pv => pv.VersionDate) // or .Version
                    .ToList();
            }

            return product;
        }

        public async Task<int> GetCount(string? query = null, int[] ? categoryid = null, string[]? brand = null, string[]? flavour = null, string[]? origin = null, string[]? sku = null, int[]? packtypeid = null, int[]? cylindercompanyid = null, int[]? printingcompanyid = null)
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
                            )
                            );
            }

            // more filtering options

            if (categoryid != null && categoryid.Length > 0)
            {
                products = products.Where(x => x.CategoryId.HasValue && categoryid.Contains(x.CategoryId.Value));
            }

            if (packtypeid != null && packtypeid.Length > 0)
            {
                products = products.Where(x => x.PackTypeId.HasValue && packtypeid.Contains(x.PackTypeId.Value));
            }

            if (cylindercompanyid != null && cylindercompanyid.Length > 0)
            {
                products = products.Where(x => x.CylinderCompanyId.HasValue && cylindercompanyid.Contains(x.CylinderCompanyId.Value));
            }

            if (printingcompanyid != null && printingcompanyid.Length > 0)
            {
                products = products.Where(x => x.PrintingCompanyId.HasValue && printingcompanyid.Contains(x.PrintingCompanyId.Value));
            }

            if (brand != null && brand.Length > 0)
            {
                products = products.Where(x => brand.Contains(x.Brand));
            }

            if (flavour != null && flavour.Length > 0)
            {
                products = products.Where(x => flavour.Contains(x.FlavourType));
            }

            if (origin != null && origin.Length > 0)
            {
                products = products.Where(x => origin.Contains(x.Origin));
            }

            if (sku != null && sku.Length > 0)
            {
                products = products.Where(x => sku.Contains(x.SKU));
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
                .Select(f => f.Brand!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
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
                .Select(f => f.FlavourType!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
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
                .Select(f => f.Origin!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
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
                .Select(f => f.SKU!.ToUpper()) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsProductCode(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.ProductCode != null && EF.Functions.Like(f.ProductCode, $"%{query}%")))
                .Select(f => f.ProductCode!) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<string>> GetSuggestionsVersion(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            var results = await dbContext.Products
                .Where(f =>
                    (f.Version != null && EF.Functions.Like(f.Version, $"%{query}%")))
                .Select(f => f.Version!) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
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
                    (f.Barcode != null && EF.Functions.Like(f.Barcode, $"%{query}%")))
                .Select(f => f.Barcode!) //null-forgiving operator (!)
                .Distinct()
                .OrderBy(b => b)
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

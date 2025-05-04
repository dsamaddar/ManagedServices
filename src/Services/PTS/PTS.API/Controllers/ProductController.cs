using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;
using System.Linq;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository productRepository;
        private readonly IAttachmentRepository attachmentRepository;

        public ProductController(IProductRepository productRepository, IAttachmentRepository attachmentRepository)
        {
            this.productRepository = productRepository;
            this.attachmentRepository = attachmentRepository;
        }

        // https://localhost:xxxx/api/product
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDto request)
        {
            // Map DTO to Domain Model
            var product = new Product
            {
                CategoryId = request.CategoryId,
                ProductCode = request.ProductCode,
                Brand = request.Brand,
                FlavourType = request.FlavourType,
                Origin = request.Origin,
                SKU = request.SKU,                
                Version = request.Version,
                ProjectDate = request.ProjectDate,
                Barcode = request.Barcode,
                CylinderCompanyId = request.CylinderCompanyId,
                PrintingCompanyId = request.PrintingCompanyId,
                PackTypeId = request.PackTypeId,
                UserId = request.UserId,
            };

            await productRepository.CreateAsync(product);

            // Domain model to DTO
            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProductCode = product.ProductCode,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                CylinderCompanyId = product.CylinderCompanyId,
                PrintingCompanyId = product.PrintingCompanyId,
                PackTypeId = request.PackTypeId,
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // GET: /api/product?query=html
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] string? query,
            [FromQuery] int? pageNumber,
            [FromQuery] int? pageSize,
            [FromQuery] int? categoryid,
            [FromQuery] string? brand,
            [FromQuery] string? flavour,
            [FromQuery] string? origin,
            [FromQuery] string? sku,
            [FromQuery] int? packtypeid,
            [FromQuery] int? cylindercompanyid,
            [FromQuery] int? printingcompanyid)
        {
            var products = await productRepository.GetAllAsync(query, pageNumber, pageSize, categoryid,brand,flavour,origin,sku,packtypeid,cylindercompanyid,printingcompanyid);

            // Map Domain model to DTO
            var response = new List<ProductDto>();
            foreach (var product in products)
            {
                response.Add(new ProductDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
                    Brand = product.Brand,
                    FlavourType = product.FlavourType,
                    Origin = product.Origin,
                    SKU = product.SKU,
                    ProductCode = product.ProductCode,
                    Version = product.Version,
                    ProjectDate = product.ProjectDate,
                    Barcode = product.Barcode,
                    CylinderCompanyId = product.CylinderCompanyId,
                    PrintingCompanyId = product.PrintingCompanyId,
                    ProductVersions = product.ProductVersions?.Select( x => new ProductVersionDto
                    {
                        Id = x.Id,
                        Version = x.Version,
                        VersionDate = x.VersionDate,
                        ProductId = x.ProductId,
                        UserId = x.UserId,

                        Attachments = x.Attachments?.Select(a => new AttachmentDto
                        {
                            Id = a.Id,
                            Name = a.Name,
                            Description = a.Description,
                            DateCreated = a.DateCreated,
                            Tag = a.Tag,
                            UserId = a.UserId
                        }).ToList(),                       
                    }).ToList(),
                    Category = new CategoryDto
                    {
                        Id = product.Category?.Id ?? 0,
                        Name = product.Category?.Name,
                    },
                    CylinderCompany = new CylinderCompanyDto
                    {
                        Id = product.CylinderCompany?.Id ?? 0,
                        Name = product.CylinderCompany?.Name
                    },
                    PrintingCompany = new PrintingCompanyDto
                    {
                        Id = product.PrintingCompany?.Id ?? 0,
                        Name = product.PrintingCompany?.Name
                    },
                    PackType = new PackTypeDto
                    {
                        Id = product.PackType?.Id ?? 0,
                        Name = product.PackType?.Name
                    },
                    UserId = product.UserId,
                });
            }

            return Ok(response);
        }

        // GET: {apiBaseUrl}/api/product/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetProductById([FromRoute] int id)
        {
            // Get the product from the repository
            var product = await productRepository.GetByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            // convert domain model to dto
            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProductCode = product.ProductCode,
                Brand = product.Brand,
                Barcode = product.Barcode,
                CylinderCompanyId = product.CylinderCompanyId,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                PrintingCompanyId = product.PrintingCompanyId,
                ProjectDate = product.ProjectDate,
                SKU = product.SKU,
                Version = product.Version,
                PackTypeId = product.PackTypeId,
                ProductVersions = product.ProductVersions?.Select(x => new ProductVersionDto
                {
                    Id = x.Id,
                    Version = x.Version,
                    VersionDate = x.VersionDate,
                    ProductId = x.ProductId,


                    Attachments = x.Attachments?.Select(a => new AttachmentDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        DateCreated = a.DateCreated,
                    }).ToList(),
                }).ToList(),
                Category = new CategoryDto
                {
                    Id  = product.Category?.Id ?? 0,
                    Name = product.Category?.Name,
                },
                CylinderCompany = new CylinderCompanyDto
                {
                    Id = product.CylinderCompany?.Id ?? 0,
                    Name = product.CylinderCompany?.Name
                },
                PrintingCompany = new PrintingCompanyDto
                {
                    Id = product.PrintingCompany?.Id ?? 0,
                    Name = product.PrintingCompany?.Name
                },
                PackType = new PackTypeDto
                {
                    Id = product.PackType?.Id ?? 0,
                    Name = product.PackType?.Name
                },
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/product/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditProduct([FromRoute] int id, UpdateProductRequestDto request)
        {
            // Convert DTO to Domain Model
            var product = new Product
            {
                Id = id,
                CategoryId = request.CategoryId,
                Brand= request.Brand,
                FlavourType = request.FlavourType,
                Origin = request.Origin,
                SKU = request.SKU,
                ProductCode =request.ProductCode,
                Version = request.Version,
                ProjectDate = request.ProjectDate,
                Barcode = request.Barcode,
                PrintingCompanyId = request.PrintingCompanyId,
                CylinderCompanyId = request.CylinderCompanyId,
                PackTypeId = request.PackTypeId,
                UserId = request.UserId,
            };

            product = await productRepository.UpdateAsync(product);

            if (product == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProductCode = product.ProductCode,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                PrintingCompanyId = product.PrintingCompanyId,
                CylinderCompanyId = product.CylinderCompanyId,
                PackTypeId = product.PackTypeId,
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // DELETE: /api/projects/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteProduct([FromRoute] int id)
        {
            var product = await productRepository.DeleteAsync(id);

            if (product is null)
            {
                return NotFound();
            }
            
            // delete related attachments
            await attachmentRepository.DeleteByProductIdAsync(product.Id);

            // Convert Domain Model to DTO

            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProductCode = product.ProductCode,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                PrintingCompanyId = product.PrintingCompanyId,
                CylinderCompanyId = product.CylinderCompanyId,
                PackTypeId = product.PackTypeId,
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // GET: {apiBaseUrl}/api/product/count
        [HttpGet]
        [Route("count")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetProductCount(
            [FromQuery] string? query, 
            [FromQuery] int? categoryid,
            [FromQuery] string? brand,
            [FromQuery] string? flavour,
            [FromQuery] string? origin,
            [FromQuery] string? sku,
            [FromQuery] int? packtypeid,
            [FromQuery] int? cylindercompanyid,
            [FromQuery] int? printingcompanyid)
        {
            var count = await productRepository.GetCount(query, categoryid,brand,flavour,origin,sku, packtypeid, cylindercompanyid, printingcompanyid);

            return Ok(count);
        }

        // GET {apiBaseUrl}/api/suggestions? search = app
        [HttpGet]
        [Route("suggestions-brand")]
        //[Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsBrand([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsBrand(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("suggestions-flavourtype")]
        //[Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsFlavourType([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsFlavourType(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("suggestions-origin")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsOrigin([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsOrigin(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("suggestions-sku")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsSKU([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsSKU(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("suggestions-productcode")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsProductCode([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsProductCode(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("suggestions-version")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsVersion([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsVersion(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("is-version-unique")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetIsVersionUnique([FromQuery] string? query)
        {
            bool isUnique = true;

            if (string.IsNullOrWhiteSpace(query))
            {
                isUnique = true;
            }
            else
            {
                isUnique = await productRepository.GetIsVersionUnique(query);
            }

            return Ok(new { isUnique });
        }

        [HttpGet]
        [Route("suggestions-barcode")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetSuggestionsBarCode([FromQuery] string? query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(null);

            var results = await productRepository.GetSuggestionsBarCode(query);

            return Ok(results);
        }

        [HttpGet]
        [Route("is-barcode-unique")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<ActionResult> GetIsBarCodeUnique([FromQuery] string? query)
        {
            bool isUnique = true;

            if (string.IsNullOrWhiteSpace(query))
            {
                isUnique = true;
            }
            else
            {
                isUnique = await productRepository.GetIsBarCodeUnique(query);
            }

            return Ok(new { isUnique });
        }
    }
}

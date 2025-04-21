using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequestDto request)
        {
            // Map DTO to Domain Model
            var product = new Product
            {
                CategoryId = request.CategoryId,
                ProjectId = request.ProjectId,
                Brand = request.Brand,
                FlavourType = request.FlavourType,
                Origin = request.Origin,
                SKU = request.SKU,
                PackType = request.PackType,
                Version = request.Version,
                ProjectDate = request.ProjectDate,
                Barcode = request.Barcode,
                CylinderCompanyId = request.CylinderCompanyId,
                PrintingCompanyId = request.PrintingCompanyId,
                UserId = request.UserId,
            };

            await productRepository.CreateAsync(product);

            // Domain model to DTO
            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProjectId = product.ProjectId,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                PackType = product.PackType,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                CylinderCompanyId = product.CylinderCompanyId,
                PrintingCompanyId = product.PrintingCompanyId,
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
            [FromQuery] int? pageSize)
        {
            var products = await productRepository.GetAllAsync(query, pageNumber, pageSize);

            // Map Domain model to DTO
            var response = new List<ProductDto>();
            foreach (var product in products)
            {
                response.Add(new ProductDto
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
                    ProjectId = product.ProjectId,
                    Brand = product.Brand,
                    FlavourType = product.FlavourType,
                    Origin = product.Origin,
                    SKU = product.SKU,
                    PackType = product.PackType,
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
                        Id = product.Category?.Id ?? 0,
                        Name = product.Category?.Name,
                    },
                    Project = new ProjectDto
                    {
                        Id = product.Project?.Id ?? 0,
                        Name = product.Project?.Name
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
                    UserId = product.UserId,
                });
            }

            return Ok(response);
        }

        // GET: {apiBaseUrl}/api/product/{id}
        [HttpGet]
        [Route("{id:int}")]
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
                ProjectId = product.ProjectId,
                Brand = product.Brand,
                Barcode = product.Barcode,
                CylinderCompanyId = product.CylinderCompanyId,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                PackType = product.PackType,
                PrintingCompanyId = product.PrintingCompanyId,
                ProjectDate = product.ProjectDate,
                SKU = product.SKU,
                Version = product.Version,
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
                Project = new ProjectDto
                {
                    Id = product.Project?.Id ?? 0,
                    Name = product.Project?.Name
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
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/product/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> EditProduct([FromRoute] int id, UpdateProductRequestDto request)
        {
            // Convert DTO to Domain Model
            var product = new Product
            {
                Id = id,
                CategoryId = request.CategoryId,
                ProjectId = request.ProjectId,
                Brand= request.Brand,
                FlavourType = request.FlavourType,
                Origin = request.Origin,
                SKU = request.SKU,
                PackType = request.PackType,
                Version = request.Version,
                ProjectDate = request.ProjectDate,
                Barcode = request.Barcode,
                PrintingCompanyId = request.PrintingCompanyId,
                CylinderCompanyId = request.CylinderCompanyId,
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
                ProjectId = product.ProjectId,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                PackType = product.PackType,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                PrintingCompanyId = product.PrintingCompanyId,
                CylinderCompanyId = product.CylinderCompanyId,
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
                ProjectId = product.ProjectId,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                SKU = product.SKU,
                PackType = product.PackType,
                Version = product.Version,
                ProjectDate = product.ProjectDate,
                Barcode = product.Barcode,
                PrintingCompanyId = product.PrintingCompanyId,
                CylinderCompanyId = product.CylinderCompanyId,
                UserId = product.UserId,
            };

            return Ok(response);
        }

        // GET: {apiBaseUrl}/api/product/count
        [HttpGet]
        [Route("count")]
        //[Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetProductCount([FromQuery] string? query)
        {
            var count = await productRepository.GetCount(query);

            return Ok(count);
        }




    }
}

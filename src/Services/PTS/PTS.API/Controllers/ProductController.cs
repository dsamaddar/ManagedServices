using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductRepository productRepository;

        public ProductController(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
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
            };

            return Ok(response);
        }

        // GET: /api/product
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await productRepository.GetAllAsync();

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
                Attachments = product.Attachments.Select(x => new AttachmentDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    DateCreated = x.DateCreated,

                }).ToList()
            };

            return Ok(response);
        }

    }
}

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
    public class ProductVersionController : ControllerBase
    {
        private readonly IProductVersionRepository productVersionRepository;

        public ProductVersionController(IProductVersionRepository productVersionRepository)
        {
            this.productVersionRepository = productVersionRepository;
        }

        // https://localhost:xxxx/api/productversion
        [HttpPost]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> CreateProductVersion([FromBody] CreateProductVersionDto request)
        {
            // Map DTO to Domain Model
            var productVersion = new ProductVersion
            {
                Version = request.Version,
                VersionDate = request.VersionDate,
                Description = request.Description,
                ProductId = request.ProductId,
                UserId = request.UserId,
            };

            await productVersionRepository.CreateAsync(productVersion);

            // Domain model to DTO
            var response = new ProductVersionDto
            {
                Id = productVersion.Id,
                Version = productVersion.Version,
                VersionDate = productVersion.VersionDate,
                Description= productVersion.Description,
                ProductId = productVersion.ProductId,
                UserId= productVersion.UserId,
            };

            return Ok(response);
        }

        // DELETE: /api/productversion/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteProductVersion([FromRoute] int id)
        {
            var productVersion = await productVersionRepository.DeleteAsync(id);

            if (productVersion is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new ProductVersionDto
            {

                Id = productVersion.Id,
                Version = productVersion.Version,
                VersionDate = productVersion.VersionDate,
                Description = productVersion.Description,
                ProductId = productVersion.ProductId,
                UserId = productVersion.UserId,
            };

            return Ok(response);
        }

        //  GET: /api/productversion/showproductversiondetail/{id}
        [HttpGet("showproductversiondetail/{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> ShowProductVersionDetailById([FromRoute] int id)
        {
            var product = await productVersionRepository.GetShowProductVersionDetailById(id);

            if (product is null)
            {
                return NotFound();
            }

            // convert domain model to dto
            var response = new ProductDto
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                ProductCodeId = product.ProductCodeId,
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
                    Description = x.Description,
                    ProductId = x.ProductId,
                    UserId = x.UserId,


                    Attachments = x.Attachments?.Select(a => new AttachmentDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        DateCreated = a.DateCreated,
                        Tag = a.Tag,
                        UserId = a.UserId,
                    }).ToList(),
                }).Where(x => x.Id == id).ToList(),
                Category = new CategoryDto
                {
                    Id = product.Category?.Id ?? 0,
                    Name = product.Category?.Name,
                    Description = product.Category?.Description,
                    UserId = product.Category?.UserId,
                },
                ProductCode = new ProductCodeDto
                {
                    Id = product.ProductCode?.Id ?? 0,
                    Name = product.ProductCode?.Name,
                    Code = product.ProductCode?.Code,
                    Description = product.ProductCode?.Description,
                    UserId = product.ProductCode?.UserId,
                },
                CylinderCompany = new CylinderCompanyDto
                {
                    Id = product.CylinderCompany?.Id ?? 0,
                    Name = product.CylinderCompany?.Name,
                    Description = product.CylinderCompany?.Description,
                    UserId = product.CylinderCompany?.UserId,
                },
                PrintingCompany = new PrintingCompanyDto
                {
                    Id = product.PrintingCompany?.Id ?? 0,
                    Name = product.PrintingCompany?.Name,
                    Description = product.PrintingCompany?.Description,
                    UserId = product.PrintingCompany?.UserId,
                },
                UserId = product.UserId,
            };

            return Ok(response);
        }
    }
}

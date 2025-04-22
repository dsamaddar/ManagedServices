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
    }
}

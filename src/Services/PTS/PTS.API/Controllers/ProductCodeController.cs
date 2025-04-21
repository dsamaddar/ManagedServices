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
    public class ProductCodeController : ControllerBase
    {
        private readonly IProductCodeRepository productCodeRepository;

        public ProductCodeController(IProductCodeRepository productCodeRepository)
        {
            this.productCodeRepository = productCodeRepository;
        }

        // POST: api/projects

        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreateProjects([FromBody] CreateProductCodeRequestDto request)
        {
            // Map DTO to Domain Model
            var productCode = new ProductCode
            {
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            await productCodeRepository.CreateAsync(productCode);

            // Domain model to DTO
            var response = new ProductCodeDto
            {
                Id = productCode.Id,
                Name = productCode.Name,
                Description = productCode.Description,
                UserId = productCode.UserId,
            };

            return Ok(response);
        }

        // GET: /api/projects
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await productCodeRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<ProductCodeDto>();
            foreach (var project in projects)
            {
                response.Add(new ProductCodeDto
                {
                    Id = project.Id,
                    Name = project.Name,
                    Description = project.Description,
                    UserId = project.UserId,
                });
            }

            return Ok(response);
        }

        //  GET: /api/projects/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetProjectById([FromRoute] int id)
        {
            var existingProject = await productCodeRepository.GetById(id);

            if (existingProject is null)
            {
                return NotFound();
            }

            var response = new ProductCodeDto
            {
                Id = existingProject.Id,
                Name = existingProject.Name,
                Description = existingProject.Description,
                UserId = existingProject.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/projects/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditProject([FromRoute] int id, UpdateProductCodeRequestDto request)
        {
            // Convert DTO to Domain Model
            var productCode = new ProductCode
            {    
                Id = id,
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            productCode = await productCodeRepository.UpdateAsync(productCode);

            if (productCode == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new ProductCodeDto
            {
                Id = productCode.Id,
                Name = productCode.Name,
                Description = productCode.Description,
                UserId= productCode.UserId,
            };

            return Ok(response);
        }


        // DELETE: /api/projects/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteProject([FromRoute] int id)
        {
            var category = await productCodeRepository.DeleteAsync(id);

            if (category is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new ProductCodeDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                UserId = category.UserId,
            };

            return Ok(response);
        }
    }
}

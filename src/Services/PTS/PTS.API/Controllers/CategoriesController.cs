using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Interface;

namespace PTS.API.Controllers
{
    // https://localhost:xxxx/api/categories
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository categoryRepository;

        // Inject Repository Class

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }

        // https://localhost:xxxx/api/categories
        [HttpPost]
        [Authorize(Roles ="MANAGER,ADMIN")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequestDto request)
        {
            // Map DTO to Domain Model
            var category = new Category
            {
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId
            };

            await categoryRepository.CreateAsync(category);

            // Domain model to DTO
            var response = new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                UserId = request.UserId,
            };

            return Ok(response);
        }

        // GET: /api/categories
        [HttpGet]
        [Authorize(Roles ="READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await categoryRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<CategoryDto>();
            foreach (var category in categories) 
            {
                response.Add(new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    UserId = category.UserId,
                });
            }

            return Ok(response);
        }

        //  GET: /api/categories/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetCategoryById([FromRoute] int id)
        {
            var existingCategory = await categoryRepository.GetById(id);

            if (existingCategory is null)
            {
                return NotFound();
            }

            var response = new CategoryDto
            {
                Id = existingCategory.Id,
                Name = existingCategory.Name,
                Description = existingCategory.Description,
                UserId = existingCategory.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/categories/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditCategory([FromRoute] int id, UpdateCategoryRequestDto request)
        {
            // Convert DTO to Domain Model
            var category = new Category
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            category = await categoryRepository.UpdateAsync(category);

            if (category == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new CategoryDto { 
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                UserId = category.UserId,
            };

            return Ok(response);
        }


        // DELETE: /api/categories/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            var category = await categoryRepository.DeleteAsync(id);

            if(category is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new CategoryDto { 
            
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    UserId = category.UserId,
            };

            return Ok(response);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Interface;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackTypeController : ControllerBase
    {
        private readonly IPackTypeRepository packTypeRepository;

        // Inject Repository Class

        public PackTypeController(IPackTypeRepository packTypeRepository)
        {
            this.packTypeRepository = packTypeRepository;
        }

        // https://localhost:xxxx/api/packtype
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreatePackType([FromBody] CreatePackTypeRequestDto request)
        {
            // Map DTO to Domain Model
            var packType = new PackType
            {
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId
            };

            await packTypeRepository.CreateAsync(packType);

            // Domain model to DTO
            var response = new CategoryDto
            {
                Id = packType.Id,
                Name = packType.Name,
                Description = packType.Description,
                UserId = request.UserId,
            };

            return Ok(response);
        }

        // GET: /api/packtype
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllPackTypes()
        {
            var packTypes = await packTypeRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<PackTypeDto>();
            foreach (var packType in packTypes)
            {
                response.Add(new PackTypeDto
                {
                    Id = packType.Id,
                    Name = packType.Name,
                    Description = packType.Description,
                    UserId = packType.UserId,
                });
            }

            return Ok(response);
        }

        //  GET: /api/packtype/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetPackTypeById([FromRoute] int id)
        {
            var existingPackType = await packTypeRepository.GetByIdAsync(id);

            if (existingPackType is null)
            {
                return NotFound();
            }

            var response = new PackTypeDto
            {
                Id = existingPackType.Id,
                Name = existingPackType.Name,
                Description = existingPackType.Description,
                UserId = existingPackType.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/packtype/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditPackType([FromRoute] int id, UpdatePackTypeRequestDto request)
        {
            // Convert DTO to Domain Model
            var packType = new PackType
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            packType = await packTypeRepository.UpdateAsync(packType);

            if (packType == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new PackTypeDto
            {
                Id = packType.Id,
                Name = packType.Name,
                Description = packType.Description,
                UserId = packType.UserId,
            };

            return Ok(response);
        }


        // DELETE: /api/packtype/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeletePackType([FromRoute] int id)
        {
            var packType = await packTypeRepository.DeleteAsync(id);

            if (packType is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new PackTypeDto
            {

                Id = packType.Id,
                Name = packType.Name,
                Description = packType.Description,
                UserId = packType.UserId,
            };

            return Ok(response);
        }
    }
}

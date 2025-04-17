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
    public class CylinderCompanyController : ControllerBase
    {
        private readonly ICylinderCompanyRepository cylinderCompanyRepository;

        public CylinderCompanyController(ICylinderCompanyRepository cylinderCompanyRepository)
        {
            this.cylinderCompanyRepository = cylinderCompanyRepository;
        }

        // https://localhost:xxxx/api/categories
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreateCylinderCompany([FromBody] CreateCylinderCompanyRequestDto request)
        {
            var cylinderCompany = new CylinderCompany
            {
                Name = request.Name,
                Description = request.Description,
            };

            await cylinderCompanyRepository.CreateAsync(cylinderCompany);

            var response = new CylinderCompanyDto
            {
                Id = cylinderCompany.Id,
                Name = cylinderCompany.Name,
                Description = cylinderCompany.Description,
            };

            return Ok(response);

        }

        // GET: api/cylindercompany
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllCylinderCompanies()
        {
            var cylinderCompanies = await cylinderCompanyRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<CylinderCompanyDto>();

            foreach(var company in cylinderCompanies)
            {
                response.Add(new CylinderCompanyDto
                {
                    Id= company.Id,
                    Name = company.Name,
                    Description = company.Description,
                });
            }

            return Ok(response);
        }

        // GET: api/cylindercompany/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetCylinderCompanyById([FromRoute] int id)
        {
            var existingCylinderCompany = await cylinderCompanyRepository.GetById(id);

            if(existingCylinderCompany is null)
            {
                return NotFound();
            }

            var response = new CylinderCompanyDto { 
                Id = existingCylinderCompany.Id,
                Name=existingCylinderCompany.Name,
                Description = existingCylinderCompany.Description,
            };

            return Ok(response);
        }


        // PUT: /api/cylindercompany/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditCylinderCompany([FromRoute] int id, UpdateCylinderCompanyRequestDto request)
        {
            // Convert DTO to Domain Model
            var cylinderCompany = new CylinderCompany
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
            };

            cylinderCompany = await cylinderCompanyRepository.UpdateAsync(cylinderCompany);

            if (cylinderCompany == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new CylinderCompanyDto
            {
                Id = cylinderCompany.Id,
                Name = cylinderCompany.Name,
                Description = cylinderCompany.Description
            };

            return Ok(response);
        }

        // DELETE: /api/cylindercompany/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteCylinderCompany([FromRoute] int id)
        {
            var cylinderCompany = await cylinderCompanyRepository.DeleteAsync(id);

            if (cylinderCompany is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new CylinderCompanyDto
            {

                Id = cylinderCompany.Id,
                Name = cylinderCompany.Name,
                Description = cylinderCompany.Description,
            };

            return Ok(response);
        }
    }
}

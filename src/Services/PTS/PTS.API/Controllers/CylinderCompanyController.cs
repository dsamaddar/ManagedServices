using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
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
        public async Task<IActionResult> CreateCylinderCompany(CreateCylinderCompanyRequestDto request)
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


    }
}

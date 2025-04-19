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
    public class PrintingCompanyController : ControllerBase
    {
        private readonly IPrintingCompanyRepository printingCompanyRepository;

        public PrintingCompanyController(IPrintingCompanyRepository printingCompanyRepository)
        {
            this.printingCompanyRepository = printingCompanyRepository;
        }

        // POST: api/printingcompany
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreatePrintingCompany([FromBody] CreatePrintingCompanyRequestDto request)
        {
            // Map DTO to Domain Model
            var printingCompany = new PrintingCompany
            {
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            await printingCompanyRepository.CreateAsync(printingCompany);

            // Domain model to DTO
            var response = new PrintingCompanyDto
            {
                Id = printingCompany.Id,
                Name = printingCompany.Name,
                Description = printingCompany.Description,
                UserId = printingCompany.UserId,
            };

            return Ok(response);
        }

        // GET: /api/printingcompany
        [HttpGet]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAllPrintingCompany()
        {
            var printingCompanies = await printingCompanyRepository.GetAllAsync();

            // Map Domain model to DTO
            var response = new List<PrintingCompanyDto>();
            foreach (var company in printingCompanies)
            {
                response.Add(new PrintingCompanyDto
                {
                    Id = company.Id,
                    Name = company.Name,
                    Description = company.Description,
                    UserId = company.UserId,
                });
            }

            return Ok(response);
        }

        //  GET: /api/printingcompany/{id}
        [HttpGet]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetPrintintCompanyById([FromRoute] int id)
        {
            var existingPrintingCompany = await printingCompanyRepository.GetById(id);

            if (existingPrintingCompany is null)
            {
                return NotFound();
            }

            var response = new PrintingCompanyDto
            {
                Id = existingPrintingCompany.Id,
                Name = existingPrintingCompany.Name,
                Description = existingPrintingCompany.Description,
                UserId = existingPrintingCompany.UserId,
            };

            return Ok(response);
        }

        // PUT: /api/printingcompany/{id}
        [HttpPut]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> EditPrintingCompany([FromRoute] int id, UpdatePrintingCompanyRequestDto request)
        {
            // Convert DTO to Domain Model
            var printingCompany = new PrintingCompany
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
                UserId = request.UserId,
            };

            printingCompany = await printingCompanyRepository.UpdateAsync(printingCompany);

            if (printingCompany == null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO
            var response = new PrintingCompanyDto
            {
                Id = printingCompany.Id,
                Name = printingCompany.Name,
                Description = printingCompany.Description,
                UserId = printingCompany.UserId,
            };

            return Ok(response);
        }


        // DELETE: /api/printingcompany/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> DeletePrintingCompany([FromRoute] int id)
        {
            var printingCompany = await printingCompanyRepository.DeleteAsync(id);

            if (printingCompany is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new PrintingCompanyDto
            {
                Id = printingCompany.Id,
                Name = printingCompany.Name,
                Description = printingCompany.Description,
                UserId = printingCompany.UserId,
            };

            return Ok(response);
        }
    }
}

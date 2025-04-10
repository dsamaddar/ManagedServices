﻿using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> CreatePrintingCompany([FromBody] CreatePrintingCompanyRequestDto request)
        {
            // Map DTO to Domain Model
            var printingCompany = new PrintingCompany
            {
                Name = request.Name,
                Description = request.Description
            };

            await printingCompanyRepository.CreateAsync(printingCompany);

            // Domain model to DTO
            var response = new PrintingCompanyDto
            {
                Id = printingCompany.Id,
                Name = printingCompany.Name,
                Description = printingCompany.Description
            };

            return Ok(response);
        }

        // GET: /api/printingcompany
        [HttpGet]
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
                    Description = company.Description
                });
            }

            return Ok(response);
        }

        //  GET: /api/printingcompany/{id}
        [HttpGet]
        [Route("{id:int}")]
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
            };

            return Ok(response);
        }

        // PUT: /api/printingcompany/{id}
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> EditPrintingCompany([FromRoute] int id, UpdatePrintingCompanyRequestDto request)
        {
            // Convert DTO to Domain Model
            var printingCompany = new PrintingCompany
            {
                Id = id,
                Name = request.Name,
                Description = request.Description,
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
                Description = printingCompany.Description
            };

            return Ok(response);
        }


        // DELETE: /api/printingcompany/{id}

        [HttpDelete]
        [Route("{id:int}")]
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
            };

            return Ok(response);
        }
    }
}

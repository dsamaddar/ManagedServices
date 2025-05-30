﻿using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;
using System.Net.Mail;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVersionController : ControllerBase
    {
        private readonly IProductVersionRepository productVersionRepository;
        private readonly ApplicationDbContext dbContext;

        public ProductVersionController(IProductVersionRepository productVersionRepository, ApplicationDbContext dbContext)
        {
            this.productVersionRepository = productVersionRepository;
            this.dbContext = dbContext;
        }

        // https://localhost:xxxx/api/productversion
        [HttpPost]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public async Task<IActionResult> CreateProductVersion([FromBody] CreateProductVersionDto request)
        {
            // Map DTO to Domain Model
            var productVersion = new ProductVersion
            {
                Version = request.Version,
                VersionDate = request.VersionDate,
                Description = request.Description,
                CylinderPrNo = request.CylinderPrNo,
                CylinderPoNo = request.CylinderPoNo,
                PrintingPrNo = request.PrintingPrNo,
                PrintingPoNo = request.PrintingPoNo,
                ProductId = request.ProductId,
                CylinderCompanyId = request.CylinderCompanyId,
                PrintingCompanyId = request.PrintingCompanyId,
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
                CylinderPrNo = productVersion.CylinderPrNo,
                CylinderPoNo = productVersion.CylinderPoNo,
                PrintingPrNo = productVersion.PrintingPrNo,
                PrintingPoNo = productVersion.PrintingPoNo,
                ProductId = productVersion.ProductId,
                CylinderCompanyId= productVersion.CylinderCompanyId,
                PrintingCompanyId= productVersion.PrintingCompanyId,
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
                CylinderCompanyId = productVersion.CylinderCompanyId,
                PrintingCompanyId = productVersion.PrintingCompanyId,
                UserId = productVersion.UserId,
            };

            return Ok(response);
        }

        [HttpGet("showprodversionbyprodid/{productId:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> ShowProdVersionbyprodId([FromRoute] int productId)
        {
            var productVersions = await productVersionRepository.GetProductVersionsByProductId(productId);

            if(productVersions is null)
            {
                return NotFound();
            }


            // Map Domain model to DTO
            var response = new List<ProductVersionDto>();
            foreach (var productVersion in productVersions)
            {
                response.Add(new ProductVersionDto
                {
                    Id = productVersion.Id,
                    Version = productVersion.Version,
                    VersionDate = productVersion.VersionDate,
                    Description = productVersion.Description,
                    CylinderPrNo = productVersion.CylinderPrNo,
                    CylinderPoNo = productVersion.CylinderPoNo,
                    PrintingPrNo = productVersion.PrintingPrNo,
                    PrintingPoNo = productVersion.PrintingPoNo,
                    ProductId = productVersion.ProductId,
                    CylinderCompanyId = productVersion.CylinderCompanyId,
                    PrintingCompanyId = productVersion.PrintingCompanyId,
                    UserId = productVersion.UserId,
                    CylinderCompany = new CylinderCompanyDto
                    {
                        Id = productVersion.CylinderCompany?.Id ?? 0,
                        Name = productVersion.CylinderCompany?.Name
                    },
                    PrintingCompany = new PrintingCompanyDto
                    {
                        Id = productVersion.PrintingCompany?.Id ?? 0,
                        Name = productVersion.PrintingCompany?.Name
                    },
                    Attachments = productVersion.Attachments?.Select(a => new AttachmentDto
                    {
                        Id = a.Id,
                        Name = a.Name,
                        Description = a.Description,
                        DateCreated = a.DateCreated,
                        Tag = a.Tag,
                        UserId = a.UserId,
                    }).ToList(),
                });
            }

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
                ProductCode = product.ProductCode,
                Brand = product.Brand,
                FlavourType = product.FlavourType,
                Origin = product.Origin,
                ProjectDate = product.ProjectDate,
                SKU = product.SKU,
                Version = product.Version,
                BarCodes = product.BarCodes?.Select(x => new BarCodesDto
                {
                    Id = x.Id,
                    BarCode = x.BarCode,

                }).ToList(),
                ProductVersions = product.ProductVersions?.Select(x => new ProductVersionDto
                {
                    Id = x.Id,
                    Version = x.Version,
                    VersionDate = x.VersionDate,
                    Description = x.Description,
                    ProductId = x.ProductId,
                    CylinderCompanyId= x.CylinderCompanyId,
                    PrintingCompanyId= x.PrintingCompanyId,
                    CylinderPrNo = x.CylinderPrNo,
                    CylinderPoNo = x.CylinderPoNo,
                    PrintingPrNo = x.PrintingPrNo,
                    PrintingPoNo = x.PrintingPoNo,
                    UserId = x.UserId,
                    CylinderCompany = new CylinderCompanyDto
                    {
                        Id = x.CylinderCompany?.Id ?? 0,
                        Name = x.CylinderCompany?.Name
                    },
                    PrintingCompany = new PrintingCompanyDto
                    {
                        Id = x.PrintingCompany?.Id ?? 0,
                        Name = x.PrintingCompany?.Name
                    },
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
                PackType = new PackTypeDto
                {
                    Id = product.PackType?.Id ?? 0,
                    Name = product.PackType?.Name,
                    Description = product.PackType?.Description,
                    UserId = product.PackType?.UserId,
                },
                UserId = product.UserId,
            };

            return Ok(response);
        }

        [HttpPut("update-productversion-mini/{id}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public IActionResult UpdateProductVersion(int id, [FromBody] UpdateProductVersionMiniDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is null.");
            }

            try
            {
                var productVersion = dbContext.ProductVersions.Find(id);

                if (productVersion == null)
                {
                    return NotFound($"ProductVersion with ID {id} not found.");
                }

                // Update fields
                productVersion.Version = dto.Version;
                productVersion.VersionDate = dto.VersionDate;
                productVersion.Description = dto.Description;
                productVersion.CylinderPrNo = dto.CylinderPrNo;
                productVersion.CylinderPoNo = dto.CylinderPoNo;
                productVersion.PrintingPrNo = dto.PrintingPrNo;
                productVersion.PrintingPoNo = dto.PrintingPoNo;
                productVersion.CylinderCompanyId = dto.CylinderCompanyId;
                productVersion.PrintingCompanyId = dto.PrintingCompanyId;

                dbContext.SaveChanges();

                return Ok(productVersion);
            }
            catch (DbUpdateException dbEx)
            {
                // Log the exception (use a logger in real code)
                return StatusCode(500, $"Database update error: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                // Log the exception (use a logger in real code)
                return StatusCode(500, $"An unexpected error occurred: {ex.Message}");
            }
        }

        [HttpPut("updateproductversion/{id}")]
        [Authorize(Roles = "MANAGER,ADMIN")]
        public IActionResult UpdateProductVersion(int id, [FromBody] UpdateProductVersionDto dto)
        {
            var productVersion = dbContext.ProductVersions.Find(id);

            if (productVersion == null) return NotFound();

            productVersion.CylinderPrNo = dto.CylinderPrNo;
            productVersion.CylinderPoNo = dto.CylinderPoNo;
            productVersion.PrintingPrNo = dto.PrintingPrNo;
            productVersion.PrintingPoNo = dto.PrintingPoNo;

            dbContext.SaveChanges();

            return Ok(productVersion);
        }
    }
}

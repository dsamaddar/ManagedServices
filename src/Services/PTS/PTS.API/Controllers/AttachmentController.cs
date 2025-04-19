using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Implementation;
using PTS.API.Repositories.Interface;
using System.Diagnostics.CodeAnalysis;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentRepository attachmentRepository;
        private readonly IProductRepository productRepository;

        public AttachmentController(IAttachmentRepository attachmentRepository, IProductRepository productRepository)
        {
            this.attachmentRepository = attachmentRepository;
            this.productRepository = productRepository;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(1073741824)] // 1 GB
        public async Task<IActionResult> Upload([FromForm] List<IFormFile> files, [FromForm] string productid)
        {
            var product_id = Convert.ToInt32(productid);
            var product = await productRepository.GetByIdAsync(product_id);

            foreach (var file in files)
            {
                string sanitizedFileName = file.FileName.Replace(" ", "_").Replace("'", "_");
                var fileUploadName = $"{DateTime.Now.Ticks.ToString()}.{sanitizedFileName}";
                var filePath = Path.Combine("attachments", fileUploadName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var attachment = new Attachment
                {
                    ProductId = product_id,
                    DateCreated = DateTime.Now,
                    Name = fileUploadName,
                    Description = fileUploadName,
                    Tag = fileUploadName,
                    UserId = product?.UserId?? string.Empty,
                };

                await attachmentRepository.CreateAsync(attachment);
            }

            return Ok(new { Message = "Files uploaded successfully" });
        }

        // DELETE: /api/categories/{id}

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> DeleteAttachment([FromRoute] int id)
        {
            var attachment = await attachmentRepository.DeleteAsync(id);

            if (attachment is null)
            {
                return NotFound();
            }

            // Convert Domain Model to DTO

            var response = new AttachmentDto
            {

                Id = attachment.Id,
                Name = attachment.Name,
                Description = attachment.Description,
                Tag = attachment.Tag,
            };

            return Ok(response);
        }

        //  GET: /api/categories/{id}
        [HttpGet]
        [Route("{productId:int}")]
        //[Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> GetAttachmentsByProductId([FromRoute] int productId)
        {
            var attachments = await attachmentRepository.GetAllByProductIdAsync(productId);

            // Map Domain model to DTO
            var response = new List<AttachmentDto>();
            foreach (var attachment in attachments)
            {
                response.Add(new AttachmentDto
                {
                    Id = attachment.Id,
                    Name = attachment.Name,
                    Description = attachment.Description,
                    Tag = attachment.Tag,
                });
            }

            return Ok(response);
        }


    }
}

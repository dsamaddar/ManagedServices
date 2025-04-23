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
        private readonly IProductVersionRepository productVersionRepository;

        public AttachmentController(IAttachmentRepository attachmentRepository,IProductVersionRepository productVersionRepository)
        {
            this.attachmentRepository = attachmentRepository;
            this.productVersionRepository = productVersionRepository;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(1073741824)] // 1 GB
        [Authorize(Roles = "READER,MANAGER,ADMIN")]
        public async Task<IActionResult> Upload([FromForm] List<IFormFile> files, [FromForm] string productVersionId)
        {
            var productVersion_Id = Convert.ToInt32(productVersionId);
            var productVersion = await productVersionRepository.GetByIdAsync(productVersion_Id);

            foreach (var file in files)
            {
                string sanitizedFileName = file.FileName.Replace(" ", "_").Replace("'", "_");
                var fileUploadName = $"{DateTime.Now.ToString("yyyyMMddHHmmssfff")}.{sanitizedFileName}";
                var filePath = Path.Combine("attachments", fileUploadName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var attachment = new Attachment
                {
                    ProductVersionId = productVersion_Id,
                    TrackingId = productVersion_Id,
                    DateCreated = DateTime.Now,
                    Name = fileUploadName,
                    Description = fileUploadName,
                    Tag = fileUploadName,
                    UserId = productVersion?.UserId ?? string.Empty,
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

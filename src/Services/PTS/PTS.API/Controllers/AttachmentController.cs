using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PTS.API.Models.Domain;
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

        public AttachmentController(IAttachmentRepository attachmentRepository)
        {
            this.attachmentRepository = attachmentRepository;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(1073741824)] // 1 GB
        public async Task<IActionResult> Upload([FromForm] List<IFormFile> files, [FromForm] string productid)
        {
            var product_id = Convert.ToInt32(productid);

            foreach (var file in files)
            {
                var fileUploadName = $"{DateTime.Now.Ticks.ToString()}. {file.FileName}";
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
                };

                await attachmentRepository.CreateAsync(attachment);
            }

            return Ok(new { Message = "Files uploaded successfully" });
        }


    }
}

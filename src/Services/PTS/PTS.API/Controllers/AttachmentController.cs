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

        // POST: {apibaseurl}/api/attachments
        //[HttpPost]
        //public async Task<IActionResult> UploadAttachment([FromForm] IFormFile file, [FromForm] string fileName, [FromForm] string title, [FromForm] int productid)
        //{
        //    ValidateFileUpload(file);

        //    if (ModelState.IsValid)
        //    {
        //        // file upload
        //        var attachment = new Attachment
        //        {
        //            Name = fileName,
        //            Description = "",
        //            ProductId = productid,
        //            DateCreated = DateTime.Now, 

        //        };
        //    }

        //    return null;
        //}

        //[ApiExplorerSettings(IgnoreApi = true)]
        //private void ValidateFileUpload(IFormFile file)
        //{
        //    var allowedExtensions = new string[] { ".jpg", ".jpeg", ".png", ".pdf" };

        //    if (allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
        //    {
        //        ModelState.AddModelError("file", "Unsupported file format.");
        //    }

        //    // 10MB
        //    if(file.Length > 10485760)
        //    {
        //        ModelState.AddModelError("file", "File size cannot be more than 10MB");
        //    }

        //}
    }
}

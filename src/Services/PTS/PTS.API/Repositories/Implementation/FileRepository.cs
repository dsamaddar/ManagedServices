using PTS.API.Models.Domain;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class FileRepository : IFileRepository
    {
        private readonly IWebHostEnvironment webHostEnvironment;

        public FileRepository(IWebHostEnvironment webHostEnvironment)
        {
            this.webHostEnvironment = webHostEnvironment;
        }
        public async Task<Attachment> UploadFile(IFormFile file, Attachment attachment)
        {
            // 1 - Upload files to api/attachments
            var localPath = Path.Combine(webHostEnvironment.ContentRootPath, "attachments", $"{attachment.Name}{file.Name}");
            using var stream = new FileStream(localPath, FileMode.Create);
            await file.CopyToAsync(stream);

            // 2 - update the database

            return attachment;

        }

        
    }
}

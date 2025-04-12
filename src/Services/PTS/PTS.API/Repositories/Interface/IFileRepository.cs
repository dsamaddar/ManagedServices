using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IFileRepository
    {
        Task<Attachment> UploadFile(IFormFile file, Attachment attachment);
    }
}

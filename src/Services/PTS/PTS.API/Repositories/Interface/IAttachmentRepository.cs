using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IAttachmentRepository
    {

        Task<Attachment> CreateAsync(Attachment attachment);
        Task<IEnumerable<Attachment>> GetAllAsync();
    }
}

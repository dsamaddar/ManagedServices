using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IAttachmentRepository
    {
        Task<Attachment> CreateAsync(Attachment attachment);
        Task<IEnumerable<Attachment>> GetAllAsync();

        Task<IEnumerable<Attachment>> GetAllByProductIdAsync(int productId);

        Task<Attachment?> GetById(int id);
        Task<Attachment?> UpdateAsync(Attachment attachment);
        Task<Attachment?> DeleteAsync(int id);
        Task DeleteByProductIdAsync(int productId);
    }
}

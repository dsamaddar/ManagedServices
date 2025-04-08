using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;
using System.Collections.Immutable;

namespace PTS.API.Repositories.Implementation
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly ApplicationDbContext dbContext;

        public AttachmentRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Attachment> CreateAsync(Attachment attachment)
        {
            try
            {
                await dbContext.Attachments.AddAsync(attachment);
                await dbContext.SaveChangesAsync();
                return attachment;
            }
            catch (DbUpdateException dbEx)
            {
                // Handle specific EF Core exceptions like unique constraint violation
                throw new RepositoryException("Database update failed. Possibly a duplicate entry.", dbEx);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("An unexpected error occurred while adding the user.", ex);
            }
        }

        public Task<Attachment?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Attachment>> GetAllAsync()
        {
            return await dbContext.Attachments.ToListAsync();
        }

        public Task<Attachment?> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Attachment?> UpdateAsync(Attachment attachment)
        {
            throw new NotImplementedException();
        }
    }
}

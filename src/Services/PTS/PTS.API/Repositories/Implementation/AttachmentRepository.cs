﻿using Microsoft.AspNetCore.Http.HttpResults;
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

        public async Task<Attachment?> DeleteAsync(int id)
        {
            var existingAttachment = await dbContext.Attachments.FirstOrDefaultAsync(x => x.Id == id);

            if(existingAttachment == null)
            {
                return null;
            }

            dbContext.Attachments.Remove(existingAttachment);
            await dbContext.SaveChangesAsync();

            return existingAttachment;
        }

        public async Task DeleteByProductIdAsync(int productId)
        {
            var product = await dbContext.Products
                                .Include(p => p.ProductVersions)
                                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product != null && product.ProductVersions.Any())
            {
                foreach (var version in product.ProductVersions)
                {
                    if (version.Attachments != null && version.Attachments.Any())
                    {
                        dbContext.Attachments.RemoveRange(version.Attachments);
                    }
                }

                dbContext.ProductVersions.RemoveRange(product.ProductVersions);
                await dbContext.SaveChangesAsync();
            }

        }

        public async Task<IEnumerable<Attachment>> GetAllAsync()
        {
            return await dbContext.Attachments.ToListAsync();
        }

        public async Task<IEnumerable<Attachment>> GetAllByProductIdAsync(int productVersionId)
        {
            return await dbContext.Attachments.Where(x => x.ProductVersionId == productVersionId)
                           .ToListAsync(); // Returns a list of attachments
        }

        public async Task<IEnumerable<Attachment>> GetAllByProductVersionIdAsync(int productVersionId)
        {
            return await dbContext.Attachments.Where(x => x.ProductVersionId == productVersionId)
                           .ToListAsync(); // Returns a list of attachments
        }

        public async Task<Attachment?> GetById(int id)
        {
            return await dbContext.Attachments.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Attachment?> UpdateAsync(Attachment attachment)
        {
            var existingAttachment = await dbContext.Attachments.FirstOrDefaultAsync(x => x.Id == attachment.Id);

            if (existingAttachment != null)
            {
                dbContext.Attachments.Entry(existingAttachment).CurrentValues.SetValues(attachment);
                await dbContext.SaveChangesAsync();

                return attachment;
            }

            return null;
        }
    }
}

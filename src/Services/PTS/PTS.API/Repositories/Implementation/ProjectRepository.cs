using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext dbContext;

        public ProjectRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<Project> CreateAsync(Project project)
        {
            try
            {
                await dbContext.Projects.AddAsync(project);
                await dbContext.SaveChangesAsync();
                return project;
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

        public Task<Project?> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            return await dbContext.Projects.ToListAsync();
        }

        public Task<Project?> GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Project?> UpdateAsync(Project project)
        {
            throw new NotImplementedException();
        }
    }
}

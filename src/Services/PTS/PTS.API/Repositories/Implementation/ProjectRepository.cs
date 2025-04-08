using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
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

        public async Task<Project?> DeleteAsync(int id)
        {
            var existingProject = await dbContext.Projects.FirstOrDefaultAsync(x => x.Id == id);

            if (existingProject == null)
            {
                return null;
            }

            dbContext.Projects.Remove(existingProject);
            await dbContext.SaveChangesAsync();

            return existingProject;
        }

        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            return await dbContext.Projects.ToListAsync();
        }

        public async Task<Project?> GetById(int id)
        {
            return await dbContext.Projects.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Project?> UpdateAsync(Project project)
        {
            var existingProject = await dbContext.Projects.FirstOrDefaultAsync(x => x.Id == project.Id);

            if (existingProject != null)
            {
                dbContext.Projects.Entry(existingProject).CurrentValues.SetValues(project);
                await dbContext.SaveChangesAsync();

                return project;
            }

            return null;
        }
    }
}

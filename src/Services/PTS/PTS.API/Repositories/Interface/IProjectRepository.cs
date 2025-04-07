using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IProjectRepository
    {
        Task<Project> CreateAsync(Project project); 
        Task<IEnumerable<Project>> GetAllAsync();
    }
}

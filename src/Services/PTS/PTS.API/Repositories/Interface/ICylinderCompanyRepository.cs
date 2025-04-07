using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface ICylinderCompanyRepository
    {
        Task<CylinderCompany> CreateAsync(CylinderCompany company);
        Task<IEnumerable<CylinderCompany>> GetAllAsync();
    }
}

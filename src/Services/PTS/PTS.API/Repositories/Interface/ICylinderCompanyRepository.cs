using Microsoft.EntityFrameworkCore;
using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface ICylinderCompanyRepository
    {
        Task<CylinderCompany> CreateAsync(CylinderCompany company);
        Task<IEnumerable<CylinderCompany>> GetAllAsync();

        Task<CylinderCompany?> GetById(int id);

        Task<CylinderCompany?>UpdateAsync(CylinderCompany cylinderCompany);
        Task<CylinderCompany?> DeleteAsync(int id);
    }
}

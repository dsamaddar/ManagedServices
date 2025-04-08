using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class CylinderCompanyRepository : ICylinderCompanyRepository
    {
        private readonly ApplicationDbContext dbContext;

        public CylinderCompanyRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public async Task<CylinderCompany> CreateAsync(CylinderCompany company)
        {
            try
            {
                await dbContext.CylinderCompanies.AddAsync(company);
                await dbContext.SaveChangesAsync();

                return company;
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

        public async Task<CylinderCompany?> DeleteAsync(int id)
        {
            var existingCylinderCompany = await dbContext.CylinderCompanies.FirstOrDefaultAsync(x => x.Id == id);

            if (existingCylinderCompany == null)
            {
                return null;
            }

            dbContext.CylinderCompanies.Remove(existingCylinderCompany);
            await dbContext.SaveChangesAsync();

            return existingCylinderCompany;
        }

        public async Task<IEnumerable<CylinderCompany>> GetAllAsync()
        {
            return await dbContext.CylinderCompanies.ToListAsync();
        }

        public async Task<CylinderCompany?> GetById(int id)
        {
            return await dbContext.CylinderCompanies.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<CylinderCompany?> UpdateAsync(CylinderCompany cylinderCompany)
        {
            var existingCylinderCompany = await dbContext.CylinderCompanies.FirstOrDefaultAsync(x => x.Id == cylinderCompany.Id);

            if(existingCylinderCompany != null)
            {
                dbContext.Entry(existingCylinderCompany).CurrentValues.SetValues(cylinderCompany);
                await dbContext.SaveChangesAsync();

                return cylinderCompany;
            }

            return null;

        }
    }
}

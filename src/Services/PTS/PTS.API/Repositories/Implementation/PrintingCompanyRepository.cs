using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure.Internal;
using PTS.API.Data;
using PTS.API.Models.Domain;
using PTS.API.Repositories.Exceptions;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class PrintingCompanyRepository : IPrintingCompanyRepository
    {
        private readonly ApplicationDbContext dbContext;

        public PrintingCompanyRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<PrintingCompany> CreateAsync(PrintingCompany company)
        {
            try
            {
                await dbContext.PrintingCompanies.AddAsync(company);
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

        public async Task<IEnumerable<PrintingCompany>> GetAllAsync()
        {
            return await dbContext.PrintingCompanies.ToListAsync();
        }
    }
}

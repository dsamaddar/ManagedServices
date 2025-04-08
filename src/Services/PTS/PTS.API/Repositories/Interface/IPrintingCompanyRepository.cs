using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IPrintingCompanyRepository
    {
        Task<PrintingCompany> CreateAsync(PrintingCompany company);
        Task<IEnumerable<PrintingCompany>> GetAllAsync();

        Task<PrintingCompany?> GetById(int id);
        Task<PrintingCompany?> UpdateAsync(PrintingCompany printingCompany);
        Task<PrintingCompany?> DeleteAsync(int id);
    }
}

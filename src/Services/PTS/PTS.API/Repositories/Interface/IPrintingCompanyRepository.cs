using PTS.API.Models.Domain;

namespace PTS.API.Repositories.Interface
{
    public interface IPrintingCompanyRepository
    {
        Task<PrintingCompany> CreateAsync(PrintingCompany company);
        Task<IEnumerable<PrintingCompany>> GetAllAsync();
    }
}

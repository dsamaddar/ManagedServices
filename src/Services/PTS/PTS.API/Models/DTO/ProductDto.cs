using PTS.API.Models.Domain;
using System.Net.Mail;
using System.Linq;

namespace PTS.API.Models.DTO
{
    public class ProductDto
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        
        public string? Brand { get; set; }
        public string? FlavourType { get; set; }

        public string? Origin { get; set; }

        public string? SKU { get; set; }
        public string? ProductCode { get; set; }
        public string? Version { get; set; }
        public DateTime ProjectDate { get; set; }
        public string? Barcode { get; set; }
        public int? CylinderCompanyId { get; set; }
        
        public int? PrintingCompanyId { get; set; }
        public string? UserId { get; set; }
        

        public int? PackTypeId { get; set; }

        // Navigation property (one-to-many)
        public CategoryDto? Category { get; set; }
        public PrintingCompanyDto? PrintingCompany { get; set; }
        public CylinderCompanyDto? CylinderCompany { get; set; }
        public PackTypeDto? PackType { get; set; }  

        // Navigation property (many-to-one)
        public ICollection<ProductVersionDto>? ProductVersions { get; set; } = new List<ProductVersionDto>();

    }
}

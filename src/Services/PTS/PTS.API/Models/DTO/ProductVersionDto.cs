using PTS.API.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.DTO
{
    public class ProductVersionDto
    {
        public int Id { get; set; }

        public string? Version { get; set; }

        public DateTime VersionDate { get; set; }

        public string? Description { get; set; }
        public string? PrNo { get; set; }
        public string? PoNo { get; set; }
        public int ProductId { get; set; }
        public int? CylinderCompanyId { get; set; }
        public int? PrintingCompanyId { get; set; }
        public string? UserId { get; set; }

        // Navigation property (many-to-one)
        public ProductDto? Product { get; set; }
        public CylinderCompanyDto? CylinderCompany { get; set; }
        public PrintingCompanyDto? PrintingCompany { get; set; }

        // Navigation property (one-to-many)
        public ICollection<AttachmentDto>? Attachments { get; set; } = new List<AttachmentDto>();
    }
}

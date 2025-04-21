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
       public int ProductId { get; set; }

        // Navigation property (many-to-one)
        public ProductDto? Product { get; set; }

        // Navigation property (one-to-many)
        public List<AttachmentDto>? Attachments { get; set; } = new List<AttachmentDto>();
    }
}

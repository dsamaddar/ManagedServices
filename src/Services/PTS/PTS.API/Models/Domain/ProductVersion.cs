using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class ProductVersion
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Column(Order = 1)]
        public string? Version { get; set; }
        
        [Column(Order = 2)]
        public DateTime VersionDate { get; set; }

        [Column(Order = 3)]
        public string? Description { get; set; }

        [ForeignKey("Product")]
        [Column(Order = 4)]
        public int ProductId { get; set; }

        [ForeignKey("CylinderCompany")]
        [Column(Order = 5)]
        public int? CylinderCompanyId { get; set; }

        [Column(Order = 6)]
        [ForeignKey("PrintingCompany")]
        public int? PrintingCompanyId { get; set; }

        [Column(Order = 7)]
        public string? UserId { get; set; }

        // Navigation property (many-to-one)
        public Product? Product { get; set; }
        public CylinderCompany? CylinderCompany { get; set; }  // Navigation property
        public PrintingCompany? PrintingCompany { get; set; } // Navigation property

        // Navigation property (one-to-many)
        public ICollection<Attachment>? Attachments { get; set; } = new List<Attachment>();
    }
}

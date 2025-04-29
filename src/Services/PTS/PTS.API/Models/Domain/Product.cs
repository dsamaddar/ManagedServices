using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PTS.API.Models.DTO;

namespace PTS.API.Models.Domain
{
    public class Product
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [ForeignKey("Category")]
        [Column(Order = 1)]
        public int? CategoryId { get; set; }

        [Column(Order = 2)]
        [MaxLength(100)]
        public string? Brand { get; set; }

        [Column(Order = 3)]
        [MaxLength(100)]
        public string? FlavourType { get; set; }

        [Column(Order = 4)]
        [MaxLength(100)]
        public string? Origin { get; set; }

        [Column(Order = 5)]
        [MaxLength(100)]
        public string? SKU { get; set; }

        [Column(Order = 6)]
        [MaxLength(100)]
        public string? ProductCode { get; set; }

        [Column(Order = 7)]
        [MaxLength(100)]
        public string? Version { get; set; }

        [Column(Order = 8)]
        public DateTime ProjectDate { get; set; }

        [Column(Order = 9)]
        [MaxLength(50)]
        public string? Barcode { get; set; }

        [ForeignKey("CylinderCompany")]
        [Column(Order = 10)]
        public int? CylinderCompanyId { get; set; }

        [Column(Order = 11)]
        [ForeignKey("PrintingCompany")]
        public int? PrintingCompanyId { get; set; }

        [Column(Order = 12)]
        [ForeignKey("PackType")]
        public int? PackTypeId { get; set; }

        public string? UserId { get; set; }

        // Navigation property (many-to-one)
        public CylinderCompany? CylinderCompany { get; set; }  // Navigation property
        public PrintingCompany? PrintingCompany { get; set; } // Navigation property
        public Category? Category { get; set; } // Navigation property
        
        public PackType? PackType { get; set; } // Navigation property

        // Navigation property (one-to-many)
        public List<ProductVersion> ProductVersions { get; set; } = new List<ProductVersion>();

    }
}

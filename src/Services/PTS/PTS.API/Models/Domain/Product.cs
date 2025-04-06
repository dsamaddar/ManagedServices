using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class Product
    {
        public int Id { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public string Brand { get; set; }
        public string FlavourType { get; set; }
        public string Origin { get; set; }
        public string SKU { get; set; }
        public string PackType { get; set; }

        [Required]
        [MaxLength(100)]
        [Column(Order = 1)]
        [ForeignKey("Project")]
        public string ProjectId { get; set; }
        public string Version { get; set; }
        public DateTime ProjectDate { get; set; }
        public string Barcode { get; set; }

        [ForeignKey("Company")]
        public int CylinderCompanyId { get; set; }

        [ForeignKey("Company")]
        public int PrintingCompanyId { get; set; }
    }
}

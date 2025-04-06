using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class Product
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [ForeignKey("Category")]
        [Column(Order = 1)]
        public int CategoryId { get; set; }

        [Column(Order = 2)]
        public string Brand { get; set; }

        [Column(Order = 3)]
        public string FlavourType { get; set; }

        [Column(Order = 4)]
        public string Origin { get; set; }

        [Column(Order = 5)]
        public string SKU { get; set; }

        [Column(Order = 6)]
        public string PackType { get; set; }

        [Required]
        [MaxLength(100)]
        [Column(Order = 7)]
        [ForeignKey("Project")]
        public string ProjectId { get; set; }

        [Column(Order = 8)]
        public string Version { get; set; }

        [Column(Order = 9)]
        public DateTime ProjectDate { get; set; }

        [Column(Order = 10)]
        public string Barcode { get; set; }

        [ForeignKey("Company")]
        [Column(Order = 11)]
        public int CylinderCompanyId { get; set; }

        [Column(Order = 12)]
        [ForeignKey("Company")]
        public int PrintingCompanyId { get; set; }

        public ICollection<Images> Images { get; set; } = new List<Images>();
    }
}

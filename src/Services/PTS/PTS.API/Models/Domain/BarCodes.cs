using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class BarCodes
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Column(Order = 1)]
        public string? BarCode { get; set; }

        [ForeignKey("Product")]
        [Column(Order = 2)]
        public int ProductId { get; set; }

        // Navigation property (many-to-one)
        public Product? Product { get; set; }
    }
}

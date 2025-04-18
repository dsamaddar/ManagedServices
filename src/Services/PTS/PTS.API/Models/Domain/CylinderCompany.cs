using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class CylinderCompany
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column(Order = 1)]
        public string? Name { get; set; }

        [MaxLength(500)]
        [Column(Order = 2)]
        public string? Description { get; set; }

        [Column(Order = 3)]
        public string UserId { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}

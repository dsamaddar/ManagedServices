using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Emit;

namespace PTS.API.Models.Domain
{
    public class Project
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Column(Order = 1)]
        [MaxLength(100)]
        public string? Name { get; set; }

        [Column(Order = 2)]
        [MaxLength(50)]
        public string? Code { get; set; }

        [Column(Order = 3)]
        [MaxLength(500)]
        public string? Description { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}

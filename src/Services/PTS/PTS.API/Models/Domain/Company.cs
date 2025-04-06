using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PTS.API.Models.Domain
{
    public class Company
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column(Order = 1)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        [Column(Order = 2)]
        public string CompanyType { get; set; }

        [MaxLength(500)]
        [Column(Order = 3)]
        public string Description { get; set; }

    }
}

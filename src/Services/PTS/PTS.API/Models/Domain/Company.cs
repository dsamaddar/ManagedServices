using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class Company
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string CompanyType { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

    }
}

using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class Images
    {
        public int id { get; set; }

        [MaxLength(50)]
        public string code { get; set; }

        [MaxLength(50)]
        public string version { get; set; }

        [Required]        
        public int product_id { get; set; }
    }
}

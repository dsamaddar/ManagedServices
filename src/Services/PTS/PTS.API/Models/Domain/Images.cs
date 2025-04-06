using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PTS.API.Models.Domain
{
    public class Images
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [MaxLength(50)]
        [Column(Order = 1)]
        public string Code { get; set; }

        [MaxLength(50)]
        [Column(Order = 2)]
        public string Version { get; set; }

        [Column(Order = 3)]
        [ForeignKey("Product")]
        public int ProductId { get; set; }
    }
}

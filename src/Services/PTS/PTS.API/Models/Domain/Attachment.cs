using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class Attachment
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [MaxLength(100)]
        [Column(Order = 1)]
        public string? Name { get; set; }

        [MaxLength(500)]
        [Column(Order = 2)]
        public string? Description { get; set; }

        [MaxLength(500)]
        [Column(Order = 3)]
        public string? Tag { get; set; }

        [ForeignKey("Product")]
        [Column(Order = 4)]
        public int ProductId { get; set; }
    }
}

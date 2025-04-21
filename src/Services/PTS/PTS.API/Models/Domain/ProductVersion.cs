using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.Domain
{
    public class ProductVersion
    {
        [Key]
        [Column(Order = 0)]
        public int Id { get; set; }

        [Column(Order = 1)]
        public string? Version { get; set; }
        
        [Column(Order = 2)]
        public DateTime VersionDate { get; set; }

        [ForeignKey("Product")]
        [Column(Order = 3)]
        public int ProductId { get; set; }

        public ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    }
}

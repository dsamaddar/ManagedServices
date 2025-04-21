using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;

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

        [Column(Order = 4)]
        public DateTime DateCreated { get; set; } = DateTime.Now;

        [Column(Order = 5)]
        public int TrackingId { get; set; } = 0;

        [ForeignKey("ProductVersion")]
        [Column(Order = 6)]
        public int? ProductVersionId { get; set; }

        [Column(Order = 7)]
        public string? UserId { get; set; }

        // Navigation property (many-to-one)
        public ProductVersion? ProductVersion { get; set; }
    }
}

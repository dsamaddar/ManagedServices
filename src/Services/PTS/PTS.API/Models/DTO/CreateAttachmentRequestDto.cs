using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.DTO
{
    public class CreateAttachmentRequestDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Tag { get; set; }

        public DateTime DateCreated { get; set; } = DateTime.Now;

        public int ProductId { get; set; }
        public string? UserId { get; set; }
    }
}

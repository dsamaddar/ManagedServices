using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PTS.API.Models.DTO
{
    public class CreateCategoryRequestDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}

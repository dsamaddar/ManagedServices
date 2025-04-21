namespace PTS.API.Models.DTO
{
    public class CreateProductCodeRequestDto
    { 
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string? UserId { get; set; }
    }
}

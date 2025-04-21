namespace PTS.API.Models.DTO
{
    public class CreateProductVersionDto
    {
        public int Id { get; set; }

        public string? Version { get; set; }

        public DateTime VersionDate { get; set; }
        public int ProductId { get; set; }
        public string? UserId { get; set; }
    }
}

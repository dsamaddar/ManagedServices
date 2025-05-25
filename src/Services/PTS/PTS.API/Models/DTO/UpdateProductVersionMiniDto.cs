namespace PTS.API.Models.DTO
{
    public class UpdateProductVersionMiniDto
    {
        public int Id { get; set; }

        public string? Version { get; set; }

        public DateTime VersionDate { get; set; }

        public string? Description { get; set; }
        public string? CylinderPrNo { get; set; }
        public string? CylinderPoNo { get; set; }
        public string? PrintingPrNo { get; set; }
        public string? PrintingPoNo { get; set; }
        public int? CylinderCompanyId { get; set; }
        public int? PrintingCompanyId { get; set; }
        public string? UserId { get; set; }
    }
}

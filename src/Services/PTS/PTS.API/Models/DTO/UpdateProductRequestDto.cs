﻿namespace PTS.API.Models.DTO
{
    public class UpdateProductRequestDto
    {
        public int Id { get; set; }
        public int? CategoryId { get; set; }
    
        public string? Brand { get; set; }
        public string? FlavourType { get; set; }

        public string? Origin { get; set; }

        public string? SKU { get; set; }

        public string? ProductCode { get; set; }
                
        public string? Version { get; set; }
        public DateTime ProjectDate { get; set; }

        public int? PackTypeId { get; set; }

        public string? UserId { get; set; }

    }
}

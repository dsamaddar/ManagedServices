﻿namespace PTS.API.Models.DTO
{
    public class LoginResponseDto
    {
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public List<string>? Roles { get; set; }
    }
}

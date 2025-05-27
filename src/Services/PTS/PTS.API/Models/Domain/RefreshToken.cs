namespace PTS.API.Models.Domain
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
    }
}

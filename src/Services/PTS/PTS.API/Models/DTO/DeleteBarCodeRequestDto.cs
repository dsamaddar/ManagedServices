namespace PTS.API.Models.DTO
{
    public class DeleteBarCodeRequestDto
    {
        public int productId { get; set; }
        public string barCode { get; set; }
    }
}

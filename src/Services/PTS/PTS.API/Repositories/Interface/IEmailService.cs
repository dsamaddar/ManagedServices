namespace PTS.API.Repositories.Interface
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string message);
        Task SendGmailAsync(string toEmail, string subject, string message);
    }
}

using System.Net.Mail;
using System.Net;
using PTS.API.Repositories.Interface;

namespace PTS.API.Repositories.Implementation
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }
        public async Task SendEmailAsync(string toEmail, string subject, string message)
        {
            var smtpClient = new SmtpClient(configuration["Email:SmtpServer"])
            {
                Port = int.Parse(configuration["Email:Port"]),
                Credentials = new NetworkCredential(configuration["Email:Username"], configuration["Email:Password"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(configuration["Email:From"]),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }
}

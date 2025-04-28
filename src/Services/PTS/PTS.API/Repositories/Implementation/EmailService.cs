using System.Net.Mail;
using System.Net;
using PTS.API.Repositories.Interface;
using System.Web;

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
            var smtpClient = new SmtpClient(configuration["Email:SmtpServer"], int.Parse(configuration["Email:Port"]))
            {
                Port = int.Parse(configuration["Email:Port"]),
                Credentials = new NetworkCredential(configuration["Email:Username"], configuration["Email:Password"]),
                EnableSsl = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = true
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

        public async Task SendGmailAsync(string to, string subject, string body)
        {
            var fromAddress = new MailAddress(configuration["Gmail:From"], "Debayan Samaddar");
            var toAddress = new MailAddress(to);
            var fromPassword = configuration["Gmail:Password"]; // App password, not your Google password

            var smtp = new SmtpClient
            {
                Host = configuration["Gmail:SmtpServer"],
                Port = int.Parse(configuration["Gmail:Port"]), // or 465 for SSL
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            using var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            await smtp.SendMailAsync(message);
        }

        
    }
}

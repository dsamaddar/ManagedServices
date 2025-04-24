using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using PTS.API.Models.DTO;
using PTS.API.Repositories.Interface;
using System.Text;
using System.Web;

namespace PTS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly ITokenRepository tokenRepository;
        private readonly IEmailService emailService;

        // register action method

        public AuthController(UserManager<IdentityUser> userManager,
            ITokenRepository tokenRepository,
            IEmailService emailService)
        {
            this.userManager = userManager;
            this.tokenRepository = tokenRepository;
            this.emailService = emailService;
        }

        // POSTL {apibaseurl}/api/auth/login

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            // check email
            var identityUser = await userManager.FindByEmailAsync(request.Email);

            if(identityUser is not null)
            {
                // check password
                var checkPasswordResult = await userManager.CheckPasswordAsync(identityUser, request.Password);

                if (checkPasswordResult)
                {
                    var roles = await userManager.GetRolesAsync(identityUser);

                    // create a token and response
                    var jwtToken = tokenRepository.CreateJwtToken(identityUser, roles.ToList());

                    var response = new LoginResponseDto()
                    {
                        UserId = identityUser.Id,
                        Email = request.Email,
                        Roles = roles.ToList(),
                        Token = jwtToken
                    };
                    return Ok(response);
                }
                
            }

            ModelState.AddModelError("", "Email/Password Incorrect");

            return ValidationProblem(ModelState);
        }

        // POST: {apibaseurl}/api/auth/register
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            // Create IdentityUser object
            var user = new IdentityUser
            {
                UserName = request.Email?.Trim(),
                Email = request.Email?.Trim(),
            };

            // create user
            var identityResult = await userManager.CreateAsync(user,request.Password);

            if (identityResult.Succeeded)
            {
                // add role to users (reader role)

                identityResult = await userManager.AddToRoleAsync(user, "Reader");

                if (identityResult.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    if (identityResult.Errors.Any())
                    {
                        foreach (var error in identityResult.Errors)
                        {

                            ModelState.AddModelError("", error.Description);
                        }
                    }
                }
            }
            else
            {
                if (identityResult.Errors.Any())
                {
                    foreach (var error in identityResult.Errors)
                    {

                        ModelState.AddModelError("", error.Description);
                    }
                }
            }

            return ValidationProblem(ModelState);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null)
                return BadRequest("User not found");

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var resetLink = $"{model.ClientURI}?email={model.Email}&token={encodedToken}";

            var email_body = GenerateEmailBody(resetLink);

            // Send resetLink via email (SMTP or SendGrid)
            await emailService.SendGmailAsync(model.Email, "NEOS-PTS: Reset your password", email_body);

            return Ok(new { message = "Reset link sent" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest("User not found");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
            var result = await userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password reset successful" });
        }

        private string GenerateEmailBody(string resetLink)
        {
            var body = $@"
                        <!DOCTYPE html>
                        <html lang=""en"">
                        <head>
                          <meta charset=""UTF-8"">
                          <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                          <style>
                            body {{
                              font-family: Arial, sans-serif;
                              background-color: #f4f4f4;
                              padding: 20px;
                            }}
                            .container {{
                              background-color: #ffffff;
                              padding: 30px;
                              border-radius: 8px;
                              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                              max-width: 600px;
                              margin: auto;
                            }}
                            .button {{
                              display: inline-block;
                              padding: 10px 20px;
                              margin-top: 20px;
                              background-color: #007bff;
                              color: #ffffff;
                              text-decoration: none;
                              border-radius: 5px;
                            }}
                            .footer {{
                              margin-top: 30px;
                              font-size: 0.9em;
                              color: #666;
                            }}
                          </style>
                        </head>
                        <body>
                          <div class=""container"">
                            <h2>Password Reset Request</h2>
                            <p>Hello,</p>
                            <p>We received a request to reset your password. Click the button below to reset it:</p>
                            <a href=""{resetLink}"" class=""button"">Reset Password</a>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                            <div class=""footer"">
                              <p>Thanks,<br/>NeosCoder</p>
                            </div>
                          </div>
                        </body>
                        </html>";
            return body;
        }
    }
}

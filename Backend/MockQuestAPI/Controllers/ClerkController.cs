using Microsoft.AspNetCore.Mvc;
using MockQuestAPI.Entities.Clerk;
using MockQuestAPI.ServiceContracts;
using System.Text.Json;


namespace MockQuestAPI.Controllers
{
    [ApiController]
    [Route("api/webhooks")]
    public class ClerkWebhookController : ControllerBase
    {
        private readonly IClerkWebhookService _webhookService;
        private readonly ILogger<ClerkWebhookController> _logger;

        public ClerkWebhookController(
            IClerkWebhookService webhookService,
            ILogger<ClerkWebhookController> logger)
        {
            _webhookService = webhookService;
            _logger = logger;
        }

        [HttpPost("clerk")]
        public async Task<IActionResult> HandleClerkWebhook()
        {
            try
            {
                // payload
                using var reader = new StreamReader(Request.Body);
                var payload = await reader.ReadToEndAsync();

                // Get Svix headers
                var svixId = Request.Headers["svix-id"].ToString();
                var svixTimestamp = Request.Headers["svix-timestamp"].ToString();
                var svixSignature = Request.Headers["svix-signature"].ToString();

                // Verifying signature
                if (!await _webhookService.VerifySignature(payload, svixId, svixTimestamp, svixSignature))
                {
                    _logger.LogWarning("Invalid Clerk webhook signature");
                    return Unauthorized(new { error = "Invalid signature" });
                }

                // Parse event
                var webhookEvent = JsonSerializer.Deserialize<ClerkWebhookEvent>(payload, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (webhookEvent == null)
                {
                    return BadRequest(new { error = "Invalid payload" });
                }

                _logger.LogInformation($"Clerk event: {webhookEvent.Type}");

                // Handle event
                switch (webhookEvent.Type)
                {
                    case "user.created":
                        await _webhookService.HandleUserCreated(webhookEvent.Data);
                        break;

                    case "user.updated":
                        await _webhookService.HandleUserUpdated(webhookEvent.Data);
                        break;

                    case "user.deleted":
                        await _webhookService.HandleUserDeleted(webhookEvent.Data);
                        break;

                    default:
                        _logger.LogInformation($"Unhandled event type: {webhookEvent.Type}");
                        break;
                }

                return Ok(new { received = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling Clerk webhook");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}


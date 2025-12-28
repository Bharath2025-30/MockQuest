using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Data;
using MockQuestAPI.Entities;
using MockQuestAPI.Entities.Stream;
using MockQuestAPI.ServiceContracts;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace MockQuestAPI.Services
{
    public class ClerkWebhookService : IClerkWebhookService
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IStreamService _streamService;
        private readonly IConfiguration _config;
        private readonly ILogger<ClerkWebhookService> _logger;

        public ClerkWebhookService(
            ApplicationDbContext dbContext,
            IStreamService streamService,
            IConfiguration config,
            ILogger<ClerkWebhookService> logger)
        {
            _dbContext = dbContext;
            _streamService = streamService;
            _config = config;
            _logger = logger;
        }

        public async Task<bool> VerifySignature(string payload, string svixId, string svixTimestamp, string svixSignature)
        {
            var webhookSecret = _config["CLERK_SIGNING_SECRET"];

            if (string.IsNullOrEmpty(webhookSecret))
            {
                _logger.LogWarning("⚠️ Clerk webhook secret not configured");
                return false;
            }

            try
            {
                // Svix signature format: v1,signature
                var signatures = svixSignature.Split(' ');

                foreach (var sig in signatures)
                {
                    var parts = sig.Split(',');
                    if (parts.Length != 2 || parts[0] != "v1")
                        continue;

                    var expectedSignature = parts[1];

                    // Create signed content: svixId.svixTimestamp.payload
                    var signedContent = $"{svixId}.{svixTimestamp}.{payload}";

                    // Remove "whsec_" prefix from secret
                    var secret = webhookSecret.StartsWith("whsec_")
                        ? webhookSecret.Substring(6)
                        : webhookSecret;

                    // Decode base64 secret
                    var secretBytes = Convert.FromBase64String(secret);

                    // Compute HMAC SHA-256
                    using var hmac = new HMACSHA256(secretBytes);
                    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(signedContent));
                    var computedSignature = Convert.ToBase64String(hash);

                    if (computedSignature == expectedSignature)
                    {
                        _logger.LogInformation("✅ Signature verified");
                        return true;
                    }
                }

                _logger.LogWarning("❌ Signature verification failed");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying signature");
                return false;
            }
        }

        public async Task HandleUserCreated(JsonElement userData)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();

            try
            {
                var id = userData.GetProperty("id").GetString();

                // Idempotency check
                var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.ClerkId == id);

                if (existingUser != null)
                {
                    _logger.LogInformation($"🔄 User {id} already exists - skipping");
                    return;
                }

                // Extract user data
                var emailAddresses = userData.GetProperty("email_addresses");
                var email = emailAddresses.EnumerateArray()
                    .FirstOrDefault()
                    .GetProperty("email_address")
                    .GetString();

                var firstName = userData.TryGetProperty("first_name", out var fn)
                    ? fn.GetString() : "";
                var lastName = userData.TryGetProperty("last_name", out var ln)
                    ? ln.GetString() : "";
                var imageUrl = userData.TryGetProperty("image_url", out var img)
                    ? img.GetString() : "";

                var fullName = $"{firstName} {lastName}".Trim();
                if (string.IsNullOrEmpty(fullName))
                {
                    fullName = email?.Split('@')[0] ?? "User";
                }

                // 1. Create user in MongoDB
                var newUser = new User
                {
                    ClerkId = id,
                    Email = email,
                    Name = fullName,
                    ProfileImage = imageUrl,
                    CreatedAt = DateTime.UtcNow
                };

                await _dbContext.Users.AddAsync(newUser);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"✅ User with ClerkId: {id} created in MongoDB");

                // 2. Create user in Stream Chat
                await _streamService.UpsertUser(new StreamUser
                {
                    Id = id,
                    Name = fullName,
                    Image = imageUrl
                });

                _logger.LogInformation($"✅ User {id} created in Stream");

                await transaction.CommitAsync();

                _logger.LogInformation($"🎉 User {id} fully synced");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "❌ Error creating user - rolled back");
                throw;
            }
        }

        public async Task HandleUserUpdated(JsonElement userData)
        {
            try
            {
                var id = userData.GetProperty("id").GetString();

                var user = await _dbContext.Users.AsQueryable()
                    .FirstOrDefaultAsync(u => u.ClerkId == id);

                if (user == null)
                {
                    _logger.LogWarning($"⚠️ User {id} not found for update");
                    // If user doesn't exist, create them
                    await HandleUserCreated(userData);
                    return;
                }

                var firstName = userData.TryGetProperty("first_name", out var fn)
                    ? fn.GetString() : "";
                var lastName = userData.TryGetProperty("last_name", out var ln)
                    ? ln.GetString() : "";
                var imageUrl = userData.TryGetProperty("image_url", out var img)
                    ? img.GetString() : "";

                var fullName = $"{firstName} {lastName}".Trim();
                if (string.IsNullOrEmpty(fullName))
                {
                    fullName = user.Name; // Keep existing name
                }

                // Update MongoDB
                user.Name = fullName;
                user.ProfileImage = imageUrl;
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"✅ User {id} updated in MongoDB");

                // Update Stream
                await _streamService.UpsertUser(new StreamUser
                {
                    Id = id,
                    Name = fullName
                });

                _logger.LogInformation($"✅ User {id} updated in Stream");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error updating user");
                throw;
            }
        }

        public async Task HandleUserDeleted(JsonElement userData)
        {
            try
            {
                var id = userData.GetProperty("id").GetString();

                var user = await _dbContext.Users.AsQueryable()
                    .FirstOrDefaultAsync(u => u.ClerkId == id);

                if (user != null)
                {
                    // Delete from MongoDB
                    _dbContext.Users.Remove(user);
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation($"✅ User {id} deleted from MongoDB");
                }

                // Delete from Stream
                await _streamService.DeleteUser(id!);
                _logger.LogInformation($"✅ User {id} deleted from Stream");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Error deleting user");
                throw;
            }
        }
    }
}


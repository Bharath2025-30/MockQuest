using MockQuestAPI.DTO_s.Requests;
using MockQuestAPI.Entities;
using MockQuestAPI.Entities.Stream;
using MockQuestAPI.ServiceContracts;
using StreamChat.Clients;
using StreamChat.Models;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;


namespace MockQuestAPI.Services
{
    public class StreamService : IStreamService
    {
        private readonly ILogger<StreamService> _logger;
        private StreamClientFactory _streamClientFactory;
        private readonly IConfiguration _config;
        public StreamService(IConfiguration config, ILogger<StreamService> logger)
        {
            _config = config;
            _logger = logger;
            var apiKey = config["STREAM_API_KEY"];
            var apiSecret = config["STREAM_API_SECRET"];
            _streamClientFactory = new StreamClientFactory(apiKey, apiSecret);
        }
        public async Task DeleteUser(string userId)
        {
            try
            {
                var userClient = _streamClientFactory.GetUserClient();
                await userClient.DeleteAsync(userId);
                _logger.LogInformation($"Stream user {userId} deleted");
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete Stream user {userId}");
                throw;
            }
        }

        public async Task UpsertUser(StreamUser user)
        {
            try
            {
                var userClient = _streamClientFactory.GetUserClient();

                var streamUser = new UserRequest
                {
                    Id = user.Id,
                    Name = user.Name
                };

                await userClient.UpsertAsync(streamUser);

                _logger.LogInformation($"Stream user {user.Id} upserted");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to upsert Stream user {user.Id}");
                throw;
            }
        }

        public async Task CreateVideoSession(CreateSessionReqDto createSessionRequestDTO, Guid sessionId, string callId)
        {
            try
            {
                var apiKey = _config["STREAM_API_KEY"];
                var apiSecret = _config["STREAM_API_SECRET"];

                // Generate JWT token server-side using clerkId (not userId)
                var token = GenerateStreamToken(createSessionRequestDTO.ClerkId!);

                // Make REST API calls to Stream Video endpoints
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}"); 
                httpClient.DefaultRequestHeaders.Add("stream-auth-type", "jwt");

                var callType = "default";

                // Stream Video API endpoint
                var endpoint = $"https://video.stream-io-api.com/video/call/{callType}/{callId}?api_key={apiKey}";

                var requestBody = new
                {
                    data = new
                    {
                        created_by_id = createSessionRequestDTO.ClerkId,
                        custom = new
                        {
                            problem = createSessionRequestDTO.ProblemTitle,
                            difficulty = createSessionRequestDTO.ProblemDifficulty.ToString(),
                            sessionId = sessionId.ToString()
                        }
                    }
                };

                _logger.LogInformation($"Creating video call session {callId} for user {createSessionRequestDTO.ClerkId}");

                var response = await httpClient.PostAsJsonAsync(endpoint, requestBody);

                // Handle different response scenarios
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"Video call session {callId} created successfully");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Stream Video API endpoint not found. Status: {response.StatusCode}, Response: {errorContent}");
                    throw new HttpRequestException($"Stream Video API endpoint not found: {response.StatusCode}");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Unauthorized access to Stream Video API. Status: {response.StatusCode}, Response: {errorContent}");
                    throw new UnauthorizedAccessException("Failed to authenticate with Stream Video API. Check your API credentials.");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Bad request to Stream Video API. Status: {response.StatusCode}, Response: {errorContent}");
                    throw new HttpRequestException($"Invalid request to Stream Video API: {errorContent}");
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Failed to create video call session. Status: {response.StatusCode}, Response: {errorContent}");
                    throw new HttpRequestException($"Stream Video API error: {response.StatusCode} - {errorContent}");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while creating stream video call session");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create stream video call session");
                throw;
            }
        }

        public async Task CreateChatChannel(string callId, string clerkId)
        {
            try
            {
                var _chatClient = _streamClientFactory.GetChannelClient();
                string[] members = [clerkId];

                var channelResponse = await _chatClient.GetOrCreateAsync("messaging", callId, clerkId, members);

                _logger.LogInformation($"Stream chat channel {channelResponse.Channel.Members} created");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to create stream chat channel {callId}");
                throw;
            }
        }

        public async Task AddMembers(string callId, string clerkId)
        {
            try
            {
                var _chatClient = _streamClientFactory.GetChannelClient();

                var channelResponse = await _chatClient.AddMembersAsync("messaging", callId, [clerkId]);

                _logger.LogInformation($"Stream chat channel members : {channelResponse.Channel.Members} updated");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Unable to add the user - {clerkId} to the stream chat as a new member");
                throw;
            }
        }

        public async Task DeleteChatChannel(string callId)
        {
            try
            {
                var chatClient = _streamClientFactory.GetChannelClient();

                _logger.LogInformation($"Deleting chat channel {callId}");

                // Hard delete the channel
                await chatClient.DeleteAsync("messaging", callId);

                _logger.LogInformation($"Chat channel {callId} deleted successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $" Unable to delete the chat channel - {callId}");
                throw;
            }
        }

        public async Task DeleteVideoSession(string callId, string clerkId)
        {
            try
            {
                var apiKey = _config["STREAM_API_KEY"];
                var apiSecret = _config["STREAM_API_SECRET"];

                // Generate JWT token server-side
                var token = GenerateStreamToken(clerkId);

                // Make REST API call to delete Stream Video call
                using var httpClient = new HttpClient();
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
                httpClient.DefaultRequestHeaders.Add("stream-auth-type", "jwt");

                var callType = "default";

                var endpoint = $"https://video.stream-io-api.com/video/call/{callType}/{callId}?api_key={apiKey}";

                _logger.LogInformation($"Attempting to delete video call session. CallId: {callId}, CallType: {callType}, User: {clerkId}");
                _logger.LogInformation($"Delete endpoint: {endpoint}");

                var response = await httpClient.DeleteAsync(endpoint);

                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Delete response - Status: {response.StatusCode}, Content: {responseContent}");

                // Handle different response scenarios
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"Video call session {callId} deleted successfully");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    _logger.LogWarning($"Video call session {callId} not found. CallType: {callType}. Response: {responseContent}");
                    // Check if the call exists first using GET
                    var checkResponse = await httpClient.GetAsync($"https://video.stream-io-api.com/video/call/{callType}/{callId}?api_key={apiKey}");
                    var checkContent = await checkResponse.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Check call existence - Status: {checkResponse.StatusCode}, Content: {checkContent}");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    _logger.LogError($"Unauthorized access to Stream Video API. Status: {response.StatusCode}, Response: {responseContent}");
                    throw new UnauthorizedAccessException("Failed to authenticate with Stream Video API. Check your API credentials.");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    _logger.LogError($"Forbidden: User {clerkId} does not have permission to delete call {callId}. Response: {responseContent}");
                    throw new UnauthorizedAccessException($"User does not have permission to delete this video session.");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    _logger.LogError($"Bad request to Stream Video API. Status: {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Invalid request to Stream Video API: {responseContent}");
                }
                else
                {
                    _logger.LogError($"Failed to delete video call session. Status: {response.StatusCode}, Response: {responseContent}");
                    throw new HttpRequestException($"Stream Video API error: {response.StatusCode} - {responseContent}");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, $"HTTP error occurred while deleting stream video call session {callId}");
                throw;
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogError(ex, $"Authorization error while deleting stream video call session {callId}");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete stream video call session {callId}");
                throw;
            }
        }


        /// <summary>
        /// Generates a JWT token for Stream authentication
        /// </summary>
        /// <param name="userId">The user ID to generate token for</param>
        /// <returns>JWT token string</returns>
        private string GenerateStreamToken(string userId)
        {
            try
            {
                var apiSecret = _config["STREAM_API_SECRET"];

                // Create header
                var header = new
                {
                    alg = "HS256",
                    typ = "JWT"
                };

                // Create payload
                var payload = new
                {
                    user_id = userId,
                    iat = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    exp = DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds() // Token valid for 24 hours
                };

                // Encode header and payload
                var headerJson = JsonSerializer.Serialize(header);
                var payloadJson = JsonSerializer.Serialize(payload);

                var headerBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(headerJson));
                var payloadBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(payloadJson));

                // Create signature
                var message = $"{headerBase64}.{payloadBase64}";
                var signature = ComputeHmacSha256(message, apiSecret);
                var signatureBase64 = Base64UrlEncode(signature);

                // Combine to create JWT
                var jwt = $"{headerBase64}.{payloadBase64}.{signatureBase64}";

                return jwt;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to generate Stream token for user {userId}");
                throw;
            }
        }

        /// <summary>
        /// Computes HMAC SHA256 hash
        /// </summary>
        private byte[] ComputeHmacSha256(string message, string secret)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secret);
            var messageBytes = Encoding.UTF8.GetBytes(message);

            using var hmac = new HMACSHA256(keyBytes);
            return hmac.ComputeHash(messageBytes);
        }

        /// <summary>
        /// Base64 URL encode (removes padding and replaces characters)
        /// </summary>
        private string Base64UrlEncode(byte[] input)
        {
            var base64 = Convert.ToBase64String(input);
            // Replace URL-unsafe characters and remove padding
            return base64.Replace("+", "-").Replace("/", "_").Replace("=", "");
        }


    }
}

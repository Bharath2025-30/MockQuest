using MockQuestAPI.Entities;
using MockQuestAPI.Entities.Stream;
using MockQuestAPI.ServiceContracts;
using StreamChat.Clients;
using StreamChat.Models;


namespace MockQuestAPI.Services
{
    public class StreamService : IStreamService
    {
        private readonly ILogger<StreamService> _logger;
        private StreamClientFactory _streamClientFactory;
        public StreamService(IConfiguration config, ILogger<StreamService> logger)
        {
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
    }
}

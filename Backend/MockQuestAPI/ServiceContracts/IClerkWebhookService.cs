using System.Text.Json;

namespace MockQuestAPI.ServiceContracts
{
    public interface IClerkWebhookService
    {
        Task<bool> VerifySignature(string payload, string svixId, string svixTimestamp, string svixSignature);
        Task HandleUserCreated(JsonElement userData);
        Task HandleUserUpdated(JsonElement userData);
        Task HandleUserDeleted(JsonElement userData);
    }
}

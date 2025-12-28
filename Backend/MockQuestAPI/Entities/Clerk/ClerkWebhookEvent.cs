using System.Text.Json;
using System.Text.Json.Serialization;

namespace MockQuestAPI.Entities.Clerk
{
    public class ClerkWebhookEvent
    {
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("data")]
        public JsonElement Data { get; set; }
    }
}

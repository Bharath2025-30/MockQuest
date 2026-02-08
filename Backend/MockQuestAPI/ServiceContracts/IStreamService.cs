using MockQuestAPI.DTO_s.Requests;
using MockQuestAPI.Entities.Stream;
using System.Threading.Tasks;

namespace MockQuestAPI.ServiceContracts
{
    public interface IStreamService
    {
        Task UpsertUser(StreamUser user);
        Task DeleteUser(string userId);
        Task CreateVideoSession(CreateSessionReqDto createSessionReqDto, Guid sessionId, string callId);
        Task CreateChatChannel(string callId, string clerkId);
        Task AddMembers(string callId, string clerkId);
        Task DeleteChatChannel(string callId);
        Task DeleteVideoSession(string callId, string clerkId);
        Task<string> GetStreamToken(string userId);
    }
}

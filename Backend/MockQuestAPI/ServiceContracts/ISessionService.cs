using MockQuestAPI.Entities;

namespace MockQuestAPI.ServiceContracts
{
    public interface ISessionService
    {
        Task<SessionRoom?> CreateSession(SessionRoom newSession);
        Task<SessionRoom?> EditSessionRoom(SessionRoom updatedSession);
        Task<List<SessionRoom>> GetAllActiveSessions();
        Task<List<SessionRoom>> GetPreviousSessions(Guid userId);
        Task<SessionRoom?> GetSessionById(Guid id);
        Task DeleteSession(Guid sessionId);
    }
}

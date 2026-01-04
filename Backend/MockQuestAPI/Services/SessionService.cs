using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Data;
using MockQuestAPI.Entities;
using MockQuestAPI.Enums;
using MockQuestAPI.ServiceContracts;

namespace MockQuestAPI.Services
{
    public class SessionService : ISessionService
    {
        private readonly ApplicationDbContext _dbContext;
        public SessionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<SessionRoom?> CreateSession(SessionRoom newSession)
        {
            newSession.CreatedAt = DateTime.Now;
            newSession.UpdatedAt = DateTime.Now;
            await _dbContext.SessionRooms.AddAsync(newSession);
            _dbContext.ChangeTracker.DetectChanges();
            Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);
            _dbContext.SaveChanges();
            return _dbContext.SessionRooms.Where(r => r.CallId == newSession.CallId).FirstOrDefault();
        }

        public async Task DeleteSession(Guid sessionId)
        {
            var sessionToDelete = _dbContext.SessionRooms.Where(r => r.Id == sessionId).FirstOrDefault();
            if (sessionToDelete != null)
            {
                _dbContext.SessionRooms.Remove(sessionToDelete);
                _dbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("The session to delete cannot be found");
            }
        }

        public async Task<SessionRoom?> EditSessionRoom(SessionRoom updatedSession)
        {
            var sessionToUpdate = _dbContext.SessionRooms.FirstOrDefault(s => s.Id == updatedSession.Id);
            if (sessionToUpdate != null)
            {
                sessionToUpdate.ParticipantId = updatedSession.ParticipantId;
                sessionToUpdate.UpdatedAt = DateTime.Now;
                sessionToUpdate.Status = updatedSession.Status;
                _dbContext.SessionRooms.Update(sessionToUpdate);
                _dbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);

                await _dbContext.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentException("The session-room to update isn't found");
            }

            return sessionToUpdate;
        }

        public async Task<List<SessionRoom>> GetAllActiveSessions()
        {
            var sessions = await _dbContext.SessionRooms.Where(s => s.Status == RoomStatus.IsActive).OrderByDescending(s => s.CreatedAt).Take(20).AsNoTracking().ToListAsync();
            return await IncludeHostAndParticipants(sessions);
        }

        public async Task<List<SessionRoom>> GetPreviousSessions(Guid userId)
        {
            var sessions = await _dbContext.SessionRooms.Where(s => (s.HostId == userId || s.ParticipantId == userId) && s.Status == RoomStatus.Completed)
                .OrderByDescending(s => s.CreatedAt).Take(20)
                .ToListAsync();
            return await IncludeHostAndParticipants(sessions);
        }

        public async Task<SessionRoom?> GetSessionById(Guid id)
        {
            var session = await _dbContext.SessionRooms.Where(s => s.Id == id)
                .AsNoTracking().FirstOrDefaultAsync();

            if (session is null) return null;
            User? user = await _dbContext.Users.FindAsync(session.HostId);
            session.Host = user!;
            session.Participant = session.ParticipantId != null ? await _dbContext.Users.FindAsync(session.ParticipantId) : null;

            return session;
        }

        private async Task<List<SessionRoom>> IncludeHostAndParticipants(List<SessionRoom> sessionRoomsList)
        {
            // Manually populating Host and Participant since mongoDb provider isn't support LINQ Include
            foreach (var session in sessionRoomsList)
            {
                User? user = await _dbContext.Users.FindAsync(session.HostId);
                session.Host = user!;
                session.Participant = session.ParticipantId != null ? await _dbContext.Users.FindAsync(session.ParticipantId) : null;
            }

            return sessionRoomsList;
        }
    }
}

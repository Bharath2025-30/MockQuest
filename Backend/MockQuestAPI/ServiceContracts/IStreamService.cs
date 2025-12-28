using MockQuestAPI.Entities.Stream;

namespace MockQuestAPI.ServiceContracts
{
    public interface IStreamService
    {
        Task UpsertUser(StreamUser user);
        Task DeleteUser(string userId);
        //TODO: Need to create another method to GenerateToken
    }
}

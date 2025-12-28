using MongoDB.Bson.Serialization.Attributes;

namespace MockQuestAPI.Entities
{
    public class BaseEntity
    {
        [BsonId]
        public Guid Id { get; set;  }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace MockQuestAPI.Entities
{
    [Collection("Departments")]
    public class Department
    {
        [BsonId]
        public Guid Id { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
    }
}

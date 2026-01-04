using System.ComponentModel.DataAnnotations;

namespace MockQuestAPI.DTO_s.Requests
{
    public class JoinSessionReqDto
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string ClerkId { get; set; } = string.Empty;
    }
}

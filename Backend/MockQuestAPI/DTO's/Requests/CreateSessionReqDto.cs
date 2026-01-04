using MockQuestAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace MockQuestAPI.DTO_s.Requests
{
    public class CreateSessionReqDto
    {
        [Required(ErrorMessage = "ProblemTitle is required")]
        public string? ProblemTitle { get; set; }
        [Required(ErrorMessage = "ProblemDifficulty is required ")]
        public Difficulty ProblemDifficulty { get; set; }
        [Required(ErrorMessage = "UserId is required")]
        public string? UserId { get; set; }
        [Required(ErrorMessage = "ClerkId is required")]
        public string? ClerkId { get; set; }
    }
}

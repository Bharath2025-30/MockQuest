using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MockQuestAPI.Entities
{
    public class User : BaseEntity
    {
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Email should be a vaild one")]
        public string? Email { get; set; }
        public string? ProfileImage { get; set; } = "";
        [Required(ErrorMessage ="ClerkId id required")]
        public string? ClerkId { get; set; }
    }
}

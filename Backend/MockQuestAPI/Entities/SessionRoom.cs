using MockQuestAPI.Enums;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MockQuestAPI.Entities
{
    public class SessionRoom : BaseEntity
    {
        [Required]
        public string ProblemTitle { get; set; } = string.Empty;

        [Required]
        public Difficulty ProblemDifficulty { get; set; }

        [Required]
        public Guid HostId { get; set; }

        [ForeignKey(nameof(HostId))]
        public User Host { get; set; }

        public Guid? ParticipantId { get; set; }

        [ForeignKey(nameof(ParticipantId))]
        public User? Participant { get; set; }

        [Required]
        public RoomStatus Status { get; set; } = RoomStatus.IsActive;

        /// <summary>
        /// Gets or Sets the Streams Video callId
        /// </summary>
        [Required]
        public string CallId { get; set; } = string.Empty;
    }
}

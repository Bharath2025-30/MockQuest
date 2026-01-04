namespace MockQuestAPI.DTO_s.Responses
{
    public class ValidationFailureResDTO
    {
        public string? Message { get; set; }
        public Dictionary<string, List<string?>> Errors { get; set; } = new();
    }
}

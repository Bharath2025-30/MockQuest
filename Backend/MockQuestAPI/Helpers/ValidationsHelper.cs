using Microsoft.AspNetCore.Mvc.ModelBinding;
using MockQuestAPI.DTO_s.Responses;

namespace MockQuestAPI.Helpers
{
    public static class ValidationsHelper
    {
        public static ValidationFailureResDTO GetValidationErrorResponse(ModelStateDictionary modelState)
        {
            var response = new ValidationFailureResDTO
            {
                Message = "Validation failed",
                Errors = new Dictionary<string, List<string?>>()
            };

            foreach (var modelStateEntry in modelState)
            {
                var errors = modelStateEntry.Value.Errors;
                if (errors.Count > 0)
                {
                    var errorMessages = errors.Select(error =>
                        string.IsNullOrEmpty(error.ErrorMessage)
                            ? error.Exception?.Message
                            : error.ErrorMessage
                    ).Where(msg => msg != null).ToList();

                    if (errorMessages.Any())
                    {
                        response.Errors[modelStateEntry.Key] = errorMessages;
                    }
                }
            }

            return response;
        }
    }
}

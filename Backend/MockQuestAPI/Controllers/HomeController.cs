using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace MockQuestAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        public HomeController() { 
        
        }

        [HttpGet("/")]
        public string Get()
        {
            return "Response from API";
        }
    }
}

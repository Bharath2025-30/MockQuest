using Microsoft.AspNetCore.Mvc;

namespace MockQuestAPI.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

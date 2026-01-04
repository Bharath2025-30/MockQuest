using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MockQuestAPI.Entities;
using MockQuestAPI.ServiceContracts;
using MongoDB.Bson;
using System.Linq.Expressions;
using System.Reflection.Metadata.Ecma335;

namespace MockQuestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HomeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IDepartmentService _departmentService;
        public HomeController(IConfiguration configuration, IDepartmentService departmentService) { 
            _configuration = configuration;
            _departmentService = departmentService;
        }

        [HttpGet("/")]
        public string Get()
        {
            return "Response from API";
        }

        [HttpGet("getAllDepartments")]
        public IActionResult GetAllDepartments()
        {
            return Ok(_departmentService.GetAllDepartments().ToList());
        }

        [HttpPost("addNewDepartment")]
        public IActionResult AddNewDepartment(Department newDepartment)
        {
            var newId = _departmentService.AddDepartment(newDepartment);
            return Ok(newId);
        }

        [HttpPut("updateDepartment")]
        public IActionResult UpdateDepartmentDetails(Department updatedDepartment)
        {
            return Ok(_departmentService.EditDepartment(updatedDepartment));
        }

        [HttpDelete("deleteDepartment")]
        public IActionResult deleteDepartment(Department department)
        {
            _departmentService.DeleteDepartment(department);
            return Ok(new
            {
                messag = $"{department.DepartmentName} deleted successfully"
            });
        }
    }
}

using MockQuestAPI.Entities;
using MongoDB.Bson;

namespace MockQuestAPI.ServiceContracts
{
    public interface IDepartmentService
    {
        IEnumerable<Department> GetAllDepartments();
        Department? GetDepartmentById(Guid id);
        Guid AddDepartment(Department newDepartment);
        Department EditDepartment(Department updatedDepartment);
        void DeleteDepartment(Department departmentToDelete);

    }
}

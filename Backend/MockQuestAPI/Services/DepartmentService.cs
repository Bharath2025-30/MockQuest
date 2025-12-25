using Microsoft.EntityFrameworkCore;
using MockQuestAPI.Data;
using MockQuestAPI.Entities;
using MockQuestAPI.ServiceContracts;
using MongoDB.Bson;

namespace MockQuestAPI.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly ApplicationDbContext _dbContext;
        public DepartmentService(ApplicationDbContext dbContext)
        {   
            _dbContext = dbContext;
        }
        public Guid AddDepartment(Department newDepartment)
        {
            _dbContext.Departments.Add(newDepartment);
            _dbContext.ChangeTracker.DetectChanges();
            Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);
            _dbContext.SaveChanges();
            return _dbContext.Departments.Where(d => d.DepartmentId == newDepartment.DepartmentId).First().Id;
        }

        public void DeleteDepartment(Department department)
        {
            var departmentToDelete = _dbContext.Departments.Where(d => d.Id == department.Id).FirstOrDefault();
            if (departmentToDelete != null)
            {
                _dbContext.Departments.Remove(departmentToDelete);
                _dbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);
                _dbContext.SaveChanges();
            }
            else
            {
                throw new ArgumentException("The department to delete cannot be found");
            }
        }

        public Department EditDepartment(Department updatedDepartment)
        {
            var departmentToUpdate = _dbContext.Departments.FirstOrDefault(d => d.Id == updatedDepartment.Id);
            if (departmentToUpdate != null)
            {
                departmentToUpdate.DepartmentName = updatedDepartment.DepartmentName;
                departmentToUpdate.DepartmentId = updatedDepartment.DepartmentId;
                _dbContext.Departments.Update(departmentToUpdate);
                _dbContext.ChangeTracker.DetectChanges();
                Console.WriteLine(_dbContext.ChangeTracker.DebugView.LongView);

                _dbContext.SaveChanges();
            }
            else
            {
                throw new ArgumentException("The department to update cannot be found");
            }
            return departmentToUpdate;
        }

        public IEnumerable<Department> GetAllDepartments()
        {
            return _dbContext.Departments.OrderByDescending(d => d.Id).Take(20).AsNoTracking().AsEnumerable();
        }

        public Department? GetDepartmentById(Guid id)
        {
            return _dbContext.Departments.FirstOrDefault(d => d.Id == id);
        }
    }
}

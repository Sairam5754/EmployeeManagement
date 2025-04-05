using EmployeeManagement.Controllers.Models;
using EmployeeManagement.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class EmployeeController : ControllerBase
{
	private readonly MyDbContext _dbContext;

	public EmployeeController(MyDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	// POST: Register Employee
	[HttpPost("register")]
	public IActionResult RegisterEmployee([FromBody] EmployeeRegistrationDTO employeeDto)
	{
		if (employeeDto == null)
		{
			return BadRequest(new { message = "Invalid employee data." });
		}

		if (!ModelState.IsValid)
		{
			return BadRequest(ModelState);
		}

		// Check for duplicate employee
		if (_dbContext.Employees.Any(e => e.Name == employeeDto.Name && e.DateOfJoin == employeeDto.DateOfJoin))
		{
			return Conflict(new { message = "Employee with the same name and joining date already exists." });
		}

		var employee = new Employee
		{
			Name = employeeDto.Name,
			Designation = employeeDto.Designation,
			DateOfJoin = employeeDto.DateOfJoin,
			Salary = employeeDto.Salary,
			Gender = employeeDto.Gender,
			State = employeeDto.State
		};

		_dbContext.Employees.Add(employee);
		_dbContext.SaveChanges();

		return Ok(new { message = "Employee registered successfully.", employee });
	}

	// GET: Retrieve all employees
	[HttpGet]
	public IActionResult GetAllEmployees()
	{
		var employees = _dbContext.Employees.ToList();
		return Ok(employees);
	}

	// GET: Retrieve employee by ID
	[HttpGet("{id}")]
	public IActionResult GetEmployeeById(int id)
	{
		var employee = _dbContext.Employees.Find(id);
		if (employee == null)
		{
			return NotFound(new { message = "Employee not found." });
		}
		return Ok(employee);
	}

	// PUT: Update an employee by ID
	[HttpPut("{id}")]
	public IActionResult UpdateEmployee(int id, [FromBody] EmployeeRegistrationDTO employeeDto)
	{
		if (employeeDto == null)
		{
			return BadRequest(new { message = "Invalid employee data." });
		}

		var existingEmployee = _dbContext.Employees.Find(id);
		if (existingEmployee == null)
		{
			return NotFound(new { message = "Employee not found." });
		}

		existingEmployee.Name = employeeDto.Name;
		existingEmployee.Designation = employeeDto.Designation;
		existingEmployee.DateOfJoin = employeeDto.DateOfJoin;
		existingEmployee.Salary = employeeDto.Salary;
		existingEmployee.Gender = employeeDto.Gender;
		existingEmployee.State = employeeDto.State;

		_dbContext.SaveChanges();

		return Ok(new { message = "Employee updated successfully.", employee = existingEmployee });
	}

	// DELETE: Delete an employee by ID
	[HttpDelete("{id}")]
	public IActionResult DeleteEmployee(int id)
	{
		var employee = _dbContext.Employees.Find(id);
		if (employee == null)
		{
			return NotFound(new { message = "Employee not found." });
		}

		_dbContext.Employees.Remove(employee);
		_dbContext.SaveChanges();

		return Ok(new { message = "Employee deleted successfully." });
	}
}


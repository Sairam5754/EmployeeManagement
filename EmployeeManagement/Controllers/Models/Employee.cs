using System.ComponentModel.DataAnnotations;

namespace EmployeeManagement.Controllers.Models
{
	public class Employee
	{

		[Key]
		public int Id { get; set; }

		[Required(ErrorMessage = "Name is required")]
		[StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
		public string Name { get; set; }

		[Required(ErrorMessage = "Designation is required")]
		[StringLength(50, ErrorMessage = "Designation cannot exceed 50 characters")]
		public string Designation { get; set; }

		
		[Required(ErrorMessage = "Date of Joining is required")]
		[DataType(DataType.Date)]
		public DateTime DateOfJoin { get; set; }

		[Required(ErrorMessage = "Salary is required")]
		[Range(0, double.MaxValue, ErrorMessage = "Salary must be a positive value")]
		public decimal Salary { get; set; }

		[Required(ErrorMessage = "Gender is required")]
		[RegularExpression("^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
		public string Gender { get; set; }

		[Required(ErrorMessage = "State is required")]
		public string State { get; set; }
	}
}

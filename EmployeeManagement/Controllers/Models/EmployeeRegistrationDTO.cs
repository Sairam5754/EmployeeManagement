namespace EmployeeManagement.Controllers.Models
{
	public class EmployeeRegistrationDTO
	{
		public string Name { get; set; }
		public string Designation { get; set; }
		public DateTime DateOfJoin { get; set; }
		public decimal Salary { get; set; }
		public string Gender { get; set; }
		public string State { get; set; }
	}
}

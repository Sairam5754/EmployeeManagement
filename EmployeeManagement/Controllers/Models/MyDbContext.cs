using Microsoft.EntityFrameworkCore;
using EmployeeManagement.Controllers.Models;

namespace EmployeeManagement.Data
{
	public class MyDbContext : DbContext
	{
		public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

		public DbSet<Employee> Employees { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			// Configure Employee entity if needed
			modelBuilder.Entity<Employee>()
				.Property(e => e.Salary)
				.HasColumnType("decimal(18,2)"); // Ensuring proper decimal precision
		}
	}
}

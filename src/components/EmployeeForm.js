import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { createEmployee } from "./employeeService"; // 👈 import


const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    dateOfJoin: "",
    salary: "",
    gender: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Please enter name";
    if (!formData.designation) newErrors.designation = "Please enter designation";
    if (!formData.dateOfJoin) newErrors.dateOfJoin = "Please enter date of joining";
    if (!formData.salary || isNaN(formData.salary)) newErrors.salary = "Please enter a valid salary";
    if (!formData.gender) newErrors.gender = "Please select gender";
    if (!formData.state) newErrors.state = "Please select state";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await createEmployee(formData);
        alert("Employee saved successfully!");
        navigate("/employee-list"); // ✅ Correct path as per App.js
      } catch (error) {
        console.error(error);
        alert("Failed to save employee. Try again later.");
      }
    } else {
      alert("Please fill all required fields.");
    }
  };


  return (
    <div className="container mt-3">
      <h3>Employee Details</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name *</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} />
          {errors.name && <span className="text-danger">{errors.name}</span>}
        </div>
        <div className="mb-2">
          <label>Designation *</label>
          <input type="text" name="designation" className="form-control" onChange={handleChange} />
          {errors.designation && <span className="text-danger">{errors.designation}</span>}
        </div>
        <div className="mb-2">
          <label>Date of Join *</label>
          <input type="date" name="dateOfJoin" className="form-control" onChange={handleChange} />
          {errors.dateOfJoin && <span className="text-danger">{errors.dateOfJoin}</span>}
        </div>
        <div className="mb-2">
          <label>Salary *</label>
          <input type="number" name="salary" className="form-control" onChange={handleChange} />
          {errors.salary && <span className="text-danger">{errors.salary}</span>}
        </div>
        <div className="mb-2">
          <label>Gender *</label><br />
          <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
          <input type="radio" name="gender" value="Female" onChange={handleChange} className="ms-2" /> Female
          {errors.gender && <span className="text-danger ms-2">{errors.gender}</span>}
        </div>
        <div className="mb-2">
          <label>State *</label>
          <select name="state" className="form-control" onChange={handleChange}>
            <option value="">Select State</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
            <option value="Chandigarh">Chandigarh</option>
            <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
            <option value="Lakshadweep">Lakshadweep</option>
            <option value="Delhi">Delhi</option>
            <option value="Puducherry">Puducherry</option>
            <option value="Ladakh">Ladakh</option>
            <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          </select>
          {errors.state && <span className="text-danger">{errors.state}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default EmployeeForm;



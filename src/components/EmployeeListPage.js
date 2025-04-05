import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import $ from "jquery";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployee,
} from "./employeeService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [designationChartData, setDesignationChartData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showChartModal, setShowChartModal] = useState(false);
  const itemsPerPage = 5;

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    dateOfJoin: "",
    age: "",
    salary: "",
    gender: "",
    state: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      alert("Error loading employee data");
    }
  };

  useEffect(() => {
    const total = employees.reduce(
      (sum, emp) => sum + parseFloat(emp.salary || 0),
      0
    );
    $("#totalSalary").text(`Total Salary: ₹${total.toLocaleString()}`);

    const chartData = employees.reduce((acc, emp) => {
      const existing = acc.find((d) => d.designation === emp.designation);
      if (existing) {
        existing.salary += parseFloat(emp.salary || 0);
      } else {
        acc.push({
          designation: emp.designation,
          salary: parseFloat(emp.salary || 0),
        });
      }
      return acc;
    }, []);
    setDesignationChartData(chartData);
  }, [employees]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    const aVal = a[key];
    const bVal = b[key];

    if (key === "age" || key === "salary") {
      return direction === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const filteredEmployees = sortedEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      alert("No employees selected");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedEmployees.length} selected employees?`
      )
    ) {
      for (const id of selectedEmployees) {
        await deleteEmployee(id);
      }
      setEmployees((prev) =>
        prev.filter((emp) => !selectedEmployees.includes(emp.id))
      );
      setSelectedEmployees([]);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData({ ...employee });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const isDuplicate = employees.some(
      (emp) =>
        emp.id !== editingEmployee &&
        emp.name.toLowerCase() === formData.name.toLowerCase() &&
        emp.dateOfJoin === formData.dateOfJoin
    );

    if (isDuplicate) {
      alert("Duplicate employee entry.");
      return;
    }

    await updateEmployee(editingEmployee, formData);
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === editingEmployee ? { ...formData, id: emp.id } : emp
      )
    );
    setEditingEmployee(null);
    handleClearForm();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee List", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Name", "Designation", "DOJ", "Age", "Salary", "Gender", "State"]],
      body: employees.map((emp) => [
        emp.name,
        emp.designation,
        emp.dateOfJoin,
        emp.age,
        emp.salary,
        emp.gender,
        emp.state,
      ]),
    });
    doc.save("employee_list.pdf");
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      designation: "",
      dateOfJoin: "",
      age: "",
      salary: "",
      gender: "",
      state: "",
    });
  };

  const handleSelectAll = (e) => {
    setSelectedEmployees(
      e.target.checked ? paginatedEmployees.map((emp) => emp.id) : []
    );
  };

  const handleSelectOne = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id)
        ? prev.filter((empId) => empId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Employee List</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3 d-flex gap-2">
        <button className="btn btn-primary" onClick={handleDownloadPDF}>
          Download PDF
        </button>
        <button className="btn btn-danger" onClick={handleBulkDelete}>
          Delete Selected
        </button>
        <button
          className="btn btn-info"
          onClick={() => setShowChartModal(true)}
        >
          Show Chart
        </button>
      </div>

      {/* Employee Table */}
      <table className="table table-bordered table-hover table-responsive">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  paginatedEmployees.length > 0 &&
                  selectedEmployees.length === paginatedEmployees.length
                }
                onChange={handleSelectAll}
              />
            </th>
            {["name", "designation", "dateOfJoin", "age", "salary", "gender", "state"].map(
              (key) => (
                <th key={key} style={{ cursor: "pointer" }} onClick={() => handleSort(key)}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} {getSortArrow(key)}
                </th>
              )
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No employees found.
              </td>
            </tr>
          ) : (
            paginatedEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => handleSelectOne(emp.id)}
                  />
                </td>
                {editingEmployee === emp.id ? (
                  <>
                    {["name", "designation", "dateOfJoin", "age", "salary", "gender", "state"].map(
                      (key) => (
                        <td key={key}>
                          <input
                            type="text"
                            name={key}
                            className="form-control"
                            value={formData[key]}
                            onChange={handleInputChange}
                          />
                        </td>
                      )
                    )}
                    <td>
                      <button className="btn btn-success btn-sm me-1" onClick={handleUpdate}>
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm me-1"
                        onClick={() => setEditingEmployee(null)}
                      >
                        Cancel
                      </button>
                      <button className="btn btn-warning btn-sm" onClick={handleClearForm}>
                        Clear
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{emp.name}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.dateOfJoin}</td>
                    <td>{emp.age}</td>
                    <td>{emp.salary}</td>
                    <td>{emp.gender}</td>
                    <td>{emp.state}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-1"
                        onClick={() => handleEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredEmployees.length / itemsPerPage)
                ? prev + 1
                : prev
            )
          }
          disabled={currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      <div
        id="totalSalary"
        className="alert alert-info mt-4 fw-bold text-center"
      ></div>

      {/* Chart Modal */}
      {showChartModal && (
        <div className="modal d-block" tabIndex="-1" onClick={() => setShowChartModal(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Designation vs Salary Chart</h5>
                <button type="button" className="btn-close" onClick={() => setShowChartModal(false)}></button>
              </div>
              <div className="modal-body">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={designationChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="designation" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="salary" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowChartModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeListPage;

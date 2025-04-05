import React from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("/employee-form");
  };

  return (
    <div className="text-center">
      <h3>Welcome to the Employee Management System</h3>
      <p>You can add a new employee using the button below.</p>
      <button className="btn btn-success mt-3" onClick={handleAddEmployee}>
        Add New Employee
      </button>
    </div>
  );
};

export default IndexPage;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import IndexPage from "./components/IndexPage";
import EmployeeListPage from "./components/EmployeeListPage";


const App = () => {
  return (
    <Router>
      <div className="App container mt-4">
        <h2 className="text-center mb-4">Employee Management</h2>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/employee-form" element={<EmployeeForm />} />
          <Route path="/employee-list" element={<EmployeeListPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;








const CREATE_EMPLOYEE_URL = "https://localhost:44359/api/Employee/register";

export const createEmployee = async (formData) => {
  const response = await fetch(CREATE_EMPLOYEE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to save employee");
  }

  return await response.json();
};

const FETCH_EMPLOYEES_URL = "https://localhost:44359/api/Employee";

export const fetchEmployees = async () => {
    const response = await fetch(`${FETCH_EMPLOYEES_URL}`); // 👈 or whatever your backend GET route is
    if (!response.ok) throw new Error("Failed to fetch employees");
    return await response.json();
  };
  
  const DELETE_EMPLOYEE_URL = "https://localhost:44359/api/Employee";

  export const deleteEmployee = async (id) => {
    const response = await fetch(`${DELETE_EMPLOYEE_URL}/${id}`, {
      method: "DELETE",
    });
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to delete employee");
    }
  
    return true;
  };
  
  const UPDATE_EMPLOYEE_URL = "https://localhost:44359/api/Employee"; // adjust if needed

export const updateEmployee = async (id, formData) => {
  const response = await fetch(`${UPDATE_EMPLOYEE_URL}/${id}`, {
    method: "PUT", // or PATCH depending on your API
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update employee");
  }

  return await response.json();
};

  
  

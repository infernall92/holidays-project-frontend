import Accordion from "react-bootstrap/Accordion";

import { useState, useEffect } from "react";
import EmployeeDetails from "./EmployeeDetails";

export default function EmployeeListPage() {
  const [backendData, setBackendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  function fetchEmployees() {
    fetch("http://localhost:5000/admin/employees")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.employees);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  // console.log(backendData);

  return (
    <div className="full-width">
      <h2 className="centered">Employees</h2>
      {/* {loading ? (
        <p>Loading...</p>
      ) : (
        backendData.map((employee) => (
          <div className="centered" key={employee.id}>
            <EmployeeDetails
              firstName={employee.first_name}
              lastName={employee.last_name}
              id={employee.id}
              email={employee.email}
              mobile={employee.mobile_number}
              password={employee.password}
              requests={`requests by ${employee.name}`}
            >
              {employee.first_name} {employee.last_name}
            </EmployeeDetails>
          </div>
        ))
      )} */}


{/* ----------------------------------------------------------------- */}
<div className="accordion-container">
<Accordion defaultActiveKey="0">
    {backendData.map(employee => 
      <Accordion.Item key={employee.id} eventKey={employee.id}>
        <Accordion.Header>{employee.first_name} {employee.last_name}</Accordion.Header>
        <Accordion.Body>
        <EmployeeDetails
              firstName={employee.first_name}
              lastName={employee.last_name}
              id={employee.id}
              email={employee.email}
              mobile={employee.mobile_number}
              password={employee.password}
              requests={`requests by ${employee.name}`}
            >
              {employee.first_name} {employee.last_name}
            </EmployeeDetails>
        </Accordion.Body>
      </Accordion.Item> )}      
    </Accordion>
    </div>
    </div>
  );
}

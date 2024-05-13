import Button from 'react-bootstrap/Button';


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../store/login";
import { toast, Bounce } from "react-toastify";

export default function NewEmployeeForm() {
  const dispatch = useDispatch();
  const [backendData, setBackendData] = useState([]);

  const currentEmployees = useSelector((state) => state.login.employees);

  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  function fetchEmployees() {
    fetch("http://localhost:5000/admin/employees")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.employees);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const emailTaken = backendData.some((emp) => emp.email === newEmployee.email);

    if (emailTaken) {
      alert("Email is already taken"); // TODO : better UI
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee),
    };

    fetch("http://localhost:5000/admin/employees/addEmployee", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee added successfully:", data);
        toast.success("New employee added successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        setBackendData([...backendData, newEmployee]);
      })
      .catch((error) => {
        console.error("There was a problem adding the employee:", error);
        toast.error("Failed to add a new employee", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      });

    dispatch(loginActions.addEmployee(newEmployee));

    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      password: "",
    });
  }

  return <>
    <form className="form-container" onSubmit={handleSubmit}>
  <label htmlFor="firstName">First Name:</label>
  <input
    type="text"
    id="firstName"
    name="firstName"
    value={newEmployee.firstName}
    onChange={handleInputChange}
    required
  />
  <label htmlFor="lastName">Last Name:</label>
  <input
    type="text"
    id="lastName"
    name="lastName"
    value={newEmployee.lastName}
    onChange={handleInputChange}
    required
  />
  <label htmlFor="email">Email:</label>
  <input
    type="email"
    id="email"
    name="email"
    value={newEmployee.email}
    onChange={handleInputChange}
    required
  />
  <label htmlFor="mobileNumber">Mobile Number:</label>
  <input
    type="tel"  
    id="mobileNumber"
    name="mobileNumber"
    value={newEmployee.mobileNumber}
    onChange={handleInputChange}
    required
  />
  <label htmlFor="password">Password:</label>
  <input
    type="password"
    id="password"
    name="password"
    value={newEmployee.password}
    onChange={handleInputChange}
    required
  />
  <Button className="btn-dark" type="submit">
    Add Employee
  </Button>
</form>

{/* <Form>
      <Form.Group className="mb-3" controlId="formBasicFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder="Enter first name" value={newEmployee.firstName} onChange={handleInputChange} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder="Enter last name" value={newEmployee.lastName} onChange={handleInputChange} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={newEmployee.email} onChange={handleInputChange} />
        <Form.Text className="text-muted">
          (will be used by the employee for signing in)
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicMobileNumber">
        <Form.Label>Mobile Number</Form.Label>
        <Form.Control type="tel" placeholder="Enter mobile number" value={newEmployee.mobileNumber} onChange={handleInputChange} />
        <Form.Text className="text-muted">
          (10-digit phone number)
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={newEmployee.password} onChange={handleInputChange} />
      </Form.Group>

      <Button variant="dark" type="submit">
        Add employee
      </Button>
    </Form> */}
  </>

}


// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginActions } from "../store/login";
// import { toast, Bounce } from "react-toastify";

// export default function NewEmployeeForm() {
//     const dispatch = useDispatch();
//     const [backendData, setBackendData] = useState([{}]);

//   const currentEmployees = useSelector((state) => state.login.employees);

//   const [newEmployee, setNewEmployee] = useState({
//     // id: currentEmployees.length,
//     firstName: "",
//     lastName: "",
//     email: "",
//     mobileNumber: null,
//     password: "",
//   });

//   useEffect(() => {
//     function fetchEmployees() {
//       fetch("http://localhost:5000/admin/employees")
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           setBackendData(data.employees);
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     }
//     fetchEmployees(); 
//   }, [setBackendData]);

//   function handleInputChange(event) {
//     const { name, value } = event.target;
//     setNewEmployee({ ...newEmployee, [name]: value });
//   }



//   function handleSubmit(event) {
//     event.preventDefault();

//     const emailTaken = backendData.some(emp => emp.email === newEmployee.email);

//     if (emailTaken) {
//       alert("Email is already taken"); // TODO : better UI
      
//       return;
//     }

//     const requestOptions = {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newEmployee),
//     };

//     fetch("http://localhost:5000/admin/employees/addEmployee", requestOptions)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Employee added successfully:", data);
//         toast.success('New employee added successfully', {
//           position: "top-center",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//           transition: Bounce,
//           });

//         setBackendData((prevData) => [...prevData, { ...newEmployee }]);
//       })
//       .catch((error) => {
//         console.error("There was a problem adding the employee:", error);
//       });

//       dispatch(loginActions.addEmployee(newEmployee));

//     setNewEmployee({
//       id: backendData.length + 1,
//       name: "",
//       email: "",
//       password: "",
//     });

//     console.log(currentEmployees);
//   }

//     return <>
//         <form className="form-container" onSubmit={handleSubmit}>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="name"
//             id="name"
//             name="name"
//             value={newEmployee.name}
//             onChange={handleInputChange}
//           />
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={newEmployee.email}
//             onChange={handleInputChange}
//           />
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={newEmployee.password}
//             onChange={handleInputChange}
//           />
//           <button className="active-button" type="submit">Add Employee</button>
//         </form>
//     </>
// }
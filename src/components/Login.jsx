/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../store/login";


export default function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const employees = useSelector((state) => state.login.employees);
  const admins = useSelector((state) => state.login.admins);
  const isLoggedIn= useSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    // Fetch employees when the component mounts
    function fetchEmployees() {
      fetch("http://localhost:5000/admin/employees")
        .then((response) => response.json())
        .then((data) => {
          dispatch(loginActions.setEmployees(data.employees));
        })
        .catch((error) => {
          console.error("Error fetching employees:", error);
        });
    } 

    function fetchAdmins() {
      fetch("http://localhost:5000/admin/admins")
        .then((response) => response.json())
        .then((data) => {
          dispatch(loginActions.setAdmins(data.admins));
        })
        .catch((error) => {
          console.error("Error fetching admins:", error);
        });
    }
    
             
    fetchEmployees();
    fetchAdmins();
  }, [dispatch]);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const employee = employees.find(
      (emp) => emp.email === email && emp.password === password
    );
    const admin = admins.find((adm) => adm.email === email && adm.password === password);

    if (admin) {
            
    localStorage.setItem('loggedIn', true);
    dispatch(loginActions.login());
    dispatch(loginActions.isAdmin());
      
      console.log("Redux state: ", isLoggedIn);
      console.log("local Storage state: ",localStorage.getItem('isLoggedIn'));
      
    } else if (employee) {
      
      localStorage.setItem('loggedIn', true);
    dispatch(loginActions.login());
    } else {
      alert("Invalid email or password");
    }
    console.log(email, password);
    // onLogin(email,password)
  }


  // function handleSubmit(event) {
  //   event.preventDefault();
  
  //   const employee = employees.find(
  //     (emp) => emp.email === email && emp.password === password
  //   );
  
  //   if (email === "admin@example.com" && password === "admin") {
  //     // Admin login
  //     fetchTokenAndLogin();
  //   } else if (employee) {
  //     // Employee login
  //     fetchTokenAndLogin();
  //   } else {
  //     alert("Invalid email or password");
  //   }
  // }
  
  // function fetchTokenAndLogin() {
  //   fetch('http://localhost:5000/login', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ email, password })
  //   })
  //   .then(response => {
  //     if (!response.ok) {
  //       throw new Error('Authentication failed');
  //     }
  //     return response.json();
  //   })
  //   .then(data => {
  //     // Extract token from response data
  //     const token = data.token; // Assuming your server returns a token in the response
  //     // Save token to local storage
  //     localStorage.setItem('token', token);
  //     // Dispatch action to set authenticated state
  //     dispatch(loginActions.login());
      
  //     // Redirect or perform other actions after login
  //     onLogin(email, password);
  //   })
  //   .catch(error => {
  //     console.error('Authentication error:', error);
  //     // Handle authentication error (e.g., display error message)
  //   });
  // }
  
  return (
    <>
      <form className="input-form" onSubmit={handleSubmit} >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit" className="btn-dark" onClick={() => onLogin(email, password)}>Log in</Button>
      </form>
    </>
  );
}

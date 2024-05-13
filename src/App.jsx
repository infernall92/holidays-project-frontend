//Users are deleted in the UI upon DELETE request but not in the employees.json
//Same with pending requests + UI is not updated on deletion
//Needs some modals to be shown upon certain actions for better UI
//Approved requests status to be updated on 'approved' on approval in the requests.json
//Also to be marked as unavailable for booking in the calendar
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Login from "./components/Login";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { loginActions } from "./store/login";


function App() {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  
  // const loggedIn = localStorage.getItem('isLoggedIn');

  async function handleLogin(email, password) {
    try {
      const response = await fetch("https://holidays-project-backend.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Login response:", data);

      const { userId, userName } = data; // Extract userId from response
      console.log("User ID:", userId);
      console.log("user name:", userName);

      if (userId !== undefined && userId !== null) {
        // Store userId in state
        dispatch(loginActions.setEmployeeId(userId));
        dispatch(loginActions.setEmployeeName(userName));
        
      } else {
        // Handle login failure
        console.error("Login failed");
        // Redirect or display error message
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error
    }

    // -------------THIS CODE WORKS, RETURNS THE USERID BUT AFTER REFRESH LOGS OUT-----------------
    //     if (userId) {
    //         // Store userId in state
    //         dispatch(loginActions.setEmployeeId(userId));
    //         // Redirect or perform any action for successful login
    //     } else {
    //         // Handle login failure
    //         console.error('Login failed');
    //         // Redirect or display error message
    //     }
    // } catch (error) {
    //     console.error('Error logging in:', error);
    //     // Handle login error
    // }
  }

  return (
    <>
      {isLoggedIn ? <Header signedIn={true} /> : <Header signedIn={false} />}
      {!isLoggedIn ? <Login onLogin={handleLogin} /> : <Dashboard />}
      <ToastContainer 
        position="top-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop
closeOnClick
rtl={false}
pauseOnFocusLoss={false}
draggable
pauseOnHover={false}
theme="light"
transition={Bounce}
      />
    </>
  );
}

export default App;

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import {  toast } from 'react-toastify';
import {  Bounce } from 'react-toastify';
import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import ChatWindow from "./ChatWindow";
import MyModal from "./Modal";


export default function EmployeeDashboard({ onLogout }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [isClicked, setIsClicked] = useState('');
  const [message, setMessage] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  // const [isMessagesClicked, setIsMessagesClicked] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: ''
  })

  const [, setRequestStatus] = useState(null);
  const userId = useSelector((state) => state.login.employeeId);
  const userName = useSelector(state => state.login.employeeName);  
  const senderId = userId;
  const receiverId = 1;
  

  useEffect(() => {

    async function fetchSignedUserName() {
      try {
          // Fetch all employees from the server
          const response = await fetch('https://holidays-project-backend.onrender.com/admin/employees');

          if (!response.ok) {
              throw new Error('Failed to fetch employees');
          }
          const responseData = await response.json();
          const employees = responseData.employees

          // Assuming the signed-in user's information is available in the client-side
          const signedInUserId = userId; // Replace '123' with actual signed-in user's ID


          // Extract the signed-in employee from the list of employees
          const signedInEmployee = employees.find(employee => employee.id === signedInUserId);

          if (signedInEmployee) {
              const { first_name, last_name } = signedInEmployee;
              setUser({ firstName: first_name, lastName: last_name });
              console.log(user);
          } else {
              console.log('Signed-in employee not found');
          }
      } catch (error) {
          console.error('Error fetching employees:', error.message);
      }
  }
  
  // Call the function to fetch employees and extract the signed-in employee
  fetchSignedUserName();
   
    // Fetch disabled days from the backend when the component mounts
    fetchDisabledDays();
  }, [userId]); // Empty dependency array ensures the effect runs only once on mount

  // console.log('Logged in:', user.firstName, user.lastName)
  function fetchDisabledDays() {
    fetch("https://holidays-project-backend.onrender.com/admin/get-disabled-days")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch disabled days");
        }
        return response.json();
      })
      .then((data) => {
        setDisabledDays(data.disabledDays);
      })
      .catch((error) => {
        console.error("Error fetching disabled days:", error);
      });
  }


  async function handleClick() {
    setRequestStatus("pending");
    
    setModalOpen(false);
    try {
      const requestId = Date.now();
      console.log(userId);
      // Prepare request data
      const requestData = {
        // id: requestId,
        userId: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        days: selectedDays,
        message: message, //to be taken from state, ---------------------------------TODO
        status: "pending",
      };
      console.log(requestData);
      // Send request to backend
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      };

     

      fetch(
        `https://holidays-project-backend.onrender.com/admin/pending-requests/${requestId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then(() => {
          setRequestStatus("success");
          toast.success('Request sent successfully', {
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
          
          console.log("Request sent successfully:", selectedDays); 
        })
        .catch((error) => {
          setRequestStatus("error");

        

          toast.error('Sending the request failed. Try again later', {
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
          console.error("Error sending request:", error);
        });
    } catch (error) {
      setRequestStatus("error");
      console.error("Error sending request:", error);
    }
  }

  function handleButtonClick(value) {
    setIsClicked(value);
  }

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function handleMessageClick() {
    setIsMessagesClicked(!isMessagesClicked);

  }

  function handleProceed() {
    setModalOpen(true);
  
  }

  const handleOptionClick = () => {
    setIsChecked(false); // Set checkbox to unchecked state
  };

  // let feedbackMessage = '';
  // if (requestStatus === 'pending') {
  //     feedbackMessage = 'Sending request...';
  // } else if (requestStatus === 'success') {
  //     feedbackMessage = 'Request sent successfully!';
  // } else if (requestStatus === 'error') {
  //     feedbackMessage = 'Error sending request. Please try again.';
  // }

  return (
    <>
      <div className='employee-homepage'>
      <h1>Hello {userName}!</h1>
      <div className='employee-buttons'>
      <Button className="active-button" variant='outline-dark' onClick={() => handleButtonClick('calendar')}>Book holiday</Button>
      <Button className="active-button" variant='outline-dark' onClick={() => handleButtonClick('messages')}>Messages</Button>
      </div>
      </div>
      <nav className='employee-nav'></nav>
      {isClicked === 'messages' && <div className='messages-container'><ChatWindow sender={senderId} receiver={receiverId}/></div>}
      
      <MyModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleClick}
        days={selectedDays}
        message={message}
        onChangeMessage={handleMessageChange}
      />


      {/* ----------------MODAL BOOTSTRAP--------------------- */}
      {/* <Modal show={isModalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your request for days</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <ListGroup>
              {selectedDays.map((day, index) => <ListGroup.Item key={index}>{day.day}-{day.month}-{day.year}</ListGroup.Item>)}
            </ListGroup>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Additional info</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClick}>
            Send request
          </Button>
        </Modal.Footer>
      </Modal> */}
      {/* --------------------MODAL BOOTSTRAP END----------------- */}

      {/* ---------------BURGER MENU START--------------------- */}

      <div className="burger-menu">
      <nav role="navigation">
        <div id="menuToggle">
          <input type="checkbox" id="toggle" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          <label htmlFor="toggle"></label>
          <span className='burger-span'></span>
          <span className='burger-span'></span>
          <span className='burger-span'></span>
          <ul id="menu">
            <li>
              <a href="#" onClick={() => { handleOptionClick(); handleButtonClick("calendar"); }}>
                Book Holiday
              </a>
            </li>
            <li>
              <a href="#" onClick={() => { handleOptionClick(); handleButtonClick("messages"); }}>
                Messages
              </a>
            </li>
            <li>
              <Button variant="dark" href="#" onClick={() => { handleOptionClick(); onLogout(); }}>
                Log out
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </div>

      {/* -------------------BURGER MENU END----------------------- */}
      {isClicked === 'calendar' && (
        <div className="calendar-below"><Calendar
          value={selectedDays}
          onChange={setSelectedDays}
          shouldHighlightWeekends
          minimumDate={utils().getToday()}
          disabledDays={disabledDays}
          renderFooter={() => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem 2rem",
              }}
            >
              <Button
                type="button"
                variant='outline-success'
                onClick={() => {
                  console.log(selectedDays);
                  handleProceed();                  
                  setMessage("");
                }}
                style={{
                  border: "#0fbcf9",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  background: "#0eca2d",
                  colorPrimary: "#EB0000",
                }}
              >
                Proceed
              </Button>
            </div>
          )}
        />
        </div>
      )}
      
      {/* {isClicked && <div>
              <textarea required onChange={handleMessageChange} placeholder="Additional information about your request..." value={message}/>
      </div>} */}
      {/* <div className="calendar-container">
      
        {selectedDays.length > 0 ? <h3>Holiday request for days</h3> : null}
        {selectedDays.map((day) => (
          <li key={day.day}>
            {day.day} - {day.month} - {day.year}
          </li>
        ))}
      </div> */}
    </>
  );
}

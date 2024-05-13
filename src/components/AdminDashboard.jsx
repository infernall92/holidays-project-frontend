import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

import { useState, useEffect } from "react";
import EmployeeListPage from "./EmployeesListPage";
import NewEmployeeForm from "./NewEmployeeForm";
import { useDispatch, useSelector } from "react-redux";
import { requestActions } from "../store/request";
import AdminCalendar from "./AdminCalendar";
import AdminModal from "./AdminModal";
import { toast, Bounce } from "react-toastify";
import AdminEnableCalendar from "./AdminEnableCalendar";
import { sendMessageToDatabase } from "./ChatWindow";

export default function AdminDashboard({ onLogout }) {
  // const [isEmployeeClicked, setIsEmployeeClicked] = useState(false);
  // const [isFormClicked, setIsFormClicked] = useState(false);
  // const [isRequestsClicked, setIsRequestsClicked] = useState(false);
  // const [isCalendarShown, setIsCalendarShown] = useState(false);
  const [isClicked, setIsClicked] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [decline, setDecline] = useState(false);
  const [requestId, setRequestId] = useState();
  const [receiverId, setReceiverId] = useState();
  const [requestDays, setRequestDays] = useState([]);
  const [declineMessage, setDeclineMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [user, setUser] = useState({
    firstName: "",
    lastName: ""
  })

  const dispatch = useDispatch();
  const userName = useSelector((state) => state.login.employeeName);
  const userId = useSelector((state) => state.login.employeeId);

  useEffect(() => {
    // Fetch pending requests from backend when component mounts
    fetchPendingRequests();
    // console.log('useEffect LOG:', pendingRequests)
  }, []);

  async function fetchPendingRequests() {
    try {
      const response = await fetch(
        "http://localhost:5000/admin/pending-requests"
      );
      const data = await response.json();

      // Filter out duplicate requests based on their IDs
      const uniquePendingRequests = data.pendingRequests.reduce(
        (uniqueRequests, currentRequest) => {
          // Check if the current request's ID already exists in the uniqueRequests array
          const existingRequest = uniqueRequests.find(
            (request) => request.id === currentRequest.id
          );
          // If the request ID doesn't exist, add it to the uniqueRequests array
          if (!existingRequest) {
            uniqueRequests.push(currentRequest);
          }
          return uniqueRequests;
        },
        []
      );

      // Filter the unique requests to only include pending ones
      const pendingUniqueRequests = uniquePendingRequests.filter(
        (request) => request.status === "pending"
      );

      setPendingRequests(pendingUniqueRequests);
      console.log("FETCHPENDINGREQUESTS LOG:", pendingUniqueRequests);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
    }
  }
  // ----------- FETCHING USER NAME FOR DISPLAYING IN PENDING REQUESTS------------
  // async function fetchUserName() {
  //   try {
  //     const response = await fetch(

  //     )
  //   } catch (error) {
  //     console.error("Error fetching user name:", error);
  //   }
  // }

  // async function fetchPendingRequests() {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:5000/admin/pending-requests"
  //     );
  //     const data = await response.json();
  //     setPendingRequests(
  //       data.pendingRequests.filter((request) => request.status === "pending")
  //     );
  //     console.log('FETCHPENDINGREQUESTS LOG:', data);
  //   } catch (error) {
  //     console.error("Error fetching pending requests:", error);
  //   }
  // }

  // function handleEmployeeClick() {
  //   setIsEmployeeClicked(!isEmployeeClicked);
  // }
  // function handleFormClick() {
  //   setIsFormClicked(!isFormClicked);
  // }
  // function handleRequestsClick() {
  //   setIsRequestsClicked(!isRequestsClicked);
  //   // fetchPendingRequests();
  // }
  // function handleCalendarClick() {
  //   setIsCalendarShown(!isCalendarShown);
  // }

  function handleClick(value) {
    setIsClicked(value);
    console.log(pendingRequests);
    document.getElementById("toggle").checked = false;
  }

  async function handleApprove(id) {
    // Dispatch action to remove the pending request from the store
    dispatch(requestActions.removePendingRequest(id));
    // Perform additional logic as needed

    try {
      await fetch(`http://localhost:5000/admin/approve-request/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // You can optionally include a request body if needed
        // body: JSON.stringify({ id: id })
      });

      let daysToBeDisabled = pendingRequests.filter(
        (request) => request.id === id
      );
      console.log(daysToBeDisabled[0].days);
      disableDaysOnApproval(daysToBeDisabled[0].days);
      // fetchPendingRequests();
      console.log("Request approved:", id);
      // After approving the request, fetch the updated pending requests
      fetchPendingRequests();
      setModalOpen(false);
      toast.success("Request approved successfully", {
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
    } catch (error) {
      toast.error("Failed to approve the request", {
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
      console.error("Error approving request:", error);
    }
  }

  function disableDaysOnApproval(days) {
    const data = JSON.stringify(days);
    console.log(data);

    // Make a POST request using fetch
    fetch("http://localhost:5000/admin/disable-days", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // setButtonClicked(!buttonClicked);

        return response.json();
      })
      .then((data) => {
        console.log("Response from backend:", data);
      })
      .catch((error) => {
        console.error("Error sending selected days to backend:", error);
      });
  }

  async function handleDecline(id) {
    // Dispatch action to remove the pending request from the store
    dispatch(requestActions.removePendingRequest(id));
    // Perform additional logic as needed
    try {
      await fetch(`http://localhost:5000/admin/pending-requests/${id}`, {
        method: "DELETE",
      });
      console.log("Request declined:", id);
      // After deleting the request, fetch the updated pending requests
      fetchPendingRequests();
      setModalOpen(false);
      toast.success("Request rejected successfully", {
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
    } catch (error) {
      toast.error("Failed to reject the request", {
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
      console.error("Error declining request:", error);
    }
  }

  function handleProceed(decision, requestId) {
    setModalOpen(true);
    setDecline(decision);
    const selectedRequest = pendingRequests.find(
      (request) => request.id === requestId
    );
    if (selectedRequest) {
      setRequestId(selectedRequest.id);
      setReceiverId(selectedRequest.userId);
      setRequestDays(selectedRequest.days);
      console.log("selected request ID:", selectedRequest.id);
      console.log('selected request userid:', selectedRequest.userId);
      console.log('selected request days:', selectedRequest.days);
    }
  }

  function handleOnDecline() {
    setModalOpen(false);
    setDecline(false);
    // fetchPendingRequests();
  }

  function handleConditionally() {
    let messageApprove =
      "Your request for days " +
      requestDays.map((date) => `${date.day} ${date.month} ${date.year}`) +
      " has been approved. ";
    let messageDecline =
      "Your request for days " +
      requestDays.map((date) => `${date.day} ${date.month} ${date.year}`) +
      " has been declined. " +
      declineMessage;

    if (decline) {
      handleDecline(requestId);
      sendMessageToDatabase(userId, userName, receiverId, messageDecline);
    } else {
      handleApprove(requestId);
      sendMessageToDatabase(userId, userName, receiverId, messageApprove);
    }
  }

  function handleDeclineMessage(event) {
    setDeclineMessage(event.target.value);
  }

  function handleModifyDays(value) {
    setIsModified(value);
    setIsClicked('calendar');
  }

  const pendReqBadge = pendingRequests.filter((request) => request.status === "pending")
  .length

  return (
    <>
      <div className="admin">
        {isClicked === "" && (
          <div className="greeting">
            <h1>Hello {userName}</h1>
          </div>
        )}

        {/* ----------------BURGER MENU--------------------- */}
        <div className="burger-menu">
          <nav role="navigation">
            <div id="menuToggle">
              <input type="checkbox" id="toggle" />
              <label htmlFor="toggle"></label>
              <span className='burger-span'></span>
              <span className='burger-span'></span>
              <span className='burger-span'></span>
              <ul id="menu">
                <li>
                  <a href="#" onClick={() => handleClick("requests")}>
                    Pending Requests {pendReqBadge > 0 && <Badge bg="danger">{pendReqBadge}</Badge>}
                    <span className="visually-hidden">pending requests</span>
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleClick("employees")}>
                    Employees
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => handleClick("calendar")}>
                    Calendar
                  </a>
                </li>
                <li>
                  <Button variant="dark" href="#" onClick={onLogout}>
                    Log out
                  </Button>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* -----------------BURGER MENU END------------------------- */}

        <div className="button-container">
          <Button
            variant="outline-dark"
            className="bn5 requests-btn"
            onClick={() => handleClick("requests")}
          >
            Pending Requests {pendReqBadge > 0 && <Badge bg="danger">{pendReqBadge}</Badge>}
          </Button>

          <Button
            variant="outline-dark"
            className="bn5 employees-btn"
            onClick={() => handleClick("employees")}
          >
            Employees
          </Button>

          <Button
            variant="outline-dark"
            className="bn5 calendar-btn"
            onClick={() => handleClick("calendar")}
          >
            Calendar
          </Button>
        </div>
      </div>

      <div className="content-container">
      {isClicked === "requests" && (
          <div className='request-blocks'>
            <h3 className="centered pending-badge">
              <Badge bg="secondary">Pending Holiday Requests</Badge>
            </h3>
            {pendingRequests.filter((request) => request.status === "pending")
              .length > 0 ? (
              pendingRequests.map((request, index) => (
                <div key={`${request.id}-${index}`} className='request-container'>
                <ListGroup className='request-listgroup'>
                <div className='request'>
                  <ListGroup.Item className='request-item'><h6 className='request-key'>Employee ID</h6> <span className='request-value'>{request.userId}</span></ListGroup.Item>
                  <ListGroup.Item className='request-item'>
                  <h6 className='request-key'>Employee Name</h6>  <span className='request-value'>{request.firstName} {request.lastName}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className='request-item'>
                  <h6 className='request-key'>Days</h6> {" "}
                    {request.days.map((day, index) => (
                      <span key={index} className='request-value'>
                        {day.day} - {day.month} - {day.year}
                      </span>
                    ))}
                  </ListGroup.Item>
                  <ListGroup.Item className='request-item'><h6 className='request-key'>Message</h6>  <span className='request-value'>{request.message}</span></ListGroup.Item>
                  <ListGroup.Item className='request-item'><h6 className='request-key'>Status</h6>  <span className='request-value'>{request.status}</span></ListGroup.Item>
                  <ListGroup.Item className='request-item'>

                  <Button
                    className="bn5" variant="danger"
                    onClick={() => handleProceed(true, request.id)}
                  >
                    Refuse
                  </Button>
                  <Button
                    className="bn5" variant="success"
                    onClick={() => handleProceed(false, request.id)}
                  >
                    Approve
                  </Button>
                  </ListGroup.Item>
                  </div>
                  </ListGroup>
                </div>
                
              ))
            ) : (
              <p className="centered">No pending requests</p>
            )}
            <AdminModal
              open={isModalOpen}
              decision={decline}
              onApprove={() => handleConditionally(requestId[0].id)}
              onDecline={handleOnDecline}
              onChangeMessage={handleDeclineMessage}
              message={declineMessage}
            />
          </div>
        )}

        {/* {isClicked === "requests" && (
          <div>
            <h3 className="centered pending-badge">
              <Badge bg="secondary">Pending Holiday Requests</Badge>
            </h3>
            {pendingRequests.filter((request) => request.status === "pending")
              .length > 0 ? (
              pendingRequests.map((request, index) => (
                <div key={`${request.id}-${index}`}>
                  <p>Employee ID : {request.userId}</p>
                  <p>
                    Employee Name: {request.firstName} {request.lastName}
                  </p>
                  <p>
                    Days:{" "}
                    {request.days.map((day, index) => (
                      <li key={index}>
                        {day.day} - {day.month} - {day.year}
                      </li>
                    ))}
                  </p>
                  <p>Message: {request.message}</p>
                  <p>Status: {request.status}</p>
                  <button
                    className="bn5"
                    onClick={() => handleProceed(false, request.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bn5"
                    onClick={() => handleProceed(true, request.id)}
                  >
                    Refuse
                  </button>
                </div>
                
              ))
            ) : (
              <p className="centered">No pending requests</p>
            )}
            <AdminModal
              open={isModalOpen}
              decision={decline}
              onApprove={() => handleConditionally(requestId[0].id)}
              onDecline={handleOnDecline}
              onChangeMessage={handleDeclineMessage}
              message={declineMessage}
            />
          </div>
        )} */}
        {isClicked === "calendar" && (
          <Button
            variant="success"
            className="bn5"
            onClick={() => {
              handleClick("enable");
              setIsModified(true);
              
              }}
          >
            Modify Days
          </Button>
        )}
        {/* {isClicked === "enable" && (
          <Button
            variant="danger"
            className="bn5"
            onClick={() => handleClick("calendar")}
          >
            Disable days
          </Button>
        )} */}
        {isClicked === "employees" && (
          <Button
            variant="outline-dark"
            className="bn5"
            onClick={() => handleClick("form")}
          >
            Add new employee
          </Button>
        )}

        {isClicked === "form" && <NewEmployeeForm />}
        {isClicked === "employees" && <EmployeeListPage />}

        {isClicked === "calendar" && <AdminCalendar />}

        {/* {isClicked === "enable" && <AdminEnableCalendar onModifyDays={handleModifyDays} />} */}
        
        {isClicked === "enable" & isModified ? (
  <AdminEnableCalendar onModifyDays={handleModifyDays} />
) : (
  null
)}
      </div>
    </>
  );
}

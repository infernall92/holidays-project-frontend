/* eslint-disable react/prop-types */

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Alert from 'react-bootstrap/Alert';

import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import { Widget } from "./Widget/Widget.jsx";
import request from "../store/request.js";
import InfoIcon from "./Widget/InfoIcon.jsx";
import RequestsIcon from "./Widget/RequestsIcon.jsx";
import MessagesIcon from "./Widget/MessagesIcon.jsx";

// eslint-disable-next-line react/prop-types
export default function EmployeeDetails({
  firstName,
  lastName,
  id,
  email,
  mobile,
  password,
  children,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [isRequestsClicked, setIsRequestsClicked] = useState(false);
  const [isMessagesClicked, setIsMessagesClicked] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequestsByEmployee() {
      try {
        const response = await fetch(
          `http://localhost:5000/admin/pending-requests?userId=${id}`
        );
        const data = await response.json();

        // Filter out duplicate requests based on their IDs
        const uniqueRequests = data.pendingRequests.reduce(
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

        setRequests(uniqueRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    }
    //   async function fetchRequestsByEmployee() {
    //   try {
    //     const response = await fetch(
    //       `http://localhost:5000/admin/pending-requests?userId=${id}`
    //     );
    //     const data = await response.json();
    //     setRequests(data.pendingRequests);
    //   } catch (error) {
    //     console.error("Error fetching pending requests:", error);
    //   }
    // }
    fetchRequestsByEmployee();
  }, [id]);

  function handleClick() {
    setIsClicked(!isClicked);
  }

  function handleRequestsClick() {
    setIsRequestsClicked(!isRequestsClicked);
    console.log(requests);
    console.log(requests.map((request) => request.id));
  }

  function handleMessagesClick() {
    setIsMessagesClicked(!isMessagesClicked);
  }
  return (
    <>
      {/* <Button variant="outline-dark" className="bn5" onClick={handleClick}>
        {children}
      </Button>
      {isClicked && (
        <div>
          <li>ID: {id}</li>
          <li>First Name: {firstName}</li>
          <li>Last Name: {lastName}</li>
          <li>Email: {email}</li>
          <li>Mobile: {mobile}</li>
          <li>Password: {password}</li>
          <button className="active-button" onClick={handleRequestsClick}>
            {isRequestsClicked ? "Hide requests" : "Show requests"}
          </button>
          {isRequestsClicked && (
            <div>
              {requests[0] ? (
                <h3>Requests</h3>
              ) : (
                <h4>No requests found by this employee</h4>
              )}
              {requests.map((request) => (
                <div key={request.id}>
                  <p>ID: {request.id}</p>
                  <div>
                    <p>Days:</p>
                    {request.days.map((day) => (
                      <ul key={Math.random()}>
                        <li>
                          {day.day}-{day.month}-{day.year}
                        </li>
                      </ul>
                    ))}
                  </div>
                  <p>Status: {request.status}</p>
                </div>
              ))}
            </div>
          )}
          <button className="active-button" onClick={handleMessagesClick}>
            Messages
          </button>
          {isMessagesClicked && <ChatWindow receiver={id} />}
        </div>
      )} */}

      {/* --------------------------------------------------------- */}

      <Tabs
        defaultActiveKey="details"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="details" title={<><InfoIcon /></>}>
          <ListGroup>
          <div className="details">
            <ListGroup.Item className="details-item"><h6 className="details-key">First Name</h6> <span className="details-value">{firstName}</span></ListGroup.Item>
            <ListGroup.Item className="details-item"><h6 className="details-key">Last Name</h6> <span className="details-value">{lastName}</span></ListGroup.Item>
            <ListGroup.Item className="details-item"><h6 className="details-key">Email</h6> <span className="details-value">{email}</span></ListGroup.Item>
            <ListGroup.Item className="details-item"><h6 className="details-key">Mobile</h6> <span className="details-value">0{mobile}</span></ListGroup.Item>
            </div>
          </ListGroup>
        </Tab>
        <Tab eventKey="requests" title={<><RequestsIcon /></>}>
          <ListGroup>
          {!requests[0] ? <Alert key="secondary" variant="secondary">
          No requests were found by this employee
        </Alert> : 
          
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              {requests.map(request => 
              <tbody key={request.id}>
                <tr>
                  <td>{request.id}</td>
                  <td>{request.days.map((day, index) => <li key={index}>{day.day}-{day.month}-{day.year}</li>)}</td>
                  <td>{request.status}</td>
                </tr>
              </tbody>
              )}
              
            </Table>
          }
          </ListGroup>
        </Tab>
        <Tab eventKey="messages" title={<><MessagesIcon /></>}>
          <ChatWindow receiver={id} />
        </Tab>
      </Tabs>
    </>
  );
}

/* eslint-disable react/prop-types */
import { useState } from "react";
import "./Widget.css";
import InfoIcon from "./InfoIcon";
import RequestsIcon from "./RequestsIcon";
import MessagesIcon from "./MessagesIcon";
import ChatWindow from "../ChatWindow";

const buttonWidth = 64;
const tabWidth = 300;
const tabHeaders = [
  { label: "Info", icon: <InfoIcon />},
  {label: "Requests", icon: <RequestsIcon />},
  {label: "Messages", icon: <MessagesIcon />},
];
const tabContent = [];

export const Widget = ({ firstName, lastName, id, email, mobile, requests }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="widget-container">
    <article className="widget">
      <header>
        {tabHeaders.map((tab, index) => (
          <button
            onClick={() => setActiveIndex(index)}
            key={tab.label}
            className={`material-symbols-outlined ${
              activeIndex === index ? "active" : ""
            }`}
          >
            {tab.icon} {/* SVG icon */}
          </button>
        ))}
        <div
          className="underline"
          style={{
            translate: `${activeIndex ? activeIndex * buttonWidth : 0}px 0`,
          }}
        ></div>
      </header>
      <div className="content">
        <div
          className="content-inner"
          style={{
            translate: `-${activeIndex ? activeIndex * tabWidth : 0}px 0`,
          }}
        >
          <div>
            <h2>Details</h2>
            <li>First Name: {firstName}</li>
            <li>Last Name: {lastName}</li>       
            <li>Email: {email}</li>
            <li>Mobile: {mobile}</li>
          </div>
          <div>
            
            {requests[0] ? <h2>Requests</h2> : <h4>No requests found from this employee</h4>}{requests.map(request => 
          <div key={request.id}>
            <p>ID: {request.id}</p>
            <div><p>Days:</p>{request.days.map(day => <ul key={Math.random()}><li>{day.day}-{day.month}-{day.year}</li></ul>)}</div>
            <p>Status: {request.status}</p>
          </div>)}
          </div>
          <div>
            <h2>Messages</h2>
            <ChatWindow receiver={id} />
          </div>
        </div>
      </div>
    </article>
    </div>
  );
};

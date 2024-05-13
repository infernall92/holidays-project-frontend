/* eslint-disable react/prop-types */
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { toast, Bounce } from "react-toastify";


import { useState, useEffect } from 'react';
import Message from './Message';
import { useSelector } from 'react-redux';


export async function sendMessageToDatabase(senderId, senderName, receiverId, message) {
    try {
      if (message.trim() !== '') {
        const response = await fetch('http://localhost:5000/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender_id: senderId,
            sender_name: senderName,
            receiver_id: receiverId,
            message: message
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        const responseData = await response.json();
        console.log('Message sent successfully:', responseData);
        // Optionally, you can return the response data or handle any success actions
        return responseData;
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
      // Optionally, you can handle error cases
      throw error;
    }
  }


export default function ChatWindow ({ sender, receiver }) {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const senderId = useSelector(state => state.login.employeeId);
  const senderName = useSelector(state => state.login.employeeName);
  const receiverId = receiver;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/messages/${senderId}/${receiverId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const responseData = await response.json();
        setMessages(responseData);
      } catch (error) {
        console.error('Error fetching messages:', error);
        // Optionally, you can handle error cases
      }
    };

    fetchMessages();
    

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [senderId, receiverId, messages]);

  async function sendMessageToDatabase() {
    try {
      if (newMessage.trim() !== '') {
        const response = await fetch('http://localhost:5000/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender_id: senderId,
            sender_name: senderName, // Add sender_name
            receiver_id: receiver,
            message: newMessage
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
  
        const responseData = await response.json();
        console.log('Message sent successfully:', responseData);
        
        // Add the new message to the messages state
        setMessages(prevMessages => [...prevMessages, responseData]);
  
        // Clear the input field after sending the message
        setNewMessage('');
        toast.success("Message has been sent.", {
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
  
        // Optionally, you can handle any success actions
        return responseData;
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
      // Optionally, you can handle error cases
      throw error;
    }
  }
  

  function handleInputChange(event) {
    setNewMessage(event.target.value);
  }

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedDate = date.toLocaleDateString('en-GB');
    return formattedTime + ' ' + formattedDate;
  }
  

  return <>
  <div className='chat-container'>
    {!messages[0] ? <Alert key="secondary" variant="secondary">
          No message history was found with this employee
        </Alert> : 
          
            <Table bordered hover >
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>By</th>
                  <th>Message</th>                  
                </tr>
              </thead>
              {messages.map((message, index) => (
          <Message
            key={index}
            message={message.message}
            isSender={message.sender_id === senderId}
            senderName={message.sender_name}
            timestamp={formatTimestamp(message.timestamp)}
          />
        ))}

              
            </Table>
            
          }

      </div>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Type a message..."
          aria-label="Type a message..."
          aria-describedby="basic-addon2"
          onChange={handleInputChange}
          value={newMessage}
        />
        <Button variant="dark" id="button-addon2" onClick={sendMessageToDatabase}>
          Send message
        </Button>
      </InputGroup>
      
    </>
}

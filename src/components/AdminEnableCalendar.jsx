/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';

import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { useState } from "react";
import { toast, Bounce } from "react-toastify";
import AdminCalendar from './AdminCalendar';

export default function AdminEnableCalendar({ onModifyDays }) {

    const [selectedDays, setSelectedDays] = useState([])
    const [buttonClicked, setButtonClicked] = useState(false);
    const [isModified, setIsModified] = useState(false);

    function handleModifyDays(value) {
      setIsModified(value);
      onModifyDays(value);
    }

    function handleEnableDays(daysToDelete) {
        // Assuming dayToDelete is an object with day, month, and year properties
        fetch('http://localhost:5000/admin/delete-disabled-day', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ daysToDelete })
        })
        .then(response => {
            if (!response.ok) {
                console.log('response not okay =', response);
                throw new Error('Network response was not ok');
            }
            console.log('response okay = ', response);
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Log success message
            toast.success('Days enabled successfully', {
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
            // Perform any other actions after successful deletion
        })
        .catch(error => {
            console.error('Error deleting disabled day:', error);
            toast.error('Failed to enable selected days', {
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
            
            // Handle error appropriately
        });
    }

    function handleDisableDays() {
      console.log(selectedDays);
  
      const data = JSON.stringify(selectedDays);
      console.log(data);
  
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
          setButtonClicked(!buttonClicked);
          toast.success('Days disabled successfully', {
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
          return response.json();
        })
        .then((data) => {
          console.log("Response from backend:", data);
        })
        .catch((error) => {
          toast.error('Failed to disable the selected days', {
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
          console.error("Error sending selected days to backend:", error);
        });
    }

    return <>
    <div className='calendar-container'>
      <div className='enable-calender'>
        <Calendar
        value={selectedDays}
        onChange={setSelectedDays}
        colorPrimary="#ffbf00"
        shouldHighlightWeekends
        minimumDate={utils().getToday()}
        // disabledDays={disabledDays}
        renderFooter={() => (<div style={{ display: "flex", justifyContent: "center" }}>
  <div style={{ padding: "1rem 2rem" }}>
    <Button
      variant="success"
      type="button"
      onClick={() => {
        console.log(selectedDays);
        handleEnableDays(selectedDays);
        handleModifyDays(false);
        setSelectedDays([]);
      }}
      style={{
        border: "#0fbcf9",
        color: "#fff",
        borderRadius: "0.5rem",
        padding: "1rem 2rem",
        cursor: "pointer",
        background: "#33d113",
        colorPrimary: "#EB0000",
      }}
    >
      Enable
    </Button>
  </div>

  <div style={{ padding: "1rem 2rem" }}>
    <Button
      variant="danger"
      type="button"
      onClick={() => {
        console.log(selectedDays);
        handleDisableDays();
        handleModifyDays(false);
        setSelectedDays([]);
      }}
      style={{
        border: "#0fbcf9",
        color: "#fff",
        borderRadius: "0.5rem",
        padding: "1rem 2rem",
        cursor: "pointer",
        background: "#EB0000",
        colorPrimary: "#EB0000",
      }}
    >
      Disable
    </Button>
  </div>
</div>

          
        )}
      />
      </div>
      </div>
    </>
}
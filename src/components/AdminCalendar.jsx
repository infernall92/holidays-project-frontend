import Button from 'react-bootstrap/Button';

import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "@hassanmojab/react-modern-calendar-datepicker";
import { toast, Bounce } from "react-toastify";
import { useState, useEffect } from "react";

export default function AdminCalendar() {
  const [selectedDays, setSelectedDays] = useState([]);
  const [disabledDays, setDisabledDays] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  

  useEffect(() => {
    // Fetch disabled days from the backend when the component mounts
    fetchDisabledDays();
  }, [buttonClicked]); // Empty dependency array ensures the effect runs only once on mount

  function fetchDisabledDays() {
    fetch("https://holidays-project-backend.onrender.com/admin/get-disabled-days")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch disabled days");
        }
        return response.json();
      })
      .then((data) => {
        // Update state with fetched disabled days
        setDisabledDays(data.disabledDays);
      })
      .catch((error) => {
        console.error("Error fetching disabled days:", error);
      });
  }

  function disable() {
    console.log(selectedDays);

    const data = JSON.stringify(selectedDays);
    console.log(data);

    fetch("https://holidays-project-backend.onrender.com/admin/disable-days", {
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

  return (
    <>
    <div className='calendar-container'>
      <Calendar
        value={selectedDays}
        onChange={setSelectedDays}
        shouldHighlightWeekends
        minimumDate={utils().getToday()}
        disabledDays={disabledDays}
        // // renderFooter={() => (
        // //   <div
        // //     style={{
        // //       display: "flex",
        // //       justifyContent: "center",
        // //       padding: "1rem 2rem",
        // //     }}
        // //   >
        //     {/* <Button
        //     variant="danger"
        //       type="button"
        //       onClick={() => {
        //         console.log(selectedDays);
        //         disable();
        //         setSelectedDays([]);
        //       }}
        //       style={{
        //         border: "#0fbcf9",
        //         color: "#fff",
        //         borderRadius: "0.5rem",
        //         padding: "1rem 2rem",
        //         cursor: "pointer",
        //         background: "#EB0000",
        //         colorPrimary: "#EB0000",
        //       }}
        //     >
        //       Disable days
        //     </Button> */}
        // //   </div>
        // // )}
      />
      </div>
    </>
  );
}

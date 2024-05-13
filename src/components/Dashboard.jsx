import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import { useDispatch } from "react-redux";
import { loginActions } from "../store/login";

function Dashboard() {

  // useEffect(() => {
  //   toast(`Hello, ${userName}`, {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: false,
  //     draggable: true,
  //     progress: undefined,
  //     theme: "light",
  //     transition: Bounce,
  //     });
  // }, [userName])

  const isAdmin = useSelector((state) => state.login.isAdmin);


  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(loginActions.logout(localStorage.setItem('isLoggedIn', false)));
    if(isAdmin) {
      dispatch(loginActions.isNotAdmin())
    }
    localStorage.setItem("loggedIn", false);
    console.log("local storage state: ", localStorage.getItem("isLoggedIn"));
    console.log("is admin ?", isAdmin);
  }

  return (
    <>
      <div>
        {/* <button className="bn5 bn5-logout" onClick={handleLogout}>Log out</button> */}
        {isAdmin ? <AdminDashboard onLogout={handleLogout} /> : <EmployeeDashboard onLogout={handleLogout} />}
      </div>
    </>
  );
}

export default Dashboard;

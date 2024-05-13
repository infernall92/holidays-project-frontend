/* eslint-disable react/prop-types */
import Button from 'react-bootstrap/Button';

import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../store/login";

function Header({ signedIn }) {

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

    return <>
        <header className={signedIn ? 'left-align' : 'center-align'}>
            <h1>Holidays</h1>
            {signedIn ? <div className="logout-container"><Button className="btn-logout" variant="dark" onClick={handleLogout}>Log out</Button></div> : ''}
        </header>
    </>
}

export default Header;
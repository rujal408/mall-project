import React from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom'

function Nav() {

    return (

        <div className="mav-main">
            <div className="nav-inside">
                <div style={{ float: "left" }}>
                    <AccountCircleIcon style={{ fontSize: "4.5rem" }} />
                </div>
                <div style={{ float: "right", display: "flex" }}>
                    <div className="item">
                        <Link style={{ textDecoration: "none" }} to="/login" onClick={() => localStorage.clear()}>Logout</Link>
                    </div>
                    <div className="item">
                        <Link style={{ textDecoration: "none" }} to="/">Switch to user</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav
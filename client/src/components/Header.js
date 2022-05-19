import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param {Object} props State that was passed down by App (user, setUser)
 * 
 * @returns Navigates to different routers and if the user logs out, redirects to home
 */

function Header(props){

    const [toggleNav, setToggleNav] = useState(false);
    const navigate = useNavigate();

    let handleLogout = (e) => {

        e.preventDefault();
        
        axios.delete('http://localhost:8080/api/auth/logout', {
            withCredentials: true,
        })
        .then(() => {
            props.setUser("");
            navigate('/');
        })
        .catch((err) => {console.log(err)})
    }

    const handleToggle = () => {
        return (toggleNav) ? setToggleNav(false) : setToggleNav(true);
    }

    return (
        <div className="header">
            <div className="header-container">
                <NavLink
                    id={"title"}
                    exact to="/"
                >
                    Mumblr
                </NavLink>
                <div className="toggle-nav" onClick={() => handleToggle()}>
                    <span className="line"></span>
                    <span className="line"></span>
                    <span className="line"></span>
                </div>
            </div>
            
            <div className={`navbar`}>
                {   //if there is no user accessToken
                    (!props.user.accessToken) ? 
                                    <div className={`user-nav ${(toggleNav) ? "toggle" : ""}`}>
                                        <NavLink id="login" exact to="/login">Login</NavLink>
                                        <NavLink id="signup" exact to="/signup">Signup</NavLink>
                                    </div>

                                    :

                                    <div className={`user-nav ${(toggleNav) ? "toggle" : ""}`}>
                                        <NavLink id="home" exact to="/">Home</NavLink>
                                        <NavLink id="dashboard" exact to="/dashboard">Dashboard</NavLink>
                                        <NavLink className="create" exact to="/create">Create Post</NavLink>
                                        <button className="logout" onClick={(e) => handleLogout(e)}>Logout</button>
                                    </div>

                }

            </div>
        </div>
    )
}


export default Header;
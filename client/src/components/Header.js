import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header(props){

    let handleLogout = (e) => {

        e.preventDefault();
        
        axios.delete('http://localhost:8080/api/auth/logout')
        .then((res) => {
            console.log(res);
            props.setUser({});
            window.location.reload();
        })
        .catch((err) => {console.log(err)})
    }

    return (
        <div className="header">
            <NavLink
                id={"title"}
                exact to="/"
            >
            Blog
            </NavLink>
            <div className="navbar">
                
                {   //if there is no user accessToken
                    (!props.user.accessToken) ? 
                                    <div className="user-nav create">
                                        <NavLink id="login" exact to="/login">Login</NavLink>
                                        <NavLink id="signup" exact to="/signup">Signup</NavLink>
                                    </div>

                                    :

                                    <div className="user-nav">
                                        <NavLink id="home" exact to="/">Home</NavLink>
                                        {/* <NavLink id="dashboard" exact to="/dashboard">Dashboard</NavLink> */}
                                        <NavLink className="create" exact to="/create">Create Post</NavLink>
                                        <button className="logout" onClick={(e) => handleLogout(e)}>Logout</button>
                                    </div>

                }

            </div>
        </div>
    )
}


export default Header;
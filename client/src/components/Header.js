import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header(props){


    return (
        <div className="header">
            <NavLink
                id={"title"}
                exact to="/"
            >
            Blog
            </NavLink>
            <div className="navbar">
                
                {   //if there is no user
                    (!props.user) ? 
                                    <div className="user-nav create">
                                        <NavLink id="login" exact to="/login">Login</NavLink>
                                        <NavLink id="signup" exact to="/signup">Signup</NavLink>
                                    </div>

                                    :

                                    <div className="user-nav">
                                        <NavLink id="home" exact to="/">Home</NavLink>
                                        {/* <NavLink id="dashboard" exact to="/dashboard">Dashboard</NavLink> */}
                                        <NavLink className="create" exact to="/create">Create Post</NavLink>
                                        <NavLink className="logout" exact to="/logout">Logout</NavLink>
                                    </div>

                }

            </div>
        </div>
    )
}


export default Header;
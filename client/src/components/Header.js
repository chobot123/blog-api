import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

function Header(){

    return (
        <div className="header">
            <NavLink
                id={"title"}
                exact to="/"
            >
            Blog
            </NavLink>
            <div className="navbar">
                <NavLink
                    className={"login"}
                    exact to="/login"
                >
                Login
                </NavLink>
                <NavLink
                    className={"signup"}
                    exact to="/signup"
                >
                Sign Up
                </NavLink>
            </div>
        </div>
    )
}


export default Header;
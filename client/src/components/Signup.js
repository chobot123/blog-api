import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import '../styles/userAuth.css'

/**
 * 
 * @state [username, setUsername]               Username
 * @state [password, setPassword]               Password
 * @state [confirmPassword, setConfirmPassword] Password confirmation
 * @state [error, setError]                     Errors
 * @returns user can create comment and see list of comments linked to post
 */
function Signup(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    let handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:8080/api/auth/signup',
                {
                    username: username,
                    password: password,
                    confirmPassword: confirmPassword,
                },
            );
            navigate('/login');
            return response.data;
        }
        catch(err){
            if(err.response.status === 409){
                let allErrors = [];
                for(let key in err.response.data) {
                    if(Array.isArray(err.response.data[key])){
                        allErrors = [...err.response.data[key]];
                    }
                    else {
                        allErrors.push(err.response.data[key])
                    }
                }
                setError(allErrors);
            }
            else {
                console.log(err);
            }
        }
    }

    return (
        
        <div className="auth-container">
            <div id="blog-name">Mumblr</div> 
            <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Sign Up</div>
                <ul className="error-list" style={(error) ? {display: "initial"} : {display: "none"}}>
                    {
                        error.map(function(err, index){
                            return <li key={index} id="error">{err.msg}</li>
                        })
                    }
                </ul>
                <div className="form-body">

                    <div id="username container">
                        <label htmlFor="username">Username</label>
                        <input type="text" 
                               id="username" 
                               name="username" 
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>

                    <div id="password container">
                        <label htmlFor="password">Password</label>
                        <input type="password" 
                               id="password" 
                               name="password" 
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>

                    <div id="confirm-password container">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input type="password" 
                               id="confirm-password" 
                               name="confirm-password" 
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               required
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button id="submit-button" type="submit">Sign up</button>
                    <NavLink id="redirect-home"exact to="/">Home</NavLink>
                </div>
                

            </form>
        </div>
    )
}

export default Signup;
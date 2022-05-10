import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/Signup.css'

function Signup(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [error, setError] = useState([]);
    const navigate = useNavigate();

    let handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('http://localhost:8080/api/auth/signup',
                {
                    username: username,
                    password: password,
                    confirmpassword: confirmpassword,
                },
            );
            navigate('/login');
            return response.data;
        }
        catch(err){
            console.log(err.response);
            if(err.response.status === 401 || err.response.status === 409){
                (err.response.data.errors) ? setError([...err.response.data.errors]) : setError([err.response.data.error]);
            }
            else { console.log(err);}
        }
    }

    return (
        
        <div className="signup-container">
            <div id="blog-name">Blog</div> 
            <form className="signup-form" onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Sign Up</div>
                <ul className="error-list"></ul>
                {
                    error.map(function(err, index){
                        return <li key={index} id="error">{err.msg}</li>
                    })
                }
                <div className="form-body">
                    <div id="username container">
                        <label htmlFor="username">Username:</label>
                        <input type="text" 
                               id="username" 
                               name="username" 
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>

                    <div id="password container">
                        <label htmlFor="password">Password:</label>
                        <input type="text" 
                               id="password" 
                               name="password" 
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>

                    <div id="confirm-password container">
                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input type="text" 
                               id="confirm-password" 
                               name="confirm-password" 
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               required
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button id="submit-button" type="submit">Sign up</button>
                    <a href="/" className="redirect-home">Home</a>
                </div>
                

            </form>
        </div>
    )
}

export default Signup;
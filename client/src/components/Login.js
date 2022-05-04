import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(props){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    let handleSubmit =  (e) => {
        e.preventDefault();

        axios.post('http://localhost:8080/api/auth/login', 
        {
            username: username,
            password: password
        }, 
        props.config)
        .then((res) =>{
            console.log(res);
            props.setUser({accessToken: res.data.accessToken});
            navigate('/');
        })
        .catch((err) => {
            if(err.response.status === 401){
                setError({...err.response.data});
            }
            else {
                console.log(err);
            }
        })


    }

    return(
        <div className="login-form">
            <form onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Login</div>
                {
                    error && 
                    <div id="error">
                        {error.message}
                    </div> 
                }
                <div className="form-body">

                    <div id="username-container">
                        <label htmlFor="username">Username:</label>
                        <input type="text"
                               id="username"
                               name="username"
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>

                    <div id="password-container">
                        <label htmlFor="password">Password:</label>
                        <input type="text"
                               id="password"
                               name="password"
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>

                </div>

                <button id="submit-button" type="submit">Login</button>

                <a href="/" className="redirect-home">Home</a>
            </form>
        </div>
    )
}

export default Login;
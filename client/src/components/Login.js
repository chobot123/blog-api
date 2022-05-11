import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/userAuth.css'

function Login(props){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    let handleSubmit =  async (e) => {
        e.preventDefault();

        await axios.post('http://localhost:8080/api/auth/login', 
        {
            username: username,
            password: password,
            withCredentials: true,
        })
        .then((res) =>{
            console.log(res);
            props.setUser(
                {
                    accessToken: res.data.accessToken,
                    id: res.data.user._id,
                });
            navigate('/');
        })
        .catch((err) => {
            
            if(err.response.status === 409){
                setError({...err.response.data});
                console.log(error);
            }
            else {
                console.log(err);
            }
        })


    }

    return(
         <div className="auth-container">
            <div id="blog-name">Blog</div> 
            <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Login</div>
                <ul className="error-list" hidden={(error) ? false : true}>
                    <li id="error">{error.msg}</li>
                </ul>
                <div className="form-body">

                    <div id="username-container">
                        <label htmlFor="username">Username</label>
                        <input type="text"
                               id="username"
                               name="username"
                               onChange={(e) => setUsername(e.target.value)}
                               required
                        />
                    </div>

                    <div id="password-container">
                        <label htmlFor="password">Password</label>
                        <input type="text"
                               id="password"
                               name="password"
                               onChange={(e) => setPassword(e.target.value)}
                               required
                        />
                    </div>

                </div>
                <div className="buttons">
                    <button id="submit-button" type="submit">Login</button>
                    <NavLink id="redirect-home"exact to="/">Home</NavLink>
                </div>
                
            </form>
        </div>
    )
}

export default Login;
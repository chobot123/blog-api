import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/userAuth.css'

/**
 * 
 * @param {Object} props State that was passed down by App (setUser)
 * @state [username, setUsername]   username input
 * @state [password, setPassword]   password input
 * @state [error, setError]         error(s)
 * @returns sets user state and navigates to home
 */
function Login(props){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    let handleSubmit =  async (e) => {
        e.preventDefault();

        await axios.post('/api/auth/login', 
        {
            username: username,
            password: password,
            withCredentials: true,
        })
        /**
         * accessToken,
         * user: {
         *          username: user.username,
         *          _id: user._id,
         * }
         */
        .then((res) =>{
            props.setUser(
                {
                    accessToken: res.data.accessToken,
                    username: res.data.user.username,
                    id: res.data.user._id,
                });
            navigate('/');
        })
        /**
         * Either/and [errors], {error}
         */
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
            <div id="blog-name">Mumblr</div> 
            <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Login</div>
                <ul className="error-list" style={(error) ? {display: "initial"} : {display: "none"}}>
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
                        <input type="password"
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
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Create from './components/Create';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import "./styles/App.css"

function App() {

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  // first thing each mount is I want to check if there is a refresh token
  useEffect(() => {

    async function checkRefreshToken() {

      await axios.post('http://localhost:8080/api/auth/refresh_token')
      .then((token) => {
        console.log(token)
        setUser({
          accessToken: token.data.accessToken,
        })
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
      })
    }

    checkRefreshToken();
  }, [])

  useEffect(() => {
    console.log(user);
  }, [user])

  return (
      <div>
        { (loading) ? <div>Loading...</div> :
            <Router>
              <Header user={user} setUser={setUser}/>
              <Routes>
                <Route
                  exact path='/'
                  element={<Home/>}
                >  
                </Route>
                <Route
                  exact path='/signup'
                  element={<Signup />}
                >
                </Route>
                <Route
                  exact path='/login'
                  element={<Login setUser={setUser}/>}
                > 
                </Route>
                <Route
                  exact path='/create'
                  element={<Create />}
                > 
                </Route>
                <Route
                  exact path='/Dashboard'
                  element={<Dashboard user={user}/>}
                > 
                </Route>
              </Routes>
            </Router>
        }
      </div>
  );
}

export default App;

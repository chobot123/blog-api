import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Create from './components/Create';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import Signup from './components/Signup';
import "./styles/App.css"

function App() {

  const [user, setUser] = useState("");


  return (
    <Router>
        <Header user = {user}/>
        <Routes>
          <Route
            exact path='/'
            element={<Home />}
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
            exact path='/logout'
            element={<Logout />}
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
  );
}

export default App;

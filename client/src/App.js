import React from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import "./styles/App.css"

function App() {

  //user -- initial state is 'no user' (undefined)
  // const [user, setUser] = useState(undefined);

  return (
    <Router>
        <Header/>
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
            element={<Login />}
          > 
          </Route>
        </Routes>
    </Router>
  );
}

export default App;

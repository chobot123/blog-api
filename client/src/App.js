import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Create from './components/Create';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Post from './components/Post';
import Signup from './components/Signup';
import "./styles/App.css"

function App() {

  //user => OBJ that's going to hold the access Token
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['authorization'] = 'Bearer ' + user.accessToken;

  // first thing each mount is I want to check if there is a refresh token
  useEffect(() => {

    async function checkRefreshToken() {
      await axios.post('http://localhost:8080/api/auth/refresh_token')
      .then((token) => {
        setUser({
          accessToken: token.data.accessToken,
          id: token.data.user._id,
        })
      })
      .catch((err) => {
        console.log(err)
      })
    }

    async function getPosts() {
      await axios.get('http://localhost:4000/api/posts/')
      .then((res) => {
        setPosts(res.data)
        setLoading(false);
      })
      .catch((err) => {console.log(err)})
    }

    checkRefreshToken();
    getPosts();
    
  }, [])

  //check for ALL POSTS on mount
  useEffect(() => {
    console.log(posts);
  }, [posts])

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
                  element={<Home posts={posts}/>}
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
                  element={<Create user={user} />}
                > 
                </Route>
                <Route
                  exact path='/dashboard'
                  element={<Dashboard user={user} posts={posts} setPosts={setPosts}/>}
                > 
                </Route>
                {posts.map((post) => 
                    <Route
                        key={post._id}
                        exact path={'/posts/post/' + post._id}
                        element={<Post />}
                    >
                    </Route>
                  )
                }
              </Routes>
            </Router>
        }
      </div>
  );
}

export default App;

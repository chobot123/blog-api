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

/**
 * 'Main' function that holds all routers to different pages
 * 
 * @state [user, setUser] Current user
 * @state [posts, setPosts] All posts
 * @state [loading, setLoading] 
 * @returns <Header> with different 'body' routers (default '/' -> home)
 */
function App() {

  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);

  //Set credentials and headers (to send access and refresh tokens)
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['authorization'] = 'Bearer ' + user.accessToken;

  /**
   * Intercepts the 'verifyToken' middleware from server and if
   * there is an error, verifies if there is a valid refresh token, and if so,
   * updates parameters, and sends said parameters back with the original HTTP request
   */
  axios.interceptors.response.use((response) => {
    return response;
  }, async (error) => {
    const originalRequest = error.config;
    if(error.response.status === 401) {
      return  await axios.post('http://localhost:8080/api/auth/refresh_token')
              .then((res) => {
                if(res.status === 200) {
                  setUser({
                    accessToken: res.data.accessToken,
                    id: res.data.user._id,
                  })
                  originalRequest.headers['authorization'] = 'Bearer ' + res.data.accessToken;
                  return axios.request(originalRequest);
                }
              })
    }
    else {
      throw error;
    }
  });

  // Verify refresh token and update state on mount
  useEffect(() => {

    async function checkRefreshToken() {
      await axios.post('http://localhost:8080/api/auth/refresh_token')
      .then((token) => {
        if(!token.data.user){
          setUser({
            accessToken: "",
            username: "",
            id: ""
          })
        }
        else {
          setUser({
            accessToken: token.data.accessToken,
            id: token.data.user._id,
            username: token.data.user.username,
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

    checkRefreshToken(); 

  }, [])

  //update posts when posts changes
  useEffect(() => {

    async function getPosts() {
      await axios.get('http://localhost:4000/api/posts/')
      .then((res) => {
        setPosts(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }

    getPosts();

  }, [posts.length])

  useEffect(() => {
    console.log(user);
  }, [user])

  //-------- SET HANDLERS --------//
  const setPostsHandler = (value) => {
    setPosts(prevState => [...prevState, value]);
  }

  const setUserHandler = (value) => {
    setUser(value);
  }

  return (
      <div className='content'>
            <Router>
              <Header user={user} setUser={setUserHandler}/>
              <Routes>
                <Route
                  exact path='/'
                  element={<Home user={user} posts={posts}/>}
                >  
                </Route>
                <Route
                  exact path='/signup'
                  element={<Signup />}
                >
                </Route>
                <Route
                  exact path='/login'
                  element={<Login setUser={setUserHandler}/>}
                > 
                </Route>
                <Route
                  exact path='/create'
                  element={<Create user={user} posts={posts} setPosts={setPostsHandler}/>}
                > 
                </Route>
                <Route
                  exact path='/dashboard'
                  element={<Dashboard user={user} posts={posts} setPosts={setPostsHandler}/>}
                > 
                </Route>
                {posts.length>0 && posts.map((post) => 
                    <Route
                        key={post._id}
                        exact path={'/posts/' + post._id}
                        element={<Post post={post} user={user} posts={posts} setPosts={setPostsHandler}/>}
                    >
                    </Route>
                  )
                }
              </Routes>
            </Router>
      </div>
  );
}

export default App;

import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import '../styles/home.css';
import homeImg from "../images/homeimage.png"

/**
 * 
 * @param {Object} props State that was passed down by App (user, posts)
 * @returns Lists all posts and navigates to post on click
 */
function Home(props) {

    const navigate = useNavigate();

    const handleNavigatePost = (post) => {

        return navigate('/posts/' + post._id);
    }

    const handleNavigateSignup = (e) => {
        e.preventDefault();
        return navigate('/signup');
    }

    return (
        <div className="home-page">
            <div className="page-description">
                <div className="page-intro">
                    <div id="blog-title">Mumblr</div>
                    <p id="blog-description">
                        Chat away aimlessly on Mumblr today! Feel free to 
                        post whatever you want and let others chime in. 
                    </p>
                    <button id="sign-up" onClick={(e) => handleNavigateSignup(e)} style={(props.user.username !== "") ? {display: "none"} : {display: "inline"}}>Signup Now! &rarr;</button>
                </div>
                <img src={homeImg} alt="coffee-img" />
            </div>
            <div className="posts">
                {props.posts.filter((post) => post.published).map((post, index) => 
                    <div className="post-card" key={post._id} style={(index % 2 === 0) ? {justifyContent:"flex-start"} : {justifyContent: "flex-end"}}>
                        <div className={(index % 2 === 0) ? "card even" : "card odd"} onClick={() => handleNavigatePost(post)}>
                            <div id="published-date">{moment(post.timestamp).format('l')}</div>
                            <div id="title">{post.title}</div>
                            <div id="user">{post.user.username}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;
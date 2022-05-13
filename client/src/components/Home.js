import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import '../styles/home.css';
import homeImg from "../images/homeimg.jpg"

function Home(props) {

    const navigate = useNavigate();

    const handleNavigate = (post) => {

        return navigate('/posts/' + post._id);
    }

    return (
        <div className="home-page">
            <div className="page-description">
                <div className="page-intro">
                    <div id="blog-title">Mumblr</div>
                    <p id="blog-description">
                        Share and partake in the hottest new fads in tech, finance, fashion, and much more! 
                    </p>
                </div>
                <img src={homeImg} alt="coffee-img" />
            </div>
            <div className="posts">
                {props.posts.filter((post) => post.published).map((post, index) => 
                    <div className="post-card" key={post._id} style={(index % 2 === 0) ? {justifyContent:"flex-start"} : {justifyContent: "flex-end"}}>
                        <div className={(index % 2 === 0) ? "card even" : "card odd"} onClick={() => handleNavigate(post)}>
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
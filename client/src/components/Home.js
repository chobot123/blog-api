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
                        Join other experts today as the thought leader in your industry as Mumblr helps you share and partake in the
                        latest developments in tech, finance, and much more ALL across the globe.
                    </p>
                </div>
                <img src={homeImg} alt="coffee-img" />
            </div>
            <div className="posts">
                {props.posts.map((post) => 
                    <div className="post-card" key={post._id}>
                        <div 
                            id="card"
                            onClick={() => handleNavigate(post)}
                        >
                            <div className="post-card">
                                <div id="title">{post.title}</div>
                                <div id="created">{`By ${post.user.username} on ${moment(post.timestamp).format('llll')}`}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home;
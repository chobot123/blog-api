import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function Home(props) {

    const navigate = useNavigate();

    const handleNavigate = (post) => {

        return navigate('/posts/' + post._id);
    }

    return (
        <div className="home-page">
            <div className="page-description">

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
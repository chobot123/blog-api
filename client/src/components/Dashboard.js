// import React, { useEffect } from "react";
// import { useState } from "react";
import { NavLink } from "react-router-dom";
import moment from "moment";
import axios from "axios";
// import { useEffect } from "react";

function Dashboard (props) {
    
    
    let updateStatus = (post, status) => {

        let posts = props.posts;
        posts.map((oldPost) => {
            if(oldPost === post){
                return oldPost.published = status;
            }
            return oldPost;
        })

        props.setPosts(posts);
    }

    //display if there are any published/unpublished posts
    let toggleStatus = (e, post) => {
        
        e.preventDefault();

        //if the post isn't published -> publish, else vice versa
        if(!post.published){
            axios.post(`http://localhost:4000/api/posts/${post._id}/publish`, {
                headers: {
                    "authorization": 'Bearer ' + props.user.accessToken
                },
                withCredentials: true,
            })
            .then((res) => {
                updateStatus(post, res.data);
                console.log(props.posts);
            })
            .catch((err) => console.log(err))
        }

        else {
            axios.post(`http://localhost:4000/api/posts/${post._id}/unpublish`,
            {
                headers: {
                    "authorization": props.user.accessToken
                }
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => console.log(err))
        }
    }

    return(
        <div className="dashboard">
            <div id="title">My Dashboard</div>
            <div className="posts published">
                <div id="section-header">Published Posts</div>
                {
                    props.posts.filter((post) => 
                        post.user._id === props.user.id && post.published
                        ).map((post) => (
                            <div className="post-card" key={post._id}>
                                <NavLink 
                                    id="post-nav"
                                    exact to={'posts/post/' + post._id}
                                >
                                    <div className="post-card">
                                        <div id="title">{post.title}</div>
                                        <div id="created">{`By ${post.user.username} on ${moment(post.timestamp).format('llll')}`}</div>
                                    </div>
                                </NavLink>
                                <button id="toggle-status" onClick={(e) => toggleStatus(e, post)}>Unpublish</button>
                            </div>
                        )
                    )
                }
            </div>
            <div className="posts unpublished">
                <div id="section-header">Unpublished Posts</div>
                {
                    props.posts.filter((post) => 
                        post.user._id === props.user.id && !post.published
                        ).map((post) => (
                            <div className="post-card" key={post._id}>
                                <NavLink 
                                    id="card"
                                    exact to={'posts/post/' + post._id}
                                >
                                    <div className="post-card">
                                        <div id="title">{post.title}</div>
                                        <div id="created">{`By ${post.user.username} on ${moment(post.timestamp).format('llll')}`}</div>
                                    </div>
                                </NavLink>
                                <button id="toggle-status" onClick={(e) => toggleStatus(e, post)}>Publish</button>
                            </div>
                        ))
                }
            </div>
        </div>
    )
}

export default Dashboard;
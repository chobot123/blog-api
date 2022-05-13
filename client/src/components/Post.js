import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import Update from "./Update";
import '../styles/post.css'

function Post (props){

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [update, setUpdate] = useState(false);
    const [post, setPost] = useState(props.post);

    //CONSIDER CHANGING IF USER IS --NOT-- SIGNED IN
    const [username, setUsername] = useState(props.user.username);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:4000/api/posts/${post._id}/comments/create`,
            {
                headers: {
                    "authorization": props.user.accessToken,
                },
                withCredentials: true,
                text: comment,
                username: username,
            }
        )
        .then((res) => {
            console.log(res.data);
            setComments(prev => [...prev, res.data])
        })
        .catch((err) => console.log(err))
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        setUpdate(true);
    }

    useEffect(() => {

        axios.get(`http://localhost:4000/api/posts/${post._id}/comments/`,
        {
            withCredentials: true,
        })
        .then((response) => {
            setComments(response.data);
        })
        .catch((err) => console.log(err))
    }, [post])

    useEffect(() => {
        console.log(comments);
        let hidden = comments;
        (hidden.length > 0) ? console.log(true) : console.log(false);
    }, [comments])

    return (
        <div className="post-container">
            {(update) ? 
                    <Update post={post} setPost={setPost} setUpdate={setUpdate} user={props.user}/> 
                    :
                    <div className="post-content">
                    <div id="title">{post.title}
                    <div id="published">By {post.user.username} on {moment(post.timestamp).format('llll')}</div>
                        <div className="update-post" hidden={(props.user.id === post.user._id) ? false : true}>
                            <button id="edit-button" onClick={(e) => handleUpdate(e)}>EDIT</button>
                            <button id="delete-button">DELETE</button>
                        </div>
                    </div>
                    <div id="text" dangerouslySetInnerHTML={{__html: post.text}}/>
                </div>
            }
            <div className="post-comments"> Comments:
                <div id="no-comment" style={(comments.length>0) ? {visibility: "collapse"} : {visibility: "visible"}}>Be the First Comment!</div>
                <div className="comment-section">
                    {
                        comments.map((comment) => (
                            <div className="comment-card" key={comment._id}>
                                <div id="comment-user">{comment.username}</div>
                                <div id="comment-body">{comment.text}</div>
                                <div id="comment-published">{moment(comment.timestamp).format('llll')}</div>
                            </div>
                        ))
                    }
                </div>
                <form className="comment-form"
                      onSubmit={(e) => handleFormSubmit(e)}        
                >   
                    <div className="user-info" hidden={(props.user.accessToken !== "")? true : false}>
                        <label htmlFor="user">Username:</label>
                        <input type="text"
                               id="username" 
                               name="username"
                               onChange={(e) => setUsername(e.target.value)}
                               required={(!props.user) ? true : false}
                        />
                    </div>
                    <label htmkFor="comment">Comment: </label>
                    <input    id="comment" 
                              type="text"
                              name="comment"
                              onChange={(e) => setComment(e.target.value)}
                              required
                              placeholder="Write Your Comment Here..."/>                 
                    <button id="submit-comment" type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}

export default Post;
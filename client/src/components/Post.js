import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";

function Post (props){

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [username, setUsername] = useState(props.user.username);

    const handleFormSubmit = (e) => {
        
        e.preventDefault();
        
        axios.post(`http://localhost:4000/api/posts/${props.post._id}/create`,
            {
                headers: {
                    "authorization": props.user.accessToken,
                },
                withCredentials: true,
                text: comment,
                username: username,
            }
        )
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
    }

    useEffect(() => {

        axios.get(`http://localhost:4000/api/posts/${props.post._id}/`,
        {
            withCredentials: true,
        })
        .then((response) => {
            setComments(response.data);
        })
        .catch((err) => console.log(err))
    }, [props.post._id])

    useEffect(() => {
        console.log(username);
    }, [username])

    return (
        <div className="post-container">
            <div className="post-content">
                <div id="title">{props.post.title}</div>
                <div id="published">By {props.post.user.username} on {moment(props.post.timestamp).format('llll')}</div>
                <div id="text" dangerouslySetInnerHTML={{__html: props.post.text}}/>
            </div>
            <div className="post-comments"> Comments 
                <form className="comment-form"
                      onSubmit={(e) => handleFormSubmit(e)}        
                >   
                    <div className="user-info" hidden={(props.user)? true : false}>
                        <label htmlFor="user">Username:</label>
                        <input type="text"
                               id="username" 
                               name="username"
                               onChange={(e) => setUsername(e.target.value)}
                               required={(props.user) ? false : true}
                        />
                    </div>
                    <textarea id="comment" 
                              name="comment"
                              onChange={(e) => setComment(e.target.value)}
                              rows="5" 
                              required
                              placeholder="Write Your Comment Here..."/>                 
                    <button type="submit">Comment</button>
                </form>
                <div className="comments" hidden={(!comments) ? true: false}>
                    {/* {
                        comments.map((comment) => (
                            <div className="comment-card" key={comment._id}>
                                <div id="publisher">{comment.username}</div>
                                <div id="comment">{comment.text}</div>
                                <div id="date">{moment(comment.timestamp).format('llll')}</div>
                            </div>
                        ))
                    } */}
                </div>
            </div>
        </div>
    )
}

export default Post;
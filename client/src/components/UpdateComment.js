import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param {Object} props State that was passed down by App (post, setPost, setUpdate, user)
 * @state [title, setTitle]               Username
 * @state [body, setBody]               Password
 * @returns Updated post 
 */
function UpdateComment(props){

    const [updateBody, setUpdateBody] = useState(props.post.text);
    const navigate = useNavigate();

    const handleCancel = (e) => {
        e.preventDefault();
        props.setToggleUpdate(false);
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        //submit post data to server
        axios.put(`http://localhost:4000/api/posts/${props.post._id}/comments/${props.comment._id}/edit`, {
            headers: {
                "authorization": props.user.accessToken
            },
            withCredentials: true,
            text: updateBody,
        })
        /**
         * {
 *             title: req.body.title,
               user: req.authData._id,
               text: req.body.text, 
               published: req.body.published,
               _id: req.params.id,
            }
         */
        .then((res) => {
            props.setUpdateComment(false);
            props.setPost(res.data);
        })
        .catch(() => {
            navigate('/');
        })

    }

    return (
        <div className="update">
            <form className="update-post-form" onSubmit={(e) => handleSubmit(e)}>
            <div className="user-info" >
                        <label htmlFor="comment">Comment: </label>
                        <input      id="comment" 
                                    type="text"
                                    name="comment"
                                    defaultValue={props.post.text}
                                    onChange={(e) => setUpdateBody(e.target.value)}
                                    required
                        />             
                    </div>
                <div className="buttons">
                    <button type="submit" id="submit-button">Update</button>
                    <button id="clear-content" onClick={(e) => handleCancel(e)}>Cancel</button>
                </div>
                
            </form>
        </div>
    )
}

export default UpdateComment;
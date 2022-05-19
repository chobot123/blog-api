import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import UpdatePost from "./UpdatePost";
import UpdateComment from "./UpdateComment";
import '../styles/post.css'
import { useNavigate } from "react-router-dom";
/**
 * 
 * @param {Object} props State that was passed down by App (post, user, posts, setPosts)
 * @state [comment, setComment]                         Comment input
 * @state [comments, setComments]                       Comment list
 * @state [toggleUpdatePost, setToggleUpdatePost]       Toggle for user updating post
 * @state [toggleUpdateComment, setToggleUpdateComment] Toggle for user updating comment
 * @state [post, setPost]                               The post
 * @returns user can create comment and see list of comments linked to post
 */
function Post (props){

    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [toggleUpdatePost, setToggleUpdatePost] = useState(false);
    const [toggleUpdateComment, setToggleUpdateComment] = useState("");
    const [post, setPost] = useState(props.post);

    const navigate = useNavigate();

    const handleCreateComment = (e) => {
        
        e.preventDefault();
        axios.post(`/api/posts/${post._id}/comments/create`,
            {
                headers: {
                    "authorization": props.user.accessToken,
                },
                withCredentials: true,
                text: comment,
                username: props.user.username,
            }
        )
        /**
         * {
 *           username: req.body.username,
 *           text: req.body.text,
 *           post: req.params.post_id,
 *           timestamp: Date.now(),
 *       }
         */
        .then((res) => {
            setComments(prev => [...prev, res.data])
            e.target.reset();
        })
        .catch((err) => console.log(err))
    }

    //------------HANDLE UPDATES------------//

    const handleUpdatePost = (e) => {
        e.preventDefault();
        setToggleUpdatePost(true);
    }

    const handleUpdateComment = (e, id) => {
        e.preventDefault();

        setToggleUpdateComment(id);
    }

    //------------HANDLE DELETES------------//

    //helper function for updating posts after deletion 
    const updatePosts = () => {
        let posts = [...props.posts].filter((currentPost) => currentPost._id !== post._id);
        props.setPosts(posts);
    }

    const handleDeletePost = (e) => {
        e.preventDefault();

            axios.delete(`/api/posts/${post._id}`, 
            {
                withCredentials: true,
            })
            .then(() => {
                updatePosts();
                navigate('/dashboard')
            })
            .catch((err) => console.log(err))
    }
    
    const handleDeleteComment = (e, id) => {
        e.preventDefault();
        
        axios.delete(`/api/posts/${post._id}/comments/${id}/delete`,
        {
            withCredentials: true,
        })
        .then(() => {
            setComments(prevState => (prevState.filter(thisComment => thisComment._id !== id)))
        })
        .catch((err) => {
            console.log(err);
        })
    }

    //Get all Comments (and update when a comment is updated/deleted)
    useEffect(() => {
        axios.get(`/api/posts/${post._id}/comments/`,
        {
            withCredentials: true,
        })
        .then((response) => {
            setComments(response.data);
        })
        .catch((err) => console.log(err))
    }, [post._id, toggleUpdateComment])

    //Get Post (and update when the post is updated)
    useEffect(() => {
        axios.get(`/api/posts/${post._id}`,
        {
            withCredentials: true,
        })
        .then((response) => {
            setPost(response.data);
        })
        .catch((err) => console.log(err))
    }, [post._id, toggleUpdatePost])

    //---------- SET HANDLERS ----------//

    const handleToggle = (type, value) => {
        if(type === "comment"){
            setToggleUpdateComment(value);
        }
        else if(type === "post") {
            setToggleUpdatePost(value);
        }
    }

    const postSetter = (value) => {
        setPost(value);
    }

    return (
        <div className="post-container">

            {(toggleUpdatePost) ? 
                    <UpdatePost post={post} setPost={postSetter} handleToggle={handleToggle} user={props.user}/> 
                    :
                    <div className="post-content">
                    <div id="title">{post.title}
                    <div id="published">By {post.user.username} on {moment(post.timestamp).format('llll')}
                    </div>
                        <div className="update-post-buttons" style={(props.user.id === post.user._id) ? {display: "flex"} : {display: "none"}}>
                            <button id="edit-button" onClick={(e) => handleUpdatePost(e)}>&#9997;</button>
                            <button id="delete-button" onClick={(e) => handleDeletePost(e)}>&#x1f5d1;</button>
                        </div>
                    </div>
                    <div id="text-container">
                        <div id="text-border-left">
                            <div id="text-border-right" dangerouslySetInnerHTML={{__html: post.text}}></div>
                        </div>
                    </div>
                </div>
            }

            <div className="post-comments"> Comments:
                <div id="no-comment" style={(comments.length>0) ? {display: "none"} : {display: "flex"}}>Be the First Comment!</div>
                <div className="comment-section">
                    {
                        comments.map((comment, index) => (
                            (toggleUpdateComment === comment._id) ? <UpdateComment comment={comment} post={post} 
                                                                        user={props.user} handleToggle={handleToggle}/> :
                            <div className={(index % 2 === 0) ? "comment-card start" : "comment-card end"} key={comment._id}>
                                <div className="comment-user">{comment.username}
                                    <div className="comment-buttons-container"
                                        style={(props.user.username !== comment.username)? {display: 'none'} : {display: 'flex'}}
                                    >
                                        <button id="edit-comment-button" onClick={(e) => handleUpdateComment(e, comment._id)} >&#128393;</button>
                                        <button id="delete-comment-button" onClick={(e) => handleDeleteComment(e, comment._id)}>&#xd7;</button>
                                    </div>                                    
                                </div>
                                <div id="comment-body">{comment.text}</div>
                                <div id="comment-published">{moment(comment.timestamp).format('llll')}</div>
                            </div>
                        ))
                    }
                </div>
                <form className="comment-form"
                      onSubmit={(e) => handleCreateComment(e)}        
                      style={(!props.user.username)? {display: 'none'} : {display: 'flex'}}
                >
                    <div className="user-info" >
                        <label htmlFor="comment">Comment: </label>
                        <input      id="comment" 
                                    type="text"
                                    name="comment"
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    placeholder="Write Your Comment Here..."/>             
                    </div>
                        
                    <button id="submit-comment" type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}

export default Post;
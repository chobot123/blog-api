import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css'

/**
 * 
 * @param {Object} props State that was passed down by App (user, posts, setPosts)
 * @returns Redirects to the post url on click, or publish/unpublish post
 */

function Dashboard (props) {
    
    const navigate = useNavigate();

    const handleNavigate = (e, post) => {
        e.preventDefault();

        //Disable going to post url if it is the toggle publish/unpublish button
        if(e.target.id === "toggle-status") {return}
        return navigate('/posts/' + post._id);
    }
    

    const updateStatus = (post, status) => {

        let posts = [...props.posts];
        posts.map((oldPost) => {
            if(oldPost === post){
                return oldPost.published = status;
            }
            return oldPost;
        })

        props.setPosts(posts);
    }

    //display if there are any published/unpublished posts
    const toggleStatus = (e, post) => {
        
        e.preventDefault();

        //if the post is unpublished -> publish, else vice versa
        if(!post.published){
            axios.post(`http://localhost:4000/api/posts/${post._id}/publish`, {
                headers: {
                    "authorization": 'Bearer ' + props.user.accessToken
                },
                withCredentials: true,
            })
            /**
             * Receives res.data = {
             *                          false/true 
             *                      }
             */
            .then((res) => {
                updateStatus(post, res.data);
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
            /**
             * Receives res.data = {
             *                          false/true 
             *                      }
             */
            .then((res) => {
                updateStatus(post, res.data);
            })
            .catch((err) => console.log(err))
        }
    }

    return(
        <div className="dashboard">
            <div id="title">My Dashboard ({props.user.username})</div>
            <div className="posts published">
                <div id="section-header">Published Posts</div>
                {
                    (props.posts.length>0 && props.posts.filter((post) => post.user._id === props.user.id && post.published)
                        .length === 0) ? <div id="empty-message">No Published Posts Yet!</div> :
                        <div className="cards">
                            {props.posts.length>0 && props.posts.filter((post) => 
                                post.user._id === props.user.id && post.published
                                ).map((post) => (
                                    <div className="post-card" key={post._id} onClick={(e) => handleNavigate(e, post)}>
                                        <div 
                                            id="card"
                                        >
                                            <div className="post-info">
                                                <div id="title">{post.title}</div>
                                                <div id="created">{moment(post.timestamp).format('llll')}</div>
                                            </div>
                                        </div>
                                        <button id="toggle-status" onClick={(e) => toggleStatus(e, post)}>Unpublish</button>
                                    </div>
                                )
                            )}
                    </div>
                }   
            </div>
            <div className="posts unpublished">
                <div id="section-header">Unpublished Posts</div>
                {
                    (props.posts.length>0 && props.posts.filter((post) => post.user._id === props.user.id && !post.published)
                        .length === 0) ? <div id="empty-message">No Unpublished Posts Yet!</div> :
                        <div className="cards">
                            {props.posts.length>0 && props.posts.filter((post) => 
                                post.user._id === props.user.id && !post.published
                                ).map((post) => (
                                    <div className="post-card" key={post._id} onClick={(e) => handleNavigate(e, post)}>
                                        <div 
                                            id="card"
                                        >
                                            <div className="post-info">
                                                <div id="title">{post.title}</div>
                                                <div id="created">{moment(post.timestamp).format('llll')}</div>
                                            </div>
                                        </div>
                                        <button id="toggle-status" onClick={(e) => toggleStatus(e, post)}>Publish</button>
                                    </div>
                                )
                            )}
                    </div>
                }
            </div>
        </div>
    )
}

export default Dashboard;
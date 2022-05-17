import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * 
 * @param {Object} props State that was passed down by App (post, setPost, setUpdatePost, user)
 * @state [title, setTitle]               Username
 * @state [body, setBody]                 Password
 * @returns Updated post 
 */
function UpdatePost(props){

    const [updateTitle, setUpdateTitle] = useState(props.post.title);
    const [updateBody, setUpdateBody] = useState(props.post.text);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const handleCancel = (e) => {
        e.preventDefault();
        props.setToggleUpdatePost(false);
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        //submit post data to server
        axios.put('http://localhost:4000/api/posts/' + props.post._id + "/edit", {
            headers: {
                "authorization": props.user.accessToken
            },
            withCredentials: true,
            title: updateTitle,
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
            props.setUpdatePost(false);
            props.setPost(res.data);
        })
        .catch(() => {
            navigate('/');
        })

    }

    return (
        <div className="update-post-container">
            <form className="update-post-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-body">
                    <div id="post-title">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" defaultValue={updateTitle} required onChange={(e) => setUpdateTitle(e.target.value)}/>
                    </div>
                    <div id="post-content">
                        <label htmlFor="content">Content:</label>
                        <Editor apiKey="odysb9itemhhioc0e9wswexnphs05fmqjao24y5ul5el42z5"
                            onEditorChange={(e) => setUpdateBody(e)}
                            onInit={(evt, editor) => editorRef.current = editor}
                            name="content"
                            id="content"
                            required
                            value={updateBody}
                            init={{
                            height: 400,
                            menubar: false,
                            plugins: 'a11ychecker advcode casechange export formatpainter image editimage linkchecker autolink lists checklist media mediaembed pageembed permanentpen powerpaste table advtable tableofcontents tinymcespellchecker',
                            toolbar: 'undo redo | formatselect | ' +
                            'bold italic backcolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    </div>
                </div>
                <div className="buttons">
                    <button type="submit" id="submit-button">Update</button>
                    <button id="clear-content" onClick={(e) => handleCancel(e)}>Cancel</button>
                </div>
                
            </form>
        </div>
    )
}

export default UpdatePost;
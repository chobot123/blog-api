import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Update(props){

    const [title, setTitle] = useState(props.post.title);
    const [body, setBody] = useState(props.post.text);
    const editorRef = useRef(null);
    const navigate = useNavigate();

    const handleCancel = (e) => {
        props.setUpdate(false);
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        //submit post data to server
        axios.put('http://localhost:4000/api/posts/' + props.post._id + "/edit", {
            headers: {
                "authorization": props.user.accessToken
            },
            withCredentials: true,
            title: title,
            text: body,
            published: props.post.published,
        })
        .then((res) => {
            props.setUpdate(false);
            props.setPost(res.data);
        })
        .catch(() => {
            navigate('/');
        })

    }

    return (
        <div className="Update">
            <form className="update-post-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-body">
                    <div id="post-title">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" defaultValue={title} required onChange={(e) => setTitle(e.target.value)}/>
                    </div>
                    <div id="post-content">
                        <label htmlFor="content">Content:</label>
                        <Editor apiKey="odysb9itemhhioc0e9wswexnphs05fmqjao24y5ul5el42z5"
                            onEditorChange={(e) => setBody(e)}
                            onInit={(evt, editor) => editorRef.current = editor}
                            name="content"
                            id="content"
                            required
                            value={body}
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
                <button type="submit" id="submit-button">Update</button>
            </form>
            <button id="clear-content" onClick={(e) => handleCancel(e)}>Cancel</button>
        </div>
    )
}

export default Update;
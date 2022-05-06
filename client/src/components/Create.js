import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create(props){

    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const navigate = useNavigate();

    const editorRef = useRef(null);

    let handleSubmit = (e) => {

        e.preventDefault();

        //submit post data to server
        axios.post('http://localhost:4000/api/posts/', {
            headers: {
                "authorization": props.user.accessToken
            },
            withCredentials: true,
            title: postTitle,
            text: postContent,
        })
        .then(() => {
            props.setNav(true);
            navigate('/dashboard')

        })
        .catch((err) => {
            console.log(err);
        })

    }
    return (
        <div className="Create">
            <form className="create-post-form" onSubmit={(e) => handleSubmit(e)}>
                <div id="form-title">Create Blog Post</div>
                <div className="form-body">
                    <div id="post-title">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" required onChange={(e) => setPostTitle(e.target.value)}/>
                    </div>
                    <div id="post-content">
                        <label htmlFor="content">Content:</label>
                        <Editor apiKey="odysb9itemhhioc0e9wswexnphs05fmqjao24y5ul5el42z5"
                            onEditorChange={(e) => setPostContent(e)}
                            onInit={(evt, editor) => editorRef.current = editor}
                            name="content"
                            id="content"
                            required
                            initialValue=""
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
                <button type="submit" id="submit-button">Post</button>
                <button id="clear-content">Clear</button>
            </form>
        </div>
    )
}

export default Create;
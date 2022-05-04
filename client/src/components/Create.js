import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";


function Create(props){

    const editorRef = useRef(null);

    return (
        <div className="Create">
            {/* <form className="create-post-form">
                <div id="form-title">Create Blog Post</div>
                <Editor apiKey="odysb9itemhhioc0e9wswexnphs05fmqjao24y5ul5el42z5"
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
                <button type="submit" id="submit-button">Post</button>
                <button id="clear-content">Clear</button>
            </form> */}
        </div>
    )
}

export default Create;
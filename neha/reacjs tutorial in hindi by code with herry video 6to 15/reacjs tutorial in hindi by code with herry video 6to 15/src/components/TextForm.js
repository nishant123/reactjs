import React, { useState } from 'react'


export default function TextForm(props) {
    const handleUpClick = () => {
        //    console.log("Uppercase was clicked" + text);
        let newText = text.toUpperCase();
        setText(newText)
    }
    const handleOnChange = (event) => {
        setText(event.target.value);
    }

    const [text, setText] = useState('Enter text here2');
    return (
        <div>
            <h1>{props.heading}-{text}</h1>
            <div class="mb-3">
                <label for="myBox" className="form-label">Example textarea</label>
                <textarea class="form-control" value={text} id="myBox" rows="8"></textarea>
            </div>

            <button className="btn btn-primary" onClick={handleUpClick}>Convert to Uppercase</button>
        </div>
    )
}

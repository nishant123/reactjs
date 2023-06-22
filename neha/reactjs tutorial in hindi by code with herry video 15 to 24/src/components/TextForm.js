import React, { useState } from 'react'

export default function TextForm(props) {
    const handleUpClick = () => {
        let newText = text.toUpperCase();
        setText(newText)
        props.showAlert("Converted to uppercase!", "success");

    }

    const handleOnChange = (event) => {
        setText(event.target.value);
    }


    //credits :A
    const handlecopy = () => {
        navigator.clipboard.writeText(text);
        props.showAlert("copied to clipboard!", "success");
    }

    //credits :coding wala
    const handleExtraSpaces = () => {
        let newText = text.split(/[]+/);
        setText(newText.join(" "));
        props.showAlert("Extras spaces removed!", "success");
    }

    const [text, setText] = useState('Enter text here2');
    return (
        <div>
            <h1 className='my-2'>{props.heading}-{text}</h1>
            <div className="mb-3">
                <textarea className="form-control" value={text} id="myBox" rows="8"></textarea>
            </div>

            <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleUpClick}>Convert to Uppercase</button>
            <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleLOClick}>Convert to Lowercase</button>
            <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleClearClick}>Clear Text</button>
            <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleCopy}>Copy Text</button>
            <button disabled={text.length === 0} className="btn btn-primary mx-1 my-1" onClick={handleExtraSpaces}>Remove Extra Spaces</button>

            <div className="container my-3" style={{ color: prop.mode == 'dark' ? 'white' : '#042743' }}>
                <h2>your text summary</h2>
                <p>{text.split(/\s+/).filter((Element) => { return Element.length !== 0 }).length}words and {text.length}characters</p>
                <p>{0.008 * text.split("").length}minutes read</p>
                <h2>Preview</h2>
                <p>{text.length > 0 ? text : "Nothing to preview!"}</p>

            </div>
        </div>


    )
}

import React, { useState } from "react";
import './PushButton.css'

const PushButton = (props) =>{

    const [activatedButtonCode, setActivatedButtonCode] = useState(props.default);

    let thisButton = "thisButtonStyle";

    if(activatedButtonCode){
        thisButton = "thisButtonStyle active";
    }
    else{
        thisButton = "thisButtonStyle";
    }

    const outPut = () => {
        if(typeof props.disabled === 'undefined' || props.disabled === false){
            if(typeof props.onChangeOutPutCode !== 'undefined'){
                props.onChangeOutPutCode(!activatedButtonCode);
            }
            setActivatedButtonCode(!activatedButtonCode);
        }
    }

    return(
        <div className="PushButton">
            <button style={{width: props.width, height: props.height}} className={thisButton} onClick={outPut} type="choice">{activatedButtonCode ? props.activeLabel : props.deactiveLabel}</button>
        </div>
    );
}

export default PushButton;
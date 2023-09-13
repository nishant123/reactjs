import React, { useState } from "react";
import './SwitchButton.css'

const SwitchButton = (props) =>{

    const [activatedButtonCode, setActivatedButtonCode] = useState(props.default);

    let buttonOne = "buttonStyle";
    let buttonTwo = "buttonStyle";

    if(activatedButtonCode == 1){
        buttonOne = "buttonStyle active";
        buttonTwo = "buttonStyle";
    }
    else{
        buttonTwo = "buttonStyle active";
        buttonOne = "buttonStyle";
    }

    const outPutFromOne = () => {

        setActivatedButtonCode(1);
        buttonOne = "buttonStyle active";
        buttonTwo = "buttonStyle";
        props.onChangeOutPutCode(1);
    }

    const outPutFromTwo = () => {

        setActivatedButtonCode(2);
        buttonTwo = "buttonStyle active";
        buttonOne = "buttonStyle";
        props.onChangeOutPutCode(2);
    }

    return(
        <div className={props.className}>
            <div className="SwitchButton">
                <button id="label1" className={buttonOne} onClick={outPutFromOne} type="choice" value={props.label1} name="numberOne">{props.label1}</button>
                <button id="label2" className={buttonTwo} onClick={outPutFromTwo} type="choice" value={props.label2} name="numberOne">{props.label2}</button>
            </div>
        </div>
    );
}

export default SwitchButton;
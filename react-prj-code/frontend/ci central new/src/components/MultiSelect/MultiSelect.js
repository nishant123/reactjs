import { Button } from 'reactstrap'
import React from 'react'
import { useState } from 'react'
import './MultiSelect.css'

const MultiSelect = (props) => {


    const [result, setResult] = useState([]);

    const options = props.options;

    const checked = (e) => {
        var results = result;
        var newArraylist = [];

        if (e.target.checked) {
            results.push(e.target.value);
            setResult(results);
            if(typeof props.onChange !== 'undefined'){
                props.onChangeResult(newArraylist);
            }
        }
        else {
            newArraylist = results.filter(res => res != e.target.value);
            setResult(newArraylist);
            if(typeof props.onChange !== 'undefined'){
                props.onChangeResult(newArraylist);
            }
        }
    }

    return(
        <>
            <ul className='subject' style={{height: props.height, width: props.width}}>
                {options.map((opt, index) => {
                    return (
                        <li key={index}>
                            <label>{opt.Label}
                            <input type="checkbox" onChange={checked} id={opt.id} name={opt.Code} value={opt.Code} disabled={props.disabled} />
                                <span className="checkmark"></span>
                            </label>
                        </li>
                    )
                })}
            </ul>
        </>
    )

}

export default MultiSelect;
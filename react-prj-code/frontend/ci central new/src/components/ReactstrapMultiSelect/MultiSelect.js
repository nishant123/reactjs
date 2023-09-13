import React from 'react'
import { useState, useEffect } from 'react'
import { Button, Card, CardBody, Col, Container, Input, Row, CustomInput, Label, Modal, ModalHeader, ModalBody, ModalFooter, CardHeader, CardTitle, FormGroup } from "reactstrap";

const MultiSelect = (props) => {

    useEffect(() => {
        setResult(props.defaultValues ? props.defaultValues : []);
    }, [])

    const [result, setResult] = useState([]);

    const options = props.options;

    const checked = (e) => {
        var results = result;
        var newArraylist = [];

        if (e.target.checked) {
            results.push(e.target.value);
            setResult(results);
            if(typeof props.onChangeResult !== 'undefined'){
                props.onChangeResult(results);
            }
        }
        else {
            newArraylist = results.filter(res => res != e.target.value);
            setResult(newArraylist);
            if(typeof props.onChangeResult !== 'undefined'){
                props.onChangeResult(newArraylist);
            }
        }
    }

    const checkCheckBoxs = (Code) => {

        if (props.defaultValues) {
            for (var i = 0; i <= props.defaultValues.length - 1; i++) {
                var newArray = props.defaultValues;
                if (newArray[i] === Code) {
                    return true;
                }
            }

            if (i === props.defaultValues.length - 1) {
                return false;
            }
        }

    }

    return(
        <div style={{height: props.height, overflow: "auto"}}>
            <CardHeader style={{padding: "1rem 1.25rem 0 1.25rem"}}>
                <CardTitle tag="h5" className="mb-0">
                    {props.header}
                </CardTitle>
            </CardHeader>
            <CardBody style={{padding: "0.75rem 1.25rem"}}>
                {
                    options.map((opt, index) => {
                        return (
                            <FormGroup key={index} check className="mb-2">
                                <Label check>
                                    <Input type="checkbox" id={opt.id} name={opt.Code} value={opt.Code} onChange={checked} disabled={props.disabled} defaultChecked={checkCheckBoxs(opt.Code)} /> 
                                    {/* typeof props.defaultValues !== 'undefined' ? checkCheckBoxs(opt.Code) : null  */}
                                    {opt.Label}
                                </Label>
                            </FormGroup>
                        )
                    })
                }
            </CardBody>
        </div>
    )

}

export default MultiSelect;
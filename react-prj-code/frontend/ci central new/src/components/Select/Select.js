import React from 'react'
import Select from 'react-select'
import { Button, Card, CardBody, Col, Container, Input, Row, CustomInput, Label, Modal, ModalHeader, ModalBody, ModalFooter, CardHeader, CardTitle, FormGroup } from "reactstrap";

const Selects = (props) => {

    
    const newOptions = props.options === null || props.options === 'undefined' ? null : props.options.map(item => {
        const { Code: value, Label: label, ...rest } = item;
        return { ...rest, value, label }
    });

    const formatedDefaultValue = () => {
        if(props.defaultValue){
            var newDefaultValue = [];
            for(var i=0; i<=newOptions.length - 1; i++){
                var getOption = newOptions.find(option => option.value === props.defaultValue[i]);
                if (typeof getOption !== 'undefined') {
                    newDefaultValue.push(getOption);
                }
            }
            return (newDefaultValue);
        } 
    }

    const newOnChange = (e) => {
        
        // const newE = e === null || e === 'undefined' ? null : e.map( item => {
        //     const { value: Code, label: Label, ...rest } = item;
        //     return { Code }
        //    }
        // );

        // if (!e) {
        //     newArray = null;
        // }
        // else {

            let newArray = e.map(e => e.value);

            // for (var i = 0; i < e.length; i++) {
            //     newArray.push(e[i].value);
            // }
        // }

        if (props.onChange) {
            props.onChange(newArray ? newArray : null);
        }
    }

    return (
        <>
            <CardHeader style={{ padding: "1rem 1.25rem 0 1.25rem" }}>
                <CardTitle tag="h5" className="mb-0">
                    {props.header}
                </CardTitle>
            </CardHeader>
            <CardBody style={{ padding: "0.75rem 1.25rem" }}>
                <Select
                    className={props.className}
                    classNamePrefix={props.classNamePrefix}
                    options={newOptions}
                    isMulti={typeof props.isMulti === 'undefined' ? false : true}
                    isSearchable={typeof props.isSearchable === 'undefined' ? false : true}
                    onChange={newOnChange}
                    defaultValue={formatedDefaultValue()}
                />
            </CardBody>
        </>
    )
}

export default Selects;
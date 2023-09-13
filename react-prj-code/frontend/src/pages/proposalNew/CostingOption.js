import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import
{
    CustomInput,
    Form,
    FormGroup,
    FormFeedback,
    Input,
    Label,
    Row,
    Col,
    Table,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Button,
    Modal, ModalBody, ModalFooter, ModalHeader
} from "reactstrap";
import Select from "react-select";
import { getMultiOptions } from "../../utils/codeLabels";
import { useState } from "react";
import { faPencilAlt, faCopy, faPlus, faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import update from 'immutability-helper'

const Start = ({ project }) =>
{
    const styleModelBody = {
        minHeight: "200px"
    }

    const [modelState, setModelState] = useState(false);

    const [modelStateVar, setModelStateVar] = useState(false);

    const [costingOptionIndex, setCostingOptionIndex] = useState(null);

    const [modelMode, setModelMode] = useState('new');

    const [newCostingOption, setNewCostingOption] = useState(null);

    const [testData, setTestData] = useState([
        { name: "var1", type: "text", label: "var1", value: null, mandatory: true },
        { name: "var2", type: "text", label: "var2", value: null, mandatory: true },
        { name: "var3", type: "text", label: "var3", value: null, mandatory: true },
        { name: "var4", type: "multi", label: "var4", value: null, mandatory: true },
        { name: "var5", type: "check", label: "var5", value: null, mandatory: false },
        { name: "var6", type: "text", label: "var6", value: null, mandatory: false },
        { name: "var7", type: "text", label: "var7", value: null, mandatory: false }
    ]);

    const [costingOptions, setCostingOptions] = useState([
        { name: "Costing Option", label: "Costing Option", value: "Costing Option" }
    ]);

    const checkChangeVariable = (indexV, value) =>
    {
        const newTestData = update(testData, {
            [indexV]:
            {
                $merge: { "selected": value }
            }
        });
        setTestData(newTestData);
    }

    const ReturnControl = (v, co) =>
    {
        if (v.type == "text")
            return (
                <input type="number" name={v.name} value={co.value} style={{ width: "100%" }} />
            )
        else if (v.type == "multi")
            return (
                <Select
                    name={v.name}
                    value={co.value}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={testData}
                    isMulti
                />
            )
        else if (v.type == "check")
            return (
                <CustomInput
                    type="switch"
                    name={v.name}
                    className="h5"
                />
            )
    };

    const RenderVariables = (lstVar) =>
    {
        return (
            lstVar.map((variable, indexV) =>
            {
                return <Col key={"col_" + indexV} style={{ paddingLeft: "3rem", paddingTop: "0.25rem" }} md={6}>
                    <Input type="checkbox" defaultChecked={variable.mandatory || variable.selected ? true : false}
                        disabled={variable.mandatory ? true : false}
                        onChange={(e) => checkChangeVariable(indexV, e.target.checked)} />
                    {variable.label}
                    {variable.mandatory &&
                        "*"
                    }
                </Col>
            }));
    };

    function removeItem(index)
    {
        const newArray = update(costingOptions, { $splice: [[index, 1]] });
        setCostingOptions(newArray);
    }

    return (
        <React.Fragment>
            <Row>
                <Col className="p-3">
                    <div style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
                        <Button color="secondary" onClick={() =>
                        {
                            setModelState(true);
                            setModelMode("new");
                            setCostingOptionIndex(null);
                            setNewCostingOption(null);
                        }}>
                            Costing Option
                            <FontAwesomeIcon
                                title="Add New Costing Option"
                                className="align-middle mr-2"
                                icon={faPlusCircle}
                                fixedWidth
                                style={{ cursor: "pointer" }}
                            />
                        </Button>
                        <Button style={{ marginLeft: "10px" }}
                            color="secondary" onClick={() =>
                            {
                                setModelStateVar(true);
                            }}
                        >
                            Variables
                            <FontAwesomeIcon
                                title="Add Other Variables"
                                className="align-middle mr-2"
                                icon={faPlusCircle}
                                fixedWidth
                                style={{ cursor: "pointer" }}
                            />
                        </Button>
                    </div>
                </Col>
            </Row>
            <Table size="sm" bordered style={{ backgroundColor: "white", width: "auto" }}>
                <thead>
                    <tr>
                        <th style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "200px" }}>
                            <span> Variables</span>
                        </th>
                        {costingOptions.map((co, indexCO) =>
                            <th style={{ width: "250px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>
                                        {co.name}
                                        <FontAwesomeIcon
                                            title="Rename Costing Option"
                                            className="align-middle mr-2"
                                            icon={faPencilAlt}
                                            fixedWidth
                                            onClick={(e) =>
                                            {
                                                setModelState(true);
                                                setNewCostingOption(co.name);
                                                setCostingOptionIndex(indexCO);
                                                setModelMode("rename");
                                            }}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </span>
                                    <div>
                                        {indexCO != 0 &&
                                            <FontAwesomeIcon
                                                title="Delete Profile"
                                                className="align-middle mr-2"
                                                icon={faTimesCircle}
                                                fixedWidth
                                                style={{ cursor: "pointer" }}
                                                onClick={() => removeItem(indexCO)}
                                            />
                                        }
                                        {costingOptions.length > 1 &&
                                            <FontAwesomeIcon
                                                title="Copy data"
                                                className="align-middle mr-2"
                                                icon={faCopy}
                                                fixedWidth
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                {
                                                    setModelState(true);
                                                    setModelMode("copy");
                                                    setCostingOptionIndex(indexCO);
                                                    setNewCostingOption(null);
                                                }}
                                            />
                                        }
                                    </div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {testData.filter(x => x.mandatory || x.selected).map((v, index) =>
                        <tr>
                            <td>{v.name}</td>
                            {costingOptions.map((co, indexCO) =>
                                <td>
                                    {ReturnControl(v, co)}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal isOpen={modelState} toggle={() => setModelState(!modelState)} centered size="md">
                <ModalHeader toggle={() => setModelState(!modelState)}>
                    {modelMode == 'new' ? 'New Costing Option' : (modelMode == 'copy' ? 'Copy Costing Option' : 'Rename Costing Option')}                     
                </ModalHeader>
                <ModalBody className="m-3" style={styleModelBody}>
                    <Row>
                    { modelMode != 'copy' &&                    
                        <Col md={modelMode == 'rename' ? 12 : 6}>
                        <FormGroup>
                            <Label>Name</Label>
                            <input type="text" style={{ width: "100%" }} value={newCostingOption} onChange={(e) =>
                            {
                                setNewCostingOption(e.target.value);
                            }} />
                        </FormGroup>
                            </Col>
                     }
                    {modelMode !='rename' &&
                         <Col md={modelMode == 'copy' ? 12 : 6}>
                            <FormGroup>
                                <Label>Copy Data From</Label>
                                <Select
                                    name={"copyFrom"}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    options={costingOptions.filter((x, i) => i != costingOptionIndex || !costingOptionIndex)}
                                />                            
                            </FormGroup>
                        </Col>
                      }
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() =>
                    {
                        setModelState(!modelState);
                        if (modelMode == "new")
                            setCostingOptions([...costingOptions, { name: newCostingOption, label: newCostingOption, value: newCostingOption }]);
                        else
                        {
                            const newArray = update(costingOptions, { [costingOptionIndex]: { $merge: { name: newCostingOption  } } });
                            setCostingOptions(newArray);
                        }
                        setCostingOptionIndex(null);
                        setNewCostingOption(null);

                    }}>
                        Save
                    </Button>
                    <Button color="danger" onClick={() => setModelState(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={modelStateVar} toggle={() => setModelStateVar(!modelStateVar)} centered size="lg">
                <ModalHeader toggle={() => setModelStateVar(!modelStateVar)}>
                    {'Add/Remove Variables'}
                </ModalHeader>
                <ModalBody className="m-3" style={styleModelBody}>
                    <Row>
                        {RenderVariables(testData)}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() =>
                    {
                        setModelStateVar(!modelStateVar);
                    }}>
                        Save
                    </Button>
                    <Button color="danger" onClick={() => setModelStateVar(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};
export default Start;

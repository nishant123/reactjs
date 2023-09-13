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
        minHeight: "120px"
    }

    const [modelState, setModelState] = useState(false);
    const [renameIndex, setRenameIndex] = useState(null);

    const [modelMode, setModelMode] = useState('new');

    const [newCostingOption, setNewCostingOption] = useState(null);

    const [testData, setTestData] = useState([
        { name: "var1", type: "text", label: "var1", value: "var1" },
        { name: "var2", type: "multi", label: "var2", value: "var2" },
        { name: "var3", type: "check", label: "var3", value: "var3" }
    ]);

    const [costingOptions, setCostingOptions] = useState([
        { name: "Costing Option" }
    ]);

    const ReturnControl = (v, co) =>
    {
        debugger;
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
                            setRenameIndex(null);
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
                            color="secondary"
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
                                                setRenameIndex(indexCO);
                                                setModelMode("edit");
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

                                        <FontAwesomeIcon
                                            title="Copy data"
                                            className="align-middle mr-2"
                                            icon={faCopy}
                                            fixedWidth
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {testData.map((v, index) =>
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

            <Modal isOpen={modelState} toggle={() => setModelState(!modelState)} centered size="sm">
                <ModalHeader toggle={() => setModelState(!modelState)}>
                    {modelMode == 'new' ? 'New Costing Option' : 'Rename Costing Option'}
                </ModalHeader>
                <ModalBody className="m-3" style={styleModelBody}>
                    <Col md={12}>
                        <FormGroup>
                            <input type="text" style={{ width: "100%" }} value={newCostingOption} onChange={(e) =>
                            {
                                setNewCostingOption(e.target.value);
                            }} />
                        </FormGroup>
                    </Col>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() =>
                    {
                        setModelState(!modelState);
                        if (modelMode == "new")
                            setCostingOptions([...costingOptions, { name: newCostingOption }]);
                        else
                        {
                            const newArray = update(costingOptions, { [renameIndex]: { $set: { name: newCostingOption } } });
                            setCostingOptions(newArray);
                        }
                        setRenameIndex(null);
                        setNewCostingOption(null);

                    }}>
                        Submit
                    </Button>
                    <Button color="danger" onClick={() => setModelState(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        </React.Fragment>
    );
};
export default Start;

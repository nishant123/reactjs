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
import _ from "lodash";
import { updateProfile } from "../../redux/actions/currentCostingActions";

const Start = ({ project, countryIndex, methodology, methodologyIndex, updateProject }) =>
{
    const styleModelBody = {
        minHeight: "200px"
    }

    const [modelState, setModelState] = useState(false);

    const [modelStateVar, setModelStateVar] = useState(false);

    const [costingOptionIndex, setCostingOptionIndex] = useState(null);

    const [modelMode, setModelMode] = useState('new');

    const [newCostingOption, setNewCostingOption] = useState(null);

    const [addVariables, setAddVariables] = useState([]);

    const [copyToCostingOption, setCopyTo] = useState(null);

    const checkChangeVariable = (indexV, value) =>
    {
        const tempAddVariables = update(addVariables, {
            [indexV]:
            {
                $merge: { "selected": value }
            }
        });
        setAddVariables(tempAddVariables);
    }


    const saveCostingOption = (mode) =>
    {
        if (mode == "new")
        {
            const projectTemp = update(project, {
                FieldingCountries: {
                    [countryIndex]: {
                        SubMethodologies:
                        {
                            [methodologyIndex]:
                            {
                                CostingOptions:
                                {
                                    $push: [
                                        { label: newCostingOption, Variables: _.cloneDeep(_.head(methodology.CostingOptions).Variables) },
                                    ]
                                }
                            }
                        }
                    }
                }
            });
            updateProject(projectTemp);
        }
        else if (mode == "rename")
        {
            const projectTemp = update(project, {
                FieldingCountries: {
                    [countryIndex]: {
                        SubMethodologies:
                        {
                            [methodologyIndex]:
                            {
                                CostingOptions:
                                {
                                    [costingOptionIndex]:
                                    {
                                        $merge: { label: newCostingOption }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            updateProject(projectTemp);
        }
        else if (mode == "copy")
        {
            if (newCostingOption)
            {
                const projectTemp = update(project, {
                    FieldingCountries: {
                        [countryIndex]: {
                            SubMethodologies:
                            {
                                [methodologyIndex]:
                                {
                                    CostingOptions:
                                    {
                                        $push: [
                                            { label: newCostingOption, Variables: _.cloneDeep(methodology.CostingOptions[costingOptionIndex]).Variables },
                                        ]
                                    }
                                }
                            }
                        }
                    }
                });
                updateProject(projectTemp);
            }
            else if (copyToCostingOption)
            {
                const CostingOptions = project.FieldingCountries[countryIndex].SubMethodologies[methodologyIndex].CostingOptions;
                const indexCopyToCostingOption = CostingOptions.findIndex(x => x.label == copyToCostingOption.label);
                const costingOptionClone = _.cloneDeep(CostingOptions[indexCopyToCostingOption]);
                costingOptionClone.Variables = _.cloneDeep(CostingOptions[costingOptionIndex].Variables);

                const projectTemp = update(project, {
                    FieldingCountries: {
                        [countryIndex]: {
                            SubMethodologies:
                            {
                                [methodologyIndex]:
                                {
                                    CostingOptions:
                                    {
                                        [indexCopyToCostingOption]: { $set: costingOptionClone }
                                    }
                                }
                            }
                        }
                    }
                });
                updateProject(projectTemp);
            }
        }
    }

    const ReturnControl = (indexCO, variable) =>
    {
        const v = methodology.CostingOptions[indexCO].Variables.filter(x => x.label == variable.label)[0] || {};
        if (v.type == "number")
            return (
                <input type="number" name={v.label} value={v.value || ''} style={{ width: "100%" }} onChange={(e) => InfoChange(indexCO, e.target.name, e.target.value)} />
            )
        else if (v.type == "text")
            return (
                <input type="text" name={v.label} value={v.value || ''} style={{ width: "100%" }} onChange={(e) => InfoChange(indexCO, e.target.name, e.target.value)} />
            )
        else if (v.type == "multi")
            return (
                <Select
                    name={v.label}
                    value={v.value}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={v.options}
                    isMulti
                    onChange={(val) => InfoChange(indexCO, v.label, val)}

                />
            )
        else if (v.type == "check")
            return (
                <CustomInput
                    type="switch"
                    name={v.label}
                    id={v.label}
                    defaultChecked={v.value ? v.value : true}
                    className="h5"
                    onChange={(e) =>
                    {

                        InfoChange(indexCO, e.target.name, e.target.checked);
                    }}
                />
            )
    };

    const RenderVariables = (lstVar) =>
    {
        return (
            lstVar.map((variable, indexV) =>
            {
                return <Col key={"col_" + indexV} style={{ paddingLeft: "3rem", paddingTop: "0.25rem" }} md={6}>
                    <Input type="checkbox" defaultChecked={variable.selected ? true : false}
                        onChange={(e) => checkChangeVariable(indexV, e.target.checked)} />
                    {variable.label}
                </Col>
            }));
    };

    function removeItem(indexCO)
    {
        const projectTemp = update(project, {
            FieldingCountries: {
                [countryIndex]: {
                    SubMethodologies:
                    {
                        [methodologyIndex]:
                        {
                            CostingOptions:
                            {
                                $splice: [[indexCO, 1]]
                            }
                        }
                    }
                }
            }
        });
        updateProject(projectTemp);
    }

    function InfoChange(indexCO, name, value)
    {
        const VariablesClone = _.cloneDeep(project.FieldingCountries[countryIndex].SubMethodologies[methodologyIndex].CostingOptions[indexCO].Variables);
        VariablesClone.filter(x => x.label == name)[0].value = value;
        const projectTemp = update(project, {
            FieldingCountries: {
                [countryIndex]: {
                    SubMethodologies:
                    {
                        [methodologyIndex]:
                        {
                            CostingOptions:
                            {
                                [indexCO]:
                                {
                                    Variables:
                                        { $set: VariablesClone }
                                }
                            }
                        }
                    }
                }
            }
        });
        updateProject(projectTemp);
    }

    function SaveAdditionalVariables()
    {
        debugger;
        const projectTemp = update(project, {
            FieldingCountries: {
                [countryIndex]: {
                    SubMethodologies:
                    {
                        [methodologyIndex]:
                        {
                            Variables: { $set: addVariables }
                        }
                    }
                }
            }
        });
        updateProject(projectTemp);
    }

    function AddRemoveOptionalVariables()
    {

        const costingOptionsClone = _.cloneDeep(methodology.CostingOptions);
        const methodologyVariablesClone = _.cloneDeep(addVariables);
        debugger;
        costingOptionsClone.forEach((co, indexCO) =>
        {
            const variablesClone = _.cloneDeep(co.Variables);
            let tempVariables = [];
            tempVariables = variablesClone.filter((vc, indexVC) => vc.mandatory);
            methodologyVariablesClone.filter(mv => mv.selected).forEach((mv, indexMV) =>
            {
                const indexVar = variablesClone.findIndex(vc => vc.label == mv.label);
                if (indexVar > -1)
                    tempVariables.push(_.cloneDeep(variablesClone[indexVar]));
                else
                    tempVariables.push(_.cloneDeep(mv));
            });
            debugger;
            co.Variables = tempVariables;
        });

        const projectTemp = update(project, {
            FieldingCountries: {
                [countryIndex]: {
                    SubMethodologies:
                    {
                        [methodologyIndex]:
                        {
                            CostingOptions: { $set: costingOptionsClone },
                            Variables: { $set: addVariables }
                        }
                    }
                }
            }
        });
        updateProject(projectTemp);

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
                                setAddVariables(methodology.Variables);
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
                        {methodology.CostingOptions.map((co, indexCO) =>
                            <th style={{ width: "250px" }} key={'c_' + countryIndex + '_m_' + methodologyIndex + '_co_' + indexCO}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span>
                                        {co.label}
                                        <FontAwesomeIcon
                                            title="Rename Costing Option"
                                            className="align-middle mr-2"
                                            icon={faPencilAlt}
                                            fixedWidth
                                            onClick={(e) =>
                                            {
                                                setModelState(true);
                                                setNewCostingOption(co.label);
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
                                    </div>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {_.head(methodology.CostingOptions).Variables.filter(x => x.mandatory || x.selected).map((v, indexV) =>
                        <tr key={'c_' + countryIndex + '_m_' + methodologyIndex + "_v_" + indexV}>
                            <td>{v.label}</td>
                            {methodology.CostingOptions.map((co, indexCO) =>
                                <td key={'c_' + countryIndex + '_m_' + methodologyIndex + '_co_' + indexCO}>
                                    {ReturnControl(indexCO, v)}
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
                        <Col md={modelMode == 'copy' && methodology.CostingOptions.length > 1 ? 6 : 12}>
                            <FormGroup>
                                <Label>Costing Option Name </Label>
                                <input type="text" style={{ width: "100%" }} value={newCostingOption} onChange={(e) =>
                                {
                                    setNewCostingOption(e.target.value);
                                }} />
                            </FormGroup>
                        </Col>
                        {modelMode == 'copy' && methodology.CostingOptions.length > 1 && !newCostingOption &&
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Copy Data To</Label>
                                    <Select
                                        name={"copyFrom"}
                                        value={copyToCostingOption}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={methodology.CostingOptions.filter((x, i) => i != costingOptionIndex)}
                                        onChange={(val) => setCopyTo(val)}
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
                        saveCostingOption(modelMode);
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
                        {RenderVariables(addVariables)}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() =>
                    {
                        AddRemoveOptionalVariables();
                        //SaveAdditionalVariables();
                        //AddRemoveOptionalVariables();
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

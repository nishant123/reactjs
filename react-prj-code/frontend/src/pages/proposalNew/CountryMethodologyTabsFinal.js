import React, { useState, useEffect } from "react";
import
{
    Col, Row, Card,
    CardBody,
    CardTitle,
    CardHeader, FormFeedback, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane
    , Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledTooltip, UncontrolledCollapse,
    Table
} from "reactstrap";
import { useSelector } from "react-redux";
import
{
    CustomInput,
    Input,
    Label,
    Button,
} from "reactstrap";
import { getMultiOptions } from "../../utils/codeLabels";
import classnames from "classnames";
import './common.css';
import CostingOption from "./CostingOptionFinal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faCopy, faPlus, faPlusCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
//import CostingOption from "./CostingOption";
import _ from "lodash";
import Select from "react-select";
import update from 'immutability-helper';

const Start = ({ project, updateProject }) =>
{
    const styleModelBody = {
        minHeight: "200px"
    }
    const [activeTabFC, setActiveTabFC] = useState(0);
    const [activeTabSM, setActiveTabSM] = useState(0);
    const [modelState, setModalState] = useState(false);
    const [copyProject, setCopyProject] = useState({});


    function toggle(tab)
    {
        if (activeTabFC !== tab)
        {
            setActiveTabFC(tab);
            setActiveTabSM(0);
        }
    };

    function toggleSM(tab)
    {
        if (activeTabSM !== tab)
        {
            setActiveTabSM(tab);
        }
    };

    function CopyClicked(indxFC, indxSM)
    {
        const Countries = _.cloneDeep(project.FieldingCountries.map(fc => ({ 'label': fc.label, 'value': fc.value, 'ColSpan': null })));
        const CostingOptions = _.cloneDeep(project.FieldingCountries[indxFC].SubMethodologies[indxSM].CostingOptions);
        setCopyProject({ Countries: Countries, CostingOptions: CostingOptions, Mode: "First" });
        setModalState(true);
    }

    function CopyProjectActionClicked(back)
    {
        if (back && copyProject.Mode == "Second")
            setCopyProject((prevState) => ({
                ...prevState,
                Mode: "First"
            }));
        else if (back && copyProject.Mode == "Save")
            setCopyProject((prevState) => ({
                ...prevState,
                Mode: "Second"
            }));

        else if (copyProject.Mode == "First")
        {

            let tempCountryWiseCostingOptions = [];
            copyProject.SelectedCostingOptions.forEach((co, indexCO) =>
            {
                copyProject.SelectedCountries.forEach((country, indexCountry) =>
                {
                    const tempMethodologies = _.cloneDeep(project.FieldingCountries.filter(fc => fc.value == country.value)[0]
                        .SubMethodologies.map(m => ({ 'label': m.label, 'value': m.value })));
                    tempCountryWiseCostingOptions.push({ CostingOption: co, Country: country, Methodologies: tempMethodologies });
                });
            });
            setCopyProject((prevState) => ({
                ...prevState,
                CountryWiseCostingOptions: tempCountryWiseCostingOptions,
                Mode: "Second"
            }));
        }

        else if (copyProject.Mode == "Second")
        {

            let SelectedCountries = _.cloneDeep(copyProject.SelectedCountries);
            SelectedCountries.forEach((country, indexC) =>
            {

                let tempMethodologies = [];
                let colSpanCountry = 0;
                copyProject.CountryWiseCostingOptions.filter((cwco, indexCWCO) => cwco.Country.value == country.value)
                    .forEach((fcwco, indexFCWCO) =>
                    {
                        fcwco.SelectedMethodologies.forEach((methodology, indexM) =>
                        {
                            if (!tempMethodologies.find(m => m.value == methodology.value))
                            {
                                let objMethodology = _.cloneDeep(methodology);
                                objMethodology["CostingOptions"] = [];
                                objMethodology["ColSpan"] = null;
                                copyProject.CountryWiseCostingOptions.filter((cwco_2, indexCWCO_2) =>
                                    cwco_2.Country.value == country.value
                                    && cwco_2.SelectedMethodologies.find(m_2 => m_2.value == objMethodology.value))
                                    .forEach((fcwco_2, indexFCWCO_2) =>
                                    {
                                        objMethodology["CostingOptions"].push(_.cloneDeep(fcwco_2.CostingOption));
                                    });
                                objMethodology["ColSpan"] = objMethodology["CostingOptions"].length;
                                tempMethodologies.push(objMethodology);
                                colSpanCountry += objMethodology["CostingOptions"].length;
                            }
                        });
                    });
                country.Methodologies = tempMethodologies;
                country["ColSpan"] = colSpanCountry;
            });

            debugger;
            setCopyProject((prevState) => ({
                ...prevState,
                SelectedCountries: SelectedCountries,
                Mode: "Save"
            }));
        }

        else if (copyProject.Mode == "Save")
        {
            const tempFieldingCountries = _.cloneDeep(project.FieldingCountries);
            copyProject.SelectedCountries.forEach((sc, indexSC) =>
            {
                sc.Methodologies.forEach((m, indexM) =>
                {
                    m.CostingOptions.forEach((co, indexCO) =>
                    {
                        const tempMethodology = tempFieldingCountries.filter(fc => fc.label == sc.label)[0].SubMethodologies.filter(sm => sm.label == m.label)[0];
                        const tempCostingOptions = tempFieldingCountries.filter(fc => fc.label == sc.label)[0].SubMethodologies.filter(sm => sm.label == m.label)[0].CostingOptions;
                        const tempIndexCO = tempCostingOptions.findIndex(tempCO => tempCO.label == co.label);
                        if (tempIndexCO >= 0)
                        {
                            const objCO = tempCostingOptions[tempIndexCO];
                            co.Variables.forEach((v, indexV) =>
                            {
                                const indexObjV = objCO.Variables.findIndex(objV => objV.label == v.label);
                                if (indexObjV >= 0)
                                    objCO.Variables[indexObjV].value = v.value;
                            });
                        }
                        else
                        {
                            const objCO = _.cloneDeep(co);
                            objCO.Variables = co.Variables.filter((v, indexV) => tempMethodology.CostingOptions[0].Variables.find(v2 =>  v2.label == v.label));
                            tempCostingOptions.push(objCO);
                        }
                    });
                });
            });
            updateProject({ FieldingCountries: tempFieldingCountries });
            setModalState(false);
        }
    }

    const ReturnControl = (indexV, indexC, indexM, indexCO) =>
    {

        const v = copyProject.SelectedCountries[indexC].Methodologies[indexM].CostingOptions[indexCO].Variables[indexV] || {};

        if (v.type == "number")
            return (
                <input type="number" name={v.label} value={v.value} style={{ width: "100%" }} onChange={(e) => InfoChange(indexC, indexM, indexCO, e.target.name, e.target.value)}
                />
            )
        else if (v.type == "text")
            return (
                <input type="text" name={v.label} value={v.value} style={{ width: "100%" }} onChange={(e) => InfoChange(indexC, indexM, indexCO, e.target.name, e.target.value)}
                />
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
                    onChange={(val) => InfoChange(indexC, indexM, indexCO, v.label, val)}
                />
            )
        else if (v.type == "check")
            return (
                <CustomInput
                    type="switch"
                    id={v.label + '_c_' + indexC + '_m_' + indexM + '_co_' + indexCO}
                    name={v.label}
                    defaultChecked={v.value ? v.value : true}
                    className="h5"
                    onChange={(e) =>
                    {
                        InfoChange(indexC, indexM, indexCO, e.target.name, e.target.checked);
                    }}
                />
            )
    };

    function InfoChange(indexC, indexM, indexCO, name, value)
    {

        const VariablesClone = _.cloneDeep(copyProject.SelectedCountries[indexC].Methodologies[indexM].CostingOptions[indexCO].Variables);
        VariablesClone.filter(x => x.label == name)[0].value = value;
        const projectTemp = update(copyProject, {
            SelectedCountries: {
                [indexC]: {
                    Methodologies:
                    {
                        [indexM]:
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
        setCopyProject(projectTemp);
    }

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>

                    <div className={"tab countryMethodologyTab"}>
                        <Nav tabs>
                            {project.FieldingCountries &&
                                project.FieldingCountries.map((fc, indxFC) => (
                                    <NavItem key={fc.value}>
                                        <NavLink className={classnames({ active: activeTabFC === indxFC })}
                                            onClick={() =>
                                            {
                                                toggle(indxFC);
                                            }}
                                        >
                                            <b>{fc.label}</b>
                                        </NavLink>
                                    </NavItem>
                                ))}
                        </Nav>
                        <TabContent activeTab={activeTabFC}>
                            {project.FieldingCountries &&
                                project.FieldingCountries.map((fc, indxFC) => (
                                    activeTabFC === indxFC &&
                                    <TabPane tabId={indxFC} key={fc.value}>
                                        <Row>
                                            <Col md={12} className={"costing-option"}>
                                                <Nav tabs>
                                                    {fc.SubMethodologies &&
                                                        fc.SubMethodologies.map((sm, indxSM) => (
                                                            <NavItem key={sm.value}>
                                                                <NavLink className={classnames({ active: activeTabSM === indxSM })}
                                                                    onClick={() =>
                                                                    {
                                                                        toggleSM(indxSM);
                                                                    }}
                                                                >
                                                                    <b>{sm.label}</b>
                                                                    <span style={{ fontSize: "9px" }}>
                                                                        <FontAwesomeIcon
                                                                            title="Copy data"
                                                                            className="align-middle mr-2"
                                                                            icon={faCopy}
                                                                            style={{ cursor: "pointer", marginLeft: "10px" }}
                                                                            onClick={() =>
                                                                            {
                                                                                CopyClicked(indxFC, indxSM);
                                                                            }}
                                                                        />
                                                                    </span>
                                                                </NavLink>
                                                            </NavItem>
                                                        ))}
                                                </Nav>
                                                <TabContent activeTab={activeTabSM} style={{ padding: "0.25" }}>

                                                    {fc.SubMethodologies &&
                                                        fc.SubMethodologies.map((sm, indxSM) => (
                                                            activeTabSM === indxSM &&
                                                            <TabPane tabId={indxSM} key={sm.value}>
                                                                <CostingOption
                                                                    project={project}
                                                                    countryIndex={indxFC}
                                                                    methodology={sm}
                                                                    methodologyIndex={indxSM}
                                                                    updateProject={updateProject}
                                                                />
                                                            </TabPane>
                                                        ))}
                                                </TabContent>
                                            </Col>
                                        </Row>
                                    </TabPane>
                                ))}
                        </TabContent>
                    </div>
                </Col>
            </Row>

            <Modal isOpen={modelState} toggle={() => setModalState(!modelState)} centered size="xl">
                <ModalHeader toggle={() => setModalState(!modelState)}>
                    {'Copy Data'}
                </ModalHeader>
                <ModalBody className="m-3" style={styleModelBody}>
                    {copyProject && copyProject.Mode == 'First' &&
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Select Costing Options</Label>
                                    <Select
                                        name={"copyCostingOptions"}
                                        value={copyProject.SelectedCostingOptions}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={copyProject.CostingOptions}
                                        isMulti
                                        onChange={(val) =>
                                        {
                                            setCopyProject((prevState) => ({
                                                ...prevState,
                                                SelectedCostingOptions: val
                                            }));
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Select Countries</Label>
                                    <Select
                                        name={"copyCountries"}
                                        value={copyProject.SelectedCountries}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        options={copyProject.Countries}
                                        isMulti
                                        onChange={(val) =>
                                        {
                                            setCopyProject((prevState) => ({
                                                ...prevState,
                                                SelectedCountries: val
                                            }));
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    }

                    {copyProject && copyProject.Mode == 'Second' &&
                        <Table size="sm" bordered style={{ backgroundColor: "white", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th className={'copyCostingOptionFirstTable'}>
                                        <span> Costing Option</span>
                                    </th>
                                    <th className={'copyCostingOptionFirstTable'}>
                                        <span> Country</span>
                                    </th>
                                    <th className={'copyCostingOptionFirstTable'}>
                                        <span> Select Methodologies</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {copyProject.CountryWiseCostingOptions.map((cwco, indexCWCO) =>
                                    <tr>
                                        <td>
                                            {cwco.CostingOption.label}
                                        </td>
                                        <td>
                                            {cwco.Country.label}
                                        </td>
                                        <td>
                                            <Select
                                                name={"methodologies"}
                                                value={cwco.SelectedMethodologies}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                options={cwco.Methodologies}
                                                isMulti
                                                onChange={(val) =>
                                                {
                                                    const copyProjectTemp = update(copyProject, {
                                                        CountryWiseCostingOptions: {
                                                            [indexCWCO]: {
                                                                $merge: { "SelectedMethodologies": val }
                                                            }
                                                        }
                                                    });
                                                    setCopyProject(copyProjectTemp);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    }

                    {copyProject && copyProject.Mode == 'Save' &&
                        <Row>
                            <Col md={12} className={"tableCopyProject"}>
                                <Table responsive bordered style={{ backgroundColor: "white" }}>
                                    <thead>
                                        <tr>
                                            <th>
                                            </th>
                                            {copyProject.SelectedCountries.map((c, indexC) =>
                                                <th colSpan={c.ColSpan} key={indexC}>
                                                    {c.label}
                                                </th>
                                            )}
                                        </tr>
                                        <tr>
                                            <th>
                                            </th>
                                            {copyProject.SelectedCountries.map((c, indexC) =>
                                                c.Methodologies.map((m, indexM) =>
                                                    <th colSpan={m.ColSpan} key={indexC + "_" + indexM}>
                                                        {m.label}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th>
                                            </th>
                                            {copyProject.SelectedCountries.map((c, indexC) =>
                                                c.Methodologies.map((m, indexM) =>
                                                    m.CostingOptions.map((co, indexCO) =>
                                                        <th key={indexC + "_" + indexM + "_" + indexCO}>
                                                            {co.label}
                                                        </th>
                                                    )
                                                )
                                            )}
                                        </tr>
                                        {copyProject.CostingOptions[0].Variables.map((v, indexV) =>
                                            <tr key={indexV}>
                                                <td>
                                                    {v.label}
                                                </td>
                                                {copyProject.SelectedCountries.map((c, indexC) =>
                                                    c.Methodologies.map((m, indexM) =>
                                                        m.CostingOptions.map((co, indexCO) =>
                                                            <td key={indexC + "_" + indexM + "_" + indexCO}>
                                                                {ReturnControl(indexV, indexC, indexM, indexCO)}
                                                            </td>
                                                        )
                                                    )
                                                )}
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    }

                </ModalBody>
                <ModalFooter>
                    {copyProject &&
                        <>
                            <Button color="success" onClick={() =>
                            {
                                CopyProjectActionClicked((copyProject.Mode == "Second" || copyProject.Mode == "Save") ? true : false);
                            }}>
                                {copyProject.Mode == "First" &&
                                    'Next'
                                }
                                {(copyProject.Mode == "Second" || copyProject.Mode == "Save") &&
                                    'Back'
                                }
                            </Button>
                            {copyProject.Mode != "First" &&
                                <Button color="success" onClick={() =>
                                {
                                    CopyProjectActionClicked();
                                }}>
                                    {copyProject.Mode == "Second" &&
                                        'Next'
                                    }
                                    {copyProject.Mode == "Save" &&
                                        ' Save'
                                    }
                                </Button>
                            }
                        </>
                    }
                    <Button color="danger" onClick={() => setModalState(false)}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

        </React.Fragment>
    );
};
export default Start;

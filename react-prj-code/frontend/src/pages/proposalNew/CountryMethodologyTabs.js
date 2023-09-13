import React, { useState, useEffect } from "react";
import
{
    Col, Row, Card,
    CardBody,
    CardTitle,
    CardHeader, FormFeedback, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledTooltip, UncontrolledCollapse
} from "reactstrap";
import { useSelector } from "react-redux";
import
{
    CustomInput,
    Input,
} from "reactstrap";
import { getMultiOptions } from "../../utils/codeLabels";
import classnames from "classnames";
import './common.css';
import CostingOption from "./CostingOption";

const Start = ({ project, updateProject }) =>
{
    const [activeTabFC, setActiveTabFC] = useState(0);
    const [activeTabSM, setActiveTabSM] = useState(0);


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

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    <div className={"tab"}>
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
                                            <Col md={12}>
                                                <Nav tabs>
                                                    {project.SubMethodology &&
                                                        project.SubMethodology.map((sm, indxSM) => (
                                                            <NavItem key={sm.value}>
                                                                <NavLink className={classnames({ active: activeTabSM === indxSM })}
                                                                    onClick={() =>
                                                                    {
                                                                        toggleSM(indxSM);
                                                                    }}
                                                                >
                                                                    <b>{sm.label}</b>
                                                                </NavLink>
                                                            </NavItem>
                                                        ))}
                                                </Nav>
                                                <TabContent activeTab={activeTabSM}>
                                                    {project.SubMethodology &&
                                                        project.SubMethodology.map((sm, indxSM) => (
                                                            activeTabSM === indxSM &&
                                                            <TabPane tabId={indxSM} key={sm.value}>                                                                 
                                                                <CostingOption
                                                                    project={project}                                                                    
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
        </React.Fragment>

    );
};
export default Start;

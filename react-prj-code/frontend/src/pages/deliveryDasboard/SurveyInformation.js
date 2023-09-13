import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Collapse,
  CardTitle,
  CardHeader,
} from "reactstrap";
import classnames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import _ from "lodash";

import Navbar from "../../components/Navbar";
import Layout from "../../layouts/Project";
import * as survey from "./surveyFields.json";
import { getLabel } from "../../utils/codeLabels";
import { saveDelivery } from "../../redux/actions/deliveryActions";
import Spinner from "../../components/Spinner";
import Select from "react-select";

const SurveyInformation = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDeliverable = useSelector(
    ({ deliveries }) => deliveries.currentProject
  );
  const currentProject = useSelector(({ currentProject }) => currentProject);
  const currentUser = useSelector(({ user }) => user.userRecord);
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const currentDelivery = useSelector(
    ({ deliveries }) => deliveries.currentDelivery
  );
  const app = useSelector(({ app }) => app);
  const otherDeliveryCollectionCode = _.head(
    codeLabels.DeliveryDataCollectionTypeOptions.filter(
      (ds) => ds.Label == "Other"
    )
  )?.Code;
  // const [editableDelivery, setprops.editableDelivery] = useState({ ...currentDelivery })

  // const editSurveyForm = (eve, isWaveSpec) => {
  //     if (isWaveSpec) {
  //         editableDelivery.WaveSpec[eve.target.id] = eve.target.value
  //     } else {
  //         editableDelivery[eve.target.id] = eve.target.value
  //     }
  //     setprops.editableDelivery({ ...editableDelivery })
  // }

  // currentUser.IsTCSUser = true
  let surveyFields = [];

  if (currentUser.IsTCSUser)
    surveyFields = Object.keys(survey.default.properties).filter(
      (prop) =>
        survey.default.properties[prop].isTCSOnly ||
        survey.default.properties[prop].isTCSOnly == undefined
    );
  else
    surveyFields = Object.keys(survey.default.properties).filter(
      (prop) =>
        !survey.default.properties[prop].isTCSOnly ||
        survey.default.properties[prop].isTCSOnly == undefined
    );

  const [allTabs] = useState({
    assignProgrammer: "Assign Programmer",
    testLink: "Test Link Sent",
    projectField: "Project In Field",
    close: "Close Job",
    cancelled: "Cancelled",
  });
  const [allTabsStatus, setTabStatus] = useState({
    assignProgrammer: false,
    testLink: false,
    projectField: false,
    close: false,
    cancelled: false,
  });
  const [activeTab, setActiveTab] = useState(Object.keys(allTabs).shift());

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    // <Layout>
    <div className={`container ${props.isNotEditable ? "not-editable" : ""}`}>
      <Container>
        <Card>
          <CardHeader
            onClick={(e) =>
              setTabStatus({
                ...allTabsStatus,
                assignProgrammer: !allTabsStatus.assignProgrammer,
              })
            }
          >
            <Row>
              <Col xs="11">
                <CardTitle className="mb-0">Assign Programmer</CardTitle>
              </Col>
              <Col xs="1">
                <FontAwesomeIcon
                  className="align-middle mr-2"
                  icon={
                    !allTabsStatus.assignProgrammer
                      ? faChevronRight
                      : faChevronDown
                  }
                  fixedWidth
                />
              </Col>
            </Row>
          </CardHeader>
          <Collapse isOpen={allTabsStatus.assignProgrammer}>
            <CardBody>
              <Row xs="12">
                {_.includes(surveyFields, "programmerAssigned") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Programmer Assigned
                    </Col>
                    <Col xs="6" className="form-group">
                      {/* <select
                        className="form-control searchable"
                        defaultValue={props.editableDelivery.ProgrammerAssigned}
                        onChange={(e) => props.editSurveyForm(e)}
                        id="ProgrammerAssigned"
                      >
                        <option value={0}>Please select an option</option>
                        {props.programmers?.map((pro) => (
                          <option value={pro.Email}>{pro.Email}</option>
                        ))}
                      </select> */}
                      <Select
                        className="custom-select-box"
                        isSearchable={true}
                        options={props.programmers.map((ddto) => {
                          return {
                            value: ddto.Email,
                            label: ddto.Email,
                          };
                        })}
                        defaultValue={
                          props.editableDelivery.ProgrammerAssigned
                            ? {
                                value: _.head(
                                  props.programmers.filter(
                                    (pro) =>
                                      pro.Email ==
                                      props.editableDelivery.ProgrammerAssigned
                                  )
                                )?.Email,
                                label: _.head(
                                  props.programmers.filter(
                                    (pro) =>
                                      pro.Email ==
                                      props.editableDelivery.ProgrammerAssigned
                                  )
                                )?.Email,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          props.editSurveyForm({
                            target: {
                              id: "ProgrammerAssigned",
                              value: e ? e.value : "",
                            },
                          });
                        }}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "groupLeadName") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Group Lead Name
                    </Col>
                    <Col xs="6" className="form-group">
                      {/* <select
                        className="form-control"
                        defaultValue={props.editableDelivery.GroupLeadEmail}
                        onChange={(e) => props.editSurveyForm(e)}
                        id="GroupLeadEmail"
                      >
                        <option value={0}></option>
                        {props.teamLeads?.map((tl) => (
                          <option value={tl.Email}>{tl.Email}</option>
                        ))}
                      </select> */}
                      <Select
                        className="custom-select-box"
                        isSearchable={true}
                        options={props.teamLeads.map((ddto) => {
                          return {
                            value: ddto.Email,
                            label: ddto.Email,
                          };
                        })}
                        defaultValue={
                          props.editableDelivery.GroupLeadEmail
                            ? {
                                value: _.head(
                                  props.teamLeads.filter(
                                    (pro) =>
                                      pro.Email ==
                                      props.editableDelivery.GroupLeadEmail
                                  )
                                )?.Email,
                                label: _.head(
                                  props.teamLeads.filter(
                                    (pro) =>
                                      pro.Email ==
                                      props.editableDelivery.GroupLeadEmail
                                  )
                                )?.Email,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          props.editSurveyForm({
                            target: {
                              id: "GroupLeadEmail",
                              value: e ? e.value : "",
                            },
                          });
                        }}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "initialSetupCTDays") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Initial Setup CT Days
                    </Col>
                    <Col xs="6" className="form-group">
                      <select
                        className="form-control"
                        id="InitialSetupCTDays"
                        defaultValue={props.editableDelivery.InitialSetupCTDays}
                        onChange={(e) => props.editSurveyForm(e)}
                      >
                        <option value={0}>Please select an option</option>
                        {codeLabels.DeliveryInitialSetupCTDaysOptions.map(
                          (ctc) => {
                            return (
                              <option value={ctc.Code}>{ctc.Label}</option>
                            );
                          }
                        )}
                      </select>
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "costCentre") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Cost Centre
                    </Col>
                    <Col xs="6" className="form-group">
                      {/* <select
                        className="form-control"
                        id="CostCentre"
                        defaultValue={props.editableDelivery.CostCentre}
                        onChange={(e) => props.editSurveyForm(e)}
                      >
                        <option value={0}>Please select an option</option>
                        {codeLabels.DeliveryCostCentreOptions.map((ctc) => {
                          return <option value={ctc.Code}>{ctc.Label}</option>;
                        })}
                      </select> */}

                      <Select
                        className="custom-select-box"
                        isSearchable={true}
                        options={codeLabels.DeliveryCostCentreOptions.map(
                          (ddto) => {
                            return {
                              value: ddto.Code,
                              label: ddto.Label,
                            };
                          }
                        )}
                        defaultValue={
                          props.editableDelivery.CostCentre
                            ? {
                                value: _.head(
                                  codeLabels.DeliveryCostCentreOptions.filter(
                                    (pro) =>
                                      pro.Code ==
                                      props.editableDelivery.CostCentre
                                  )
                                )?.Code,
                                label: _.head(
                                  codeLabels.DeliveryCostCentreOptions.filter(
                                    (pro) =>
                                      pro.Code ==
                                      props.editableDelivery.CostCentre
                                  )
                                )?.Label,
                              }
                            : ""
                        }
                        onChange={(e) => {
                          props.editSurveyForm({
                            target: {
                              id: "CostCentre",
                              value: e ? e.value : "",
                            },
                          });
                        }}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "complexityLevel") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Complexity Level
                    </Col>
                    <Col xs="6" className="form-group">
                      <select
                        className="form-control"
                        id="ComplexityLevel"
                        defaultValue={props.editableDelivery.ComplexityLevel}
                        onChange={(e) => props.editSurveyForm(e)}
                      >
                        <option value={0}>Please select an option</option>
                        {codeLabels.DeliveryComplexityLevelSPOptions.map(
                          (ctc) => {
                            return (
                              <option value={ctc.Code}>{ctc.Label}</option>
                            );
                          }
                        )}
                      </select>
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "platform") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Platform
                    </Col>
                    <Col xs="6" className="form-group">
                      <select
                        className="form-control"
                        id="Platform"
                        defaultValue={props.editableDelivery.Platform}
                        onChange={(e) => props.editSurveyForm(e)}
                      >
                        <option value={0}>Please select an option</option>
                        {codeLabels.DeliveryPlatformSPOptions.map((ctc) => {
                          return <option value={ctc.Code}>{ctc.Label}</option>;
                        })}
                      </select>
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "dataCollection") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Data Collection
                    </Col>
                    <Col xs="6" className="form-group">
                      <Select
                        className="custom-select-box"
                        isMulti={true}
                        options={codeLabels.DeliveryDataCollectionTypeOptions.map(
                          (ddto) => {
                            return {
                              value: ddto.Code,
                              label: ddto.Label,
                            };
                          }
                        )}
                        defaultValue={
                          props.editableDelivery?.DataCollectionMethod
                            ? props.editableDelivery.DataCollectionMethod.split(
                                ","
                              ).map((dm) => {
                                return {
                                  value: dm,
                                  label: getLabel(
                                    "DeliveryDataCollectionTypeOptions",
                                    dm
                                  ),
                                };
                              })
                            : ""
                        }
                        onChange={(e) => {
                          props.editSurveyForm({
                            target: {
                              id: "DataCollectionMethod",
                              value: e
                                ? e.map((val) => val.value).join()
                                : null,
                            },
                          });
                          if (
                            !_.includes(
                              e?.map((val) => val.value),
                              otherDeliveryCollectionCode
                            )
                          ) {
                            props.editSurveyForm({
                              target: {
                                id: "DataCollectionMethodOther",
                                value: null,
                              },
                            });
                          }
                        }}
                      />
                    </Col>
                  </>
                ) : null}
                {props.editableDelivery.DataCollectionMethod &&
                _.includes(
                  props.editableDelivery.DataCollectionMethod.split(","),
                  otherDeliveryCollectionCode
                ) ? (
                  <>
                    <Col xs="6" className="form-group">
                      Data Collection Other
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        id="DataCollectionMethodOther"
                        className="form-control"
                        defaultValue={
                          props.editableDelivery.DataCollectionMethodOther
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Container>
      <Container>
        <Card>
          <CardHeader
            onClick={(e) =>
              setTabStatus({
                ...allTabsStatus,
                testLink: !allTabsStatus.testLink,
              })
            }
          >
            <Row>
              <Col xs="11">
                <CardTitle className="mb-0">Test Link Sent</CardTitle>
              </Col>
              <Col xs="1">
                <FontAwesomeIcon
                  className="align-middle mr-2"
                  icon={
                    !allTabsStatus.testLink ? faChevronRight : faChevronDown
                  }
                  fixedWidth
                />
              </Col>
            </Row>
          </CardHeader>
          <Collapse isOpen={allTabsStatus.testLink}>
            <CardBody>
              <Row xs="12">
                {_.includes(surveyFields, "actualDateFinalQuestionnaire") ? (
                  <>
                    {" "}
                    <Col xs="6" className="form-group">
                      Actual Date Final Questionnaire to Programming
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="DateFinalQuestionnaireActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateFinalQuestionnaireActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                        type="date"
                      />
                    </Col>
                  </>
                ) : null}

                {_.includes(surveyFields, "actualDateProgrammingStart") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Actual Date Programming Start
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="DateProgrammingStartActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateProgrammingStartActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                        type="date"
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "firstTestLinkSentDate") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Date First Test Link Sent
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="DateFirstTestLinkActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateFirstTestLinkActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                        type="date"
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "changesBeforeDelivery") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Changes Before Initial Link Delivery
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ChangesBeforeInitialLinkDelivery"
                        defaultValue={
                          props.editableDelivery
                            .ChangesBeforeInitialLinkDelivery
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "testSurveyProjID") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Test Survey Project Id
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="TestSurveyProjectId"
                        defaultValue={
                          props.editableDelivery.TestSurveyProjectId
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Container>
      <Container>
        <Card>
          <CardHeader
            onClick={(e) =>
              setTabStatus({
                ...allTabsStatus,
                projectField: !allTabsStatus.projectField,
              })
            }
          >
            <Row>
              <Col xs="11">
                <CardTitle className="mb-0">Project In Field</CardTitle>
              </Col>
              <Col xs="1">
                <FontAwesomeIcon
                  className="align-middle mr-2"
                  icon={
                    !allTabsStatus.projectField ? faChevronRight : faChevronDown
                  }
                  fixedWidth
                />
              </Col>
            </Row>
          </CardHeader>
          <Collapse isOpen={allTabsStatus.projectField}>
            <CardBody>
              <Row xs="12">
                {_.includes(surveyFields, "DateLiveLinkProvided") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Date Live Link Provided
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        type="date"
                        id="DateLiveLinkActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateLiveLinkActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ActualStartFieldDate") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Actual Start Field Date
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        type="date"
                        id="DateFieldStartActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateFieldStartActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "NumberOfQuestions") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Number of Questions
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="NumberOfQuestions"
                        defaultValue={props.editableDelivery.NumberOfQuestions}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}

                {_.includes(surveyFields, "ChangesToUniqueQuestions") ? (
                  <>
                    <Col xs="6" className="form-group">
                      <span>
                        Changes to Unique Questions
                        <label className="ml-2 mr-2">
                          <input
                            type="checkbox"
                            id="ChangesToUniqueQuestionsNA"
                            defaultChecked={
                              props.editableDelivery.ChangesToUniqueQuestionsNA
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              props.editSurveyForm({
                                ...e,
                                target: {
                                  ...e.target,
                                  value: e.target.checked,
                                  id: e.target.id,
                                },
                              })
                            }
                          />
                        </label>
                        NA
                      </span>
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ChangesToUniqueQuestions"
                        disabled={
                          props.editableDelivery.ChangesToUniqueQuestionsNA
                            ? true
                            : false
                        }
                        value={
                          props.editableDelivery.ChangesToUniqueQuestions
                            ? props.editableDelivery.ChangesToUniqueQuestions
                            : props.editableDelivery.ChangesToUniqueQuestions ==
                              null
                            ? ""
                            : ""
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "NumberOfPids") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Number of PIDs
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="NumberOfPids"
                        defaultValue={props.editableDelivery.NumberOfPids}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ChangesAfterInitialLinkDelivery") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Changes After Initial Link Delivery
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ChangesAfterInitialLinkDelivery"
                        defaultValue={
                          props.editableDelivery.ChangesAfterInitialLinkDelivery
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "NumberOfIterations") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Number of Iterations TILL NOW
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="NumberOfIterations"
                        defaultValue={props.editableDelivery.NumberOfIterations}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ErrorsInInitialLinkDelivery") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Errors In Initial Link Delivery
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ErrorsInInitialLinkDelivery"
                        defaultValue={
                          props.editableDelivery.ErrorsInInitialLinkDelivery
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ErrorsAfterInitialLinkDelivery") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Errors After Initial Link Delivery
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ErrorsAfterInitialLinkDelivery"
                        defaultValue={
                          props.editableDelivery.ErrorsAfterInitialLinkDelivery
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "JobCount") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Job Count
                    </Col>
                    <Col xs="6" className="form-group">
                      <select
                        className="form-control"
                        id="JobCount"
                        defaultValue={props.editableDelivery.JobCount}
                        onChange={(e) => props.editSurveyForm(e)}
                      >
                        <option value={0}></option>
                        {codeLabels.DeliveryJobCountSP.map((dj) => (
                          <option value={dj.Code}>{dj.Label}</option>
                        ))}
                      </select>
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "LiveSurveyProjectId") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Live Survey Project Id
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="LiveSurveyProjectId"
                        defaultValue={
                          props.editableDelivery.LiveSurveyProjectId
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Container>
      <Container>
        <Card>
          <CardHeader
            onClick={(e) =>
              setTabStatus({ ...allTabsStatus, close: !allTabsStatus.close })
            }
          >
            <Row>
              <Col xs="11">
                <CardTitle className="mb-0">Close Job</CardTitle>
              </Col>
              <Col xs="1">
                <FontAwesomeIcon
                  className="align-middle mr-2"
                  icon={!allTabsStatus.close ? faChevronRight : faChevronDown}
                  fixedWidth
                />
              </Col>
            </Row>
          </CardHeader>
          <Collapse isOpen={allTabsStatus.close}>
            <CardBody>
              <Row xs="12">
                {_.includes(surveyFields, "ActualFieldEndDate") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Actual Field End Date
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        type="date"
                        id="DateFieldEndActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateFieldEndActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ActualDeliveryToGODate") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Actual Delivery To GO Date
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        type="date"
                        id="DateDeliveryToGOActual"
                        defaultValue={
                          props.editableDelivery.WaveSpec.DateDeliveryToGOActual?.split(
                            "T"
                          )[0]
                        }
                        onChange={(e) => props.editSurveyForm(e, true)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "PlatformProjectId") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Confirmit/Decipher/STG Project ID
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="PlatformProjectId"
                        defaultValue={props.editableDelivery.PlatformProjectId}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ChangesAfterLiveLinkCreated") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Changes After Live Link Created
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ChangesAfterLiveLinkCreated"
                        defaultValue={
                          props.editableDelivery.ChangesAfterLiveLinkCreated
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ErrorsAfterLiveLinkCreated") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Errors After Live Link Created
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ErrorsAfterLiveLinkCreated"
                        defaultValue={
                          props.editableDelivery.ErrorsAfterLiveLinkCreated
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "TotalNumberOfIterations") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Total Number Of Iterations (FINAL)
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="TotalNumberOfIterations"
                        defaultValue={
                          props.editableDelivery.TotalNumberOfIterations
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ActualLOI") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Actual LOI
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="ActualLOIMins"
                        defaultValue={props.editableDelivery.ActualLOIMins}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "TotalCompletes") ? (
                  <>
                    <Col xs="6" className="form-group">
                      Total Completes
                    </Col>
                    <Col xs="6" className="form-group">
                      <input
                        className="form-control"
                        id="TotalCompletes"
                        defaultValue={props.editableDelivery.TotalCompletes}
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Container>
      <Container>
        <Card>
          <CardHeader
            onClick={(e) =>
              setTabStatus({
                ...allTabsStatus,
                cancelled: !allTabsStatus.cancelled,
              })
            }
          >
            <Row>
              <Col xs="11">
                <CardTitle className="mb-0">Cancelled</CardTitle>
              </Col>
              <Col xs="1">
                <FontAwesomeIcon
                  className="align-middle mr-2"
                  icon={
                    !allTabsStatus.cancelled ? faChevronRight : faChevronDown
                  }
                  fixedWidth
                />
              </Col>
            </Row>
          </CardHeader>
          <Collapse isOpen={allTabsStatus.cancelled}>
            <CardBody>
              <Row xs="12">
                {_.includes(surveyFields, "CancelledDate") ? (
                  <>
                    <Col xs="6">Cancelled Date</Col>
                    <Col xs="6">
                      <input
                        className="form-control"
                        type="date"
                        id="CancelledDate"
                        defaultValue={
                          props.editableDelivery.CancelledDate?.split("T")[0]
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
                {_.includes(surveyFields, "ReasonForCancellation") ? (
                  <>
                    <Col xs="12">Reason for cancellation</Col>
                    <Col xs="12">
                      <textarea
                        className="form-control"
                        id="ReasonForCancellation"
                        defaultValue={
                          props.editableDelivery.ReasonForCancellation
                        }
                        onChange={(e) => props.editSurveyForm(e)}
                      />
                    </Col>
                  </>
                ) : null}
              </Row>
            </CardBody>
          </Collapse>
        </Card>
      </Container>
      {/* <div className="d-flex justify-content-between">
                <button className="btn btn-warning mt-2 float-right btn-md"
                    disabled={app.recordloading}
                    onClick={() => history.replace('/deliveries')}
                >Cancel</button>
                <button className="btn btn-primary mt-2 float-right btn-md"
                    disabled={app.recordloading}
                    onClick={submitSurveyInfo}>
                    Save
                        {app.recordloading ? (
                        <Spinner size="small" color="#000000" />
                    ) : null}</button>
            </div> */}
    </div>
    // </Layout>
  );
};

export default SurveyInformation;

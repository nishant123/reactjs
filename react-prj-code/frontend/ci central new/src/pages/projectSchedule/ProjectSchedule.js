import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import * as currentProjectActions from "../../redux/actions/currentProjectActions";
import * as costingsActions from "../../redux/actions/costingsActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import * as currentWaveSpecActions from "../../redux/actions/currentWaveSpecActions";
import axios from "../../axios-interceptor";
import { toastr } from "react-redux-toastr";

import Layout from "../../layouts/Project";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faQuestionCircle,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  CustomInput,
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Collapse,
  CardHeader,
  CardTitle,
  CardText,
  Tooltip,
  Modal,
  Badge,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import { setWaveSpecs } from "../../redux/actions/waveSpecsActions";
import Selector from "../../components/Selector/Selector";
import { getLabel } from "../../utils/codeLabels";
import FormFeedback from "reactstrap/lib/FormFeedback";
import Spinner from "../../components/Spinner";

const ProjectSchedule = () => {
  const user = useSelector(({ user }) => user.userRecord);
  const project = useSelector(
    ({ currentProject }) => currentProject.newProject
  );
  const costingProfiles = useSelector(
    ({ costings }) => costings.costingProfiles
  );
  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );

  const [editableCostingProfile, setEditableCosting] = useState(
    currentCostingProfile
  );

  const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
  const currentWaveSpec = useSelector(({ currentWaveSpec }) => currentWaveSpec);
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const app = useSelector(({ app }) => app);

  const [isSaveModal, setSaveModal] = useState(false);
  const [ewnCautionOpen, setEwnCaution] = useState(false);
  const [waveEditModal, setWaveEditModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editableWaveName, setEditableWavename] = useState();
  const dispatch = useDispatch();

  const [toggle, setToggle] = useState({
    overall: true,
    inst: true,
    other: true,
  });
  const [Fields, updateFields] = useState({
    "Commissioning Information": {
      id: "CommissioningInformation",
      DateFields: [
        {
          id: "DateWaveCommissioned",
          label: "Date Commissioned",
        },
      ],
      NotesField: {
        id: "NotesPM",
        label: "Notes for Project Manager",
      },
    },
    "Survey Programming": {
      id: "SurveyProgramming",
      DisablingVal: "DateFinalQuestionnaireNA",
      DateFields: [
        {
          id: "DateFinalQuestionnaire",
          label: "Date Final Questionnaire Available",
        },
      ],
      NotesField: {
        id: "NotesFinalQuestionnaire",
        label: "Notes for Programming team",
      },
    },
    "Field Work": {
      id: "Field Work",
      DisablingVal: "DateFieldworkNA",
      DateFields: [
        {
          id: "DateFieldStart",
          label: "Date Field Start",
        },
        {
          id: "DateFieldEnd",
          label: "Date Field End",
        },
      ],
      NotesField: {
        id: "NotesFieldwork",
        label: "Notes for Field Work",
      },
    },
    "Data Processing": {
      id: "Data Processing",
      DisablingVal: "DateDataProcessingNA",
      DateFields: [
        {
          id: "DateDataProcessing",
          label: "Date Data Processing Due",
        },
      ],
      NotesField: {
        id: "NotesDataProcessing",
        label: "Notes for Data Processing Team",
      },
    },
    Dashboarding: {
      id: "Dashboarding",
      DisablingVal: "DateDashboardsNA",
      DateFields: [
        {
          id: "DateDashboards",
          label: "Date Dashboard Due",
        },
      ],
      NotesField: {
        id: "NotesDashboards",
        label: "Notes for Dashboarding Team",
      },
    },
    Charting: {
      id: "Charting",
      DisablingVal: "DateChartsNA",
      DateFields: [
        {
          id: "DateCharts",
          label: "Date Charts Due",
        },
      ],
      NotesField: {
        id: "NotesCharts",
        label: "Notes for Charting Team",
      },
    },
    Translations: {
      id: "Translations",
      DisablingVal: "DateTranslationsNA",
      DateFields: [
        {
          id: "DateTranslations",
          label: "Date Translations Due",
        },
      ],
      NotesField: {
        id: "NotesTranslations",
        label: "Notes for Translations Team",
      },
    },
    "Verbatim Coding": {
      id: "VerbatimCoding",
      DisablingVal: "DateVerbatimCodingNA",
      DateFields: [
        {
          id: "DateVerbatimCoding",
          label: "Date Verbatim Coding Due",
        },
      ],
      NotesField: {
        id: "NotesVerbatimCoding",
        label: "Notes for Verbatim Coding Team",
      },
    },
    "Final Report": {
      id: "FinalReport",
      DisablingVal: "DateFinalReportNA",
      DateFields: [
        {
          id: "DateFinalReport",
          label: "Date Final Report Due to the Client",
        },
      ],
      NotesField: {
        id: "NotesFinalReport",
        label: "Any Notes on Final Reporting",
      },
    },
  });
  const collapseAll = () => {
    let Toggle = { ...toggle };
    Object.keys(Fields).map((field) => {
      Toggle[Fields[field].id] = !toggle.overall;
    });
    Object.keys(Toggle).map((t) => {
      Toggle[t] = !toggle.overall;
    });
    setToggle({ ...Toggle, overall: !toggle.overall });
  };
  const history = useHistory();

  useEffect(() => {
    setEditableCosting(currentCostingProfile);
  }, [currentCostingProfile]);

  const selectorHandler = (item) => {
    // do nothing if clicked item is current item
    if (item.id === currentWaveSpec.id) return;

    const itemIndex = waveSpecs.findIndex(
      (record) => record.id === currentWaveSpec.id
    );
    const newArr = update(waveSpecs, {
      [itemIndex]: { $set: currentWaveSpec },
    });
    dispatch(currentWaveSpecActions.selectWaveSpec(item));
    dispatch(setWaveSpecs(newArr));
  };
  const renderSelector = () => {
    if (!waveSpecs || (waveSpecs && waveSpecs.length === 1)) return null;
    return (
      <Col lg="2" md="2" sm="12" xs="12">
        <Selector
          heading={"Waves"}
          records={waveSpecs}
          // applyAll={applyToAllWaves}
          // applyAllText={"Apply to All Waves"}
          clicked={selectorHandler}
          interPolField={["WaveNumber", "WaveName"]}
          displayField={
            <>
              <FontAwesomeIcon
                title="Edit Wave Name"
                size="xs"
                icon={faPen}
                className="pointer"
                onClick={() => setWaveEditModal(!waveEditModal)}
              />
            </>
          }
          selected={currentWaveSpec}
          //   labelGroup={"FieldingCountriesOptions"}
        />
      </Col>
    );
  };

  const onChangeHandler = (eve, useCurrentSpec, isApi) => {
    let currentwavespec = {};
    if (useCurrentSpec) {
      currentwavespec = {
        ...useCurrentSpec,
        [eve.target.id]: eve.target.value,
      };
    } else {
      currentwavespec = {
        ...currentWaveSpec,
        [eve.target.id]: eve.target.value,
      };
    }

    //clearing finance notes when unchecked IncludeFinanceInComms
    if (eve.target.id == "IncludeFinanceInComms" && !eve.target.value)
      currentwavespec = { ...currentwavespec, NotesFinance: null };

    let wavespecs = [...waveSpecs];
    wavespecs = wavespecs.map((ws) => {
      if (ws.id == currentWaveSpec.id) {
        ws = currentwavespec;
      }
      return { ...ws };
    });
    dispatch(setWaveSpecs([...wavespecs]));
    dispatch(
      currentWaveSpecActions.updateCurrentWaveSpec({ ...currentwavespec })
      //   update(currentWaveSpec, {
      //     $set: { ...currentwavespec },
      //   })
      // )
    );

    let editablecostingprofile = { ...editableCostingProfile };
    editablecostingprofile.WaveSpecs = editablecostingprofile.WaveSpecs.map(
      (ws) => {
        if (ws.id == currentwavespec.id) {
          return { ...currentwavespec };
        } else {
          return { ...ws };
        }
      }
    );
    setEditableCosting(editablecostingprofile);
    if (isApi) {
      dispatch(
        currentCostingActions.saveCostingProfile(
          { ...editablecostingprofile },
          () => setWaveEditModal(false)
        )
      );
      dispatch(
        currentCostingActions.updateCostingProfiles(costingProfiles, {
          ...editablecostingprofile,
        })
      );
    }

    // dispatch(updateCurrentWaveSpec({...currentwavespec}))
  };

  const onTogglingChecks = (eve) => {
    if (eve.target.value) {
      let currentwavespec = { ...currentWaveSpec };
      let targetId = eve.target.id;
      let requiredField = _.head(
        Object.keys(Fields).filter(
          (field) => Fields[field].DisablingVal == targetId
        )
      );

      let fields = { ...Fields };
      fields[requiredField].isInvalid = false;
      updateFields({ ...fields });

      Fields[requiredField].DateFields.map((df) => {
        currentwavespec[df.id] = null;
      });
      currentwavespec[Fields[requiredField].NotesField.id] = null;
      onChangeHandler(
        { target: { id: eve.target.id, value: eve.target.value } },
        currentwavespec
      );
    } else {
      onChangeHandler({
        target: { id: eve.target.id, value: eve.target.value },
      });
    }
  };
  const validateDates = () => {
    let isInvalid = false;
    let fields = { ...Fields };
    Object.keys(fields).map((field) => {
      if (
        (fields[field].DisablingVal &&
          !currentWaveSpec[fields[field].DisablingVal]) ||
        !fields[field].DisablingVal
      ) {
        fields[field].DateFields.map((df) => {
          if (!currentWaveSpec[df.id]) {
            fields[field].isInvalid = true;
            isInvalid = true;
          } else fields[field].isInvalid = false;
        });
      }
    });
    updateFields({ ...fields });
    if (!isInvalid) {
      if (!currentWaveSpec.WaveFolderId) {
        toastr.info(
          "Please wait while the wave folder and project box are being created..."
        );
        axios
          .post("/utils/folders/waves/" + currentWaveSpec.id)
          .then((res) => {
            dispatch(
              currentWaveSpecActions.updateCurrentWaveSpec({
                WaveFolderId: res.data.WaveFolderId,
                ProjectBoxId: res.data.ProjectBoxId,
              })
            );
            toastr.success(res.data.message);
          })
          .catch((err) => {
            toastr.error("Wave Folder Creation Failed");
          });
      }
      dispatch(
        currentCostingActions.saveSchedule(editableCostingProfile, () =>
          setSaveModal(true)
        )
      );
      setErrorMessage("");
    } else {
      setErrorMessage("Please review your form inputs and try again.");
    }
  };
  const updateWaveSpecs = () => {
    dispatch(
      currentCostingActions.saveCostingProfile(editableCostingProfile, () => {
        if (currentWaveSpec.IncludeFinanceInComms) {
          axios
            .post("/utils/mail/" + currentWaveSpec.id + "/finance/schedule")
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        axios
          .post("/utils/mail/" + currentWaveSpec.id + "/ewn/all")
          .then((res) => {
            console.log(res);
            toastr.success("Mail Sending Success", res.data.message);
          })
          .catch((err) => {
            console.log(err);
            toastr.error("Mail Sending Failed", err.data.message);
          });
        setSaveModal(false);
      })
    );
  };
  return (
    <Layout
      profileStatusToDisplay={getLabel(
        "CostingStatusOptions",
        currentCostingProfile.ProfileStatus
      )}
      projectStatusToDisplay={getLabel(
        "ProjectStatusOptions",
        currentCostingProfile.Project?.ProjectStatus
      )}
    >
      <>
        <Container>
          <Card>
            <CardHeader>
              <Row>
                <Col xs="9">
                  <CardTitle className="text-uppercase">
                    Operations Schedule
                  </CardTitle>
                </Col>
                <Col xs="3">
                  <Link
                    className=" p-1 medium float-right mr-2"
                    onClick={(e) => {
                      collapseAll();
                      // setToggle({
                      //   ...toggle,
                      //   overall: !toggle.overall,
                      //   other: !toggle.overall ? true : false,
                      //   inst: !toggle.overall ? true : false,
                      // })
                    }}
                  >
                    <Label className="mb-0 mr-1 small">
                      {!toggle.overall ? "Expand All" : "Collapse All"}
                    </Label>
                    <FontAwesomeIcon
                      icon={!toggle.overall ? faChevronDown : faChevronUp}
                      fixedWidth
                      className="mb-0 mr-3 medium"
                    />
                  </Link>
                </Col>
              </Row>
            </CardHeader>
          </Card>
        </Container>
        <Container>
          <Card className="ml-2 mr-2 mb-2">
            <CardHeader
              onClick={(e) => setToggle({ ...toggle, inst: !toggle.inst })}
            >
              <Row className="mb-0 d-flex justify-content-between">
                <Col xs="11" className="align-self-center">
                  <Row className="mb-0 d-flex justify-content-start">
                    <Col className="align-self-center">
                      <CardTitle className="mb-0">
                        Wave #{currentWaveSpec.WaveNumber}{" "}
                        {currentWaveSpec.WaveName}
                      </CardTitle>
                    </Col>
                    <Col className="align-self-center">
                      {/* <Badge title="Wave Status"> */}
                      {/* Awaiting Schedule */}
                      {/* {
                          getLabel(
                            "WaveStatusOptions",
                            currentWaveSpec.WaveStatus
                          )
                          //Todo: setup WaveStatusOptions on Backend, temporarily hardcoding status to "Awaiting Schedule" which will be default.
                        } */}
                      {/* </Badge> */}
                    </Col>
                    <Col className="align-self-center">
                      <Button
                        color="secondary"
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();

                          if (currentWaveSpec.WaveFolderId) {
                            window.open(
                              "https://drive.google.com/drive/folders/" +
                                currentWaveSpec.WaveFolderId
                            );
                          } else {
                            e.target.disabled = true;
                            e.persist();
                            toastr.info(
                              "Please wait while the wave folder is being created..."
                            );
                            axios
                              .post(
                                "/utils/folders/waves/" + currentWaveSpec.id
                              )
                              .then((res) => {
                                e.target.disabled = false;
                                dispatch(
                                  currentWaveSpecActions.updateCurrentWaveSpec({
                                    WaveFolderId: res.data.WaveFolderId,
                                    ProjectBoxId: res.data.ProjectBoxId,
                                  })
                                );
                                toastr.success(res.data.message);
                                window.open(
                                  "https://drive.google.com/drive/folders/" +
                                    res.data.WaveFolderId
                                );
                              })
                              .catch((err) => {
                                e.target.disabled = false;

                                toastr.error("Wave Folder Creation Failed");
                              });
                          }
                        }}
                      >
                        Upload Files
                      </Button>
                      {currentWaveSpec.ProjectBoxId ? (
                        <Button
                          color="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              "https://docs.google.com/spreadsheets/d/" +
                                currentWaveSpec.ProjectBoxId
                            );
                          }}
                        >
                          Open ProjectBox
                        </Button>
                      ) : null}
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs="1"
                  className="d-flex align-self-center justify-content-center"
                >
                  <FontAwesomeIcon
                    className="align-middle mr-2"
                    icon={!toggle.inst ? faChevronRight : faChevronDown}
                    fixedWidth
                  />
                </Col>
              </Row>
            </CardHeader>
            <Collapse isOpen={toggle.inst}>
              <CardBody>
                <Row>
                  <Col>
                    <CardText>
                      These input boxes are
                      <mark>not for the PPM or briefing notes</mark>, please
                      enter here just the info the Ops team will need prior to
                      the PPM, especially to schedule and book vendors or to
                      recover a questionnaire from archive, any watchouts, any
                      requests for assigning or booking vendors, etc.
                    </CardText>
                    <CardText>
                      The PPM notes must be entered in the Project Box Project
                      notes tab, which will be available as soon as you click on
                      "Save" below.
                    </CardText>
                    <CardText>
                      Please ensure you click on the Save button at the bottom
                      of the page to save this information
                    </CardText>
                  </Col>
                </Row>
              </CardBody>
            </Collapse>
          </Card>
        </Container>
        <Container>
          <Card
            className="ml-2 mr-2 mb-0 p-0"
            style={{ background: "none", boxShadow: "none" }}
          >
            <Row>
              {renderSelector()}
              <Col>
                {Object.keys(Fields).map((field) => {
                  return (
                    <Card className="mb-2">
                      <CardHeader
                        className="mb-0"
                        onClick={(e) =>
                          setToggle({
                            ...toggle,
                            [Fields[field].id]: !toggle[Fields[field].id],
                          })
                        }
                      >
                        <Row className="mb-0">
                          <Col xs="11">
                            <CardTitle className="mb-0">
                              {field}
                              {Fields[field].isInvalid ? (
                                <CardText className="error small">
                                  Please review your form inputs.
                                </CardText>
                              ) : null}
                            </CardTitle>
                          </Col>
                          <Col xs="1">
                            <FontAwesomeIcon
                              className="align-middle mr-2"
                              icon={
                                !toggle[Fields[field].id]
                                  ? faChevronRight
                                  : faChevronDown
                              }
                              fixedWidth
                            />
                          </Col>
                        </Row>
                      </CardHeader>
                      <Collapse isOpen={toggle[Fields[field].id]}>
                        <CardBody>
                          <Row className="mb-2">
                            <Col lg="4" md="4" sm="12" xs="12">
                              {Fields[field].DateFields.map((df) => {
                                return (
                                  <>
                                    <Label>{df.label}</Label>
                                    <Input
                                      invalid={
                                        Fields[field].isInvalid &&
                                        !currentWaveSpec[df.id]
                                      }
                                      className="mb-2"
                                      id={df.id}
                                      onChange={(eve) => onChangeHandler(eve)}
                                      disabled={
                                        currentWaveSpec[
                                          Fields[field].DisablingVal
                                        ]
                                      }
                                      value={
                                        currentWaveSpec[df.id]
                                          ? _.head(
                                              currentWaveSpec[df.id].split("T")
                                            )
                                          : ""
                                      }
                                      type="date"
                                    />
                                    {Fields[field].isInvalid &&
                                    !currentWaveSpec[df.id] ? (
                                      <FormFeedback>
                                        Please provide a date or select not
                                        applicable.
                                      </FormFeedback>
                                    ) : null}
                                  </>
                                );
                              })}
                            </Col>
                          </Row>
                          <Row className="mb-2">
                            <Col lg="4" md="4" sm="12" xs="12">
                              {Fields[field].DisablingVal ? (
                                <>
                                  <Label className="ml-4">
                                    <Input
                                      type="checkbox"
                                      onChange={(eve) =>
                                        onTogglingChecks({
                                          target: {
                                            ...eve.target,
                                            value: eve.target.checked,
                                            id: Fields[field].DisablingVal,
                                          },
                                        })
                                      }
                                      checked={
                                        currentWaveSpec[
                                          Fields[field].DisablingVal
                                        ] != null
                                          ? currentWaveSpec[
                                              Fields[field].DisablingVal
                                            ]
                                          : ""
                                      }
                                      id={Fields[field].DisablingVal}
                                    />
                                    Not Required/TBC
                                  </Label>
                                </>
                              ) : null}
                            </Col>
                          </Row>

                          {!currentWaveSpec[Fields[field].DisablingVal] ? (
                            <Row className="mb-2">
                              <Col>
                                <label>{Fields[field].NotesField.label}</label>
                                {/* <textarea
                              rows="10"
                              className="form-control"
                              id={Fields[field].NotesField.id}
                              disabled={
                                currentWaveSpec[Fields[field].DisablingVal]
                              }
                              onChange={(eve) => onChangeHandler(eve)}
                              value={
                                currentWaveSpec[Fields[field].NotesField.id]
                                  ? currentWaveSpec[Fields[field].NotesField.id]
                                  : ""
                              }
                              placeholder="Please provide any relevant instructions here..."
                            ></textarea> */}
                                <Input
                                  id={Fields[field].NotesField.id}
                                  type="textarea"
                                  disabled={
                                    currentWaveSpec[Fields[field].DisablingVal]
                                  }
                                  onChange={(eve) => onChangeHandler(eve)}
                                  value={
                                    currentWaveSpec[Fields[field].NotesField.id]
                                      ? currentWaveSpec[
                                          Fields[field].NotesField.id
                                        ]
                                      : ""
                                  }
                                  placeholder="Please provide any relevant information here..."
                                />
                              </Col>
                            </Row>
                          ) : null}
                        </CardBody>
                      </Collapse>
                    </Card>
                  );
                })}
                <Card className="mb-0">
                  <CardHeader
                    onClick={(e) =>
                      setToggle({ ...toggle, other: !toggle.other })
                    }
                  >
                    <Row>
                      <Col xs="11">
                        <CardTitle className="mb-0">
                          Other Requirements
                        </CardTitle>
                      </Col>
                      <Col xs="1">
                        <FontAwesomeIcon
                          className="align-middle mr-2"
                          icon={!toggle.other ? faChevronRight : faChevronDown}
                          fixedWidth
                        />
                      </Col>
                    </Row>
                  </CardHeader>
                  <Collapse isOpen={toggle.other}>
                    <CardBody>
                      <Row className="mb-2">
                        <Col>
                          <Label>Notes for Data/Measurement Science</Label>
                          {/* <textarea
                              <Input
                                id={Fields[field].NotesField.id}
                                type="textarea"
                                disabled={
                                  currentWaveSpec[Fields[field].DisablingVal]
                                }
                                onChange={(eve) => onChangeHandler(eve)}
                                value={
                                  currentWaveSpec[Fields[field].NotesField.id]
                                    ? currentWaveSpec[
                                    Fields[field].NotesField.id
                                    ]
                                    : ""
                                }
                                placeholder="Please provide any relevant instructions here..."
                              />
                            </Col>
                          </Row>
                        ) : null}
                      </CardBody>
                    </Collapse>
                  </Card>
                );
              })}
              <Card className="ml-2 mr-2">
                <CardHeader
                  onClick={(e) =>
                    setToggle({ ...toggle, other: !toggle.other })
                  }
                >
                  <Row>
                    <Col xs="11">
                      <CardTitle className="mb-0">Other Requirements</CardTitle>
                    </Col>
                    <Col xs="1">
                      <FontAwesomeIcon
                        className="align-middle mr-2"
                        icon={!toggle.other ? faChevronRight : faChevronDown}
                        fixedWidth
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <Collapse isOpen={toggle.other}>
                  <CardBody>
                    <Row className="mb-2">
                      <Col>
                        <Label>Notes for Data/Measurement Science</Label>
                        {/* <textarea
                        className="form-control mb-2"
                        id="NotesDataScience"
                        onChange={(eve) => onChangeHandler(eve)}
                        value={
                          currentWaveSpec.NotesDataScience
                            ? currentWaveSpec.NotesDataScience
                            : ""
                        }
                        placeholder="Please provide any data/measurement science related notes here..."
                      ></textarea> */}
                          <Input
                            className="mb-2"
                            type="textarea"
                            id="NotesDataScience"
                            onChange={(eve) => onChangeHandler(eve)}
                            value={
                              currentWaveSpec.NotesDataScience
                                ? currentWaveSpec.NotesDataScience
                                : ""
                            }
                            placeholder="Please provide any data/measurement science related notes here..."
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Label>Other Notes</Label>
                          {/* <textarea
                        className="form-control mb-2"
                        onChange={(eve) => onChangeHandler(eve)}
                        id="NotesOther"
                        value={
                          currentWaveSpec.NotesOther
                            ? currentWaveSpec.NotesOther
                            : ""
                        }
                        placeholder="Any other notes or topics not covered elsewhere..."
                      ></textarea> */}
                          <Input
                            id="NotesOther"
                            type="textarea"
                            className="mb-2"
                            onChange={(eve) => onChangeHandler(eve)}
                            value={
                              currentWaveSpec.NotesOther
                                ? currentWaveSpec.NotesOther
                                : ""
                            }
                            placeholder="Any other notes or topics not covered elsewhere..."
                          />
                        </Col>
                      </Row>
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>
          </Card>
        </Container>
      </>

      {errorMessage ? (
        <Container className="text-center mt-4">
          <h5 className="error">
            <strong>{errorMessage}</strong>
          </h5>
        </Container>
      ) : null}
      <Container className="d-flex mt-4 mr-2 justify-content-end">
        <Button
          disabled={app.recordloading}
          className="float-right"
          color="primary"
          onClick={() => {
            validateDates();
            // setSaveModal(true);
          }}
        >
          Save
          {app.recordloading && !waveEditModal && !isSaveModal ? (
            <Spinner size="small" color="#495057" />
          ) : null}
        </Button>
      </Container>
      <Container className="d-flex justify-content-center">
        <Badge href="#" color="secondary">
          Back to top ↑
        </Badge>
      </Container>
      <Modal isOpen={isSaveModal} toggle={() => setSaveModal(false)} size="md">
        <ModalHeader toggle={() => setSaveModal(false)}>
          <h4>Early Warning Notification</h4>
        </ModalHeader>
        <ModalBody>
          <p>Your changed have saved successfully.</p>
          <p>
            <strong>Would you like to send out an updated EWN?</strong>
          </p>
          <p>
            An email notification will be sent out to all relevant operations
            teams if the dates are provided for the team.
          </p>
          <p>
            <em>
              Please Note: You are also required to include finance in the
              notifications{" "}
              <strong>
                if there are any changes in fieldwork or reports due dates.
              </strong>{" "}
              A seperate notification will be sent to the Finance Team contacts.
            </em>
          </p>
          {currentWaveSpec.IncludeFinanceInComms ? (
            <Input
              type="textarea"
              id="NotesFinance"
              //className="form-control"
              onChange={(eve) => onChangeHandler(eve)}
              value={
                currentWaveSpec.NotesFinance ? currentWaveSpec.NotesFinance : ""
              }
              rows="3"
              placeholder="Please provide any relevant notes for Finance Team here..."
            />
          ) : null}
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <div className="d-flex">
            {/* <span>
              <label>
                <input
                  type="checkbox"
                  id="IncludeProjectTeamInComms"
                  onChange={(eve) =>
                    onChangeHandler({
                      target: {
                        ...eve.target,
                        value: eve.target.checked,
                        id: "IncludeProjectTeamInComms",
                      },
                    })
                  }
                  defaultChecked={currentWaveSpec.IncludeProjectTeamInComms}
                />
                Include Project Team
              </label>

              <FontAwesomeIcon
                icon={faQuestionCircle}
                id="ewnCaution"
                className="pointer ml-1"
              />
            </span> */}
            <CustomInput
              type="checkbox"
              id="IncludeProjectTeamInComms"
              label="Include Other Client Service Contacts"
              defaultChecked={currentWaveSpec.IncludeProjectTeamInComms}
              onChange={(eve) =>
                onChangeHandler({
                  target: {
                    ...eve.target,
                    value: eve.target.checked,
                    id: "IncludeProjectTeamInComms",
                  },
                })
              }
              className="mr-2"
            />
            <CustomInput
              type="checkbox"
              id="IncludeFinance"
              label="Include Finance"
              defaultChecked={currentWaveSpec.IncludeFinanceInComms}
              onChange={(eve) =>
                onChangeHandler({
                  target: {
                    ...eve.target,
                    value: eve.target.checked,
                    id: "IncludeFinanceInComms",
                  },
                })
              }
            />
            {/* <Tooltip
              placement="bottom"
              isOpen={ewnCautionOpen}
              hideArrow={true}
              target="ewnCaution"
              toggle={() => setEwnCaution(!ewnCautionOpen)}
            >
              <p>
                Please leave the setting unchecked if you{" "}
                <strong>DO NOT</strong> want other Client Service contacts to be
                sent a copy of this EWN.
              </p>
              <p>
                Please Note: All relevant Operations teams will always be sent
                an EWN.
              </p>
            </Tooltip> */}
          </div>
          <div className="d-flex">
            <Button
              color="secondary"
              disabled={app.recordloading}
              onClick={() => setSaveModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="ml-2"
              color="primary"
              disabled={app.recordloading}
              onClick={() => updateWaveSpecs()}
            >
              Send EWN
              {app.recordloading ? (
                <Spinner size="small" color="#495057" />
              ) : null}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={waveEditModal}
        toggle={() => setWaveEditModal(!waveEditModal)}
        centered
      >
        <ModalHeader toggle={() => setWaveEditModal(!waveEditModal)}>
          Edit Current Wave Name
        </ModalHeader>
        <ModalBody>
          <Input
            defaultValue={
              currentWaveSpec.WaveName ? currentWaveSpec.WaveName : ""
            }
            id="WaveName"
            onChange={(e) => setEditableWavename(e.target.value)}
            placeholder="Enter Wave Name"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={app.recordloading}
            onClick={(e) => {
              onChangeHandler(
                { target: { id: "WaveName", value: editableWaveName } },
                null,
                true
              );
            }}
          >
            Update
            {app.recordloading ? (
              <Spinner size="small" color="#495057" />
            ) : null}
          </Button>
          <Button
            color="secondary"
            disabled={app.recordloading}
            onClick={() => setWaveEditModal(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Layout>
  );
};

export default ProjectSchedule;

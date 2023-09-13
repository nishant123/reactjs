import React, { useState, useEffect, Suspense } from "react";
import { useHistory, Link } from "react-router-dom";
import { getLabel } from "../../utils/codeLabels";
import { connect, useSelector, useDispatch } from "react-redux";
import * as countryActions from "../../redux/actions/countrySpecsActions";
import * as currentProjectActions from "../../redux/actions/currentProjectActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import * as waveSpecsActions from "../../redux/actions/waveSpecsActions";
import { calcAll } from "../../utils/calculations";
import Layout from "../../layouts/Project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import update from "immutability-helper";
import RecordsSpinner from "../../components/RecordsSpinner";
import Spinner from "../../components/Spinner";
import axios from "../../axios-interceptor";
import { toastr } from "react-redux-toastr";
import {
  faChevronRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import ManualCostEntry from "./ManualCostEntry";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Label,
  CardText,
  Container,
  Collapse,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  Input,
} from "reactstrap";
import { updateCurrentWaveSpec } from "../../redux/actions/currentWaveSpecActions";
import { updateCostingProfiles } from "../../redux/actions/costingsActions";
import ModalCommissioning from "../summary/ModalCommissioning";
import ModalPostCommission from "../summary/ModalPostCommission";
import GlobalCostingSheet from "./GlobalCostingSheet";

const ProjectOverview = React.lazy(() => import("./ProjectOverview"));
const Methodology = React.lazy(() => import("./Methodologies"));
const OpsResources = React.lazy(() => import("./OpsResources"));
const CommercialHours = React.lazy(() => import("./CommercialHours"));

const Costing = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showManualCostEntry, setShowManualCostEntry] = useState(false);
  const [showSheetsCosts, setShowSheetsCosts] = useState(false);
  const [showCostMethod, setShowCostMethod] = useState(false);
  const [toggle, setToggle] = useState({
    projectOverview: true,
    methodology: true,
    opsResources: true,
    commercialHours: true,
    overall: true,
  });
  const [methodologyToggles, setMethodologyToggles] = useState({});

  const [validationError, setErrorMsg] = useState();
  const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
  const [waveEditModal, setWaveEditModal] = useState(false);
  const [editableWaveName, setEditableWavename] = useState();
  const costingProfiles = useSelector(
    ({ costings }) => costings.costingProfiles
  );
  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const app = useSelector(({ app }) => app);
  const costingStatus = useSelector(({ app }) => app.costingStatus);
  const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
  const currentWaveSpec = useSelector(({ currentWaveSpec }) => currentWaveSpec);
  // useEffect(() => {
  //   if (currentCostingProfile && currentCostingProfile.ProfileSetting) {
  //     if (!currentCostingProfile.ProfileSetting.CurrenciesData) {
  //       dispatch(currentCostingActions.setCurrencies())
  //     }
  //   }
  // }, [currentCostingProfile])
  // useEffect(
  //   () => () => {
  //     console.log("on page unmount, clear costing");
  //     props.clearCosting();
  //   },
  //   []
  // );
  const commercialFields = {
    "Associate Director": "CostIntCommAssociateDirector",
    "Data Science": "CostIntCommDataScience",
    Director: "CostIntCommDirector",
    "Executive Director": "CostIntCommExecDirector",
    Executive: "CostIntCommExecutive",
    Manager: "CostIntCommManager",
    "Senior Executive": "CostIntCommSeniorExecutive",
    "Senior Manager": "CostIntCommSeniorManager",
  };
  const costIntCommLabels = {
    CostIntCommExecDirector: "Executive Director",
    CostIntCommDirector: "Director",
    CostIntCommAssociateDirector: "Associate Director",
    CostIntCommSeniorManager: "Senior Manager",
    CostIntCommManager: "Manager",
    CostIntCommSeniorExecutive: "Senior Executive",
    CostIntCommExecutive: "Executive",
    CostIntCommDataScience: "Data Science",
  };
  const rateCardReferences = {
    "Executive Director": "ExecutiveDirector",
    Director: "Director",
    "Associate Director": "AssociateDirector",
    "Senior Manager": "SeniorManager",
    Manager: "Manager",
    "Senior Executive": "SeniorExecutive",
    Executive: "Executive",
    "Data Science": "DatascienceInternalComm",
  };
  useEffect(() => {
    if (currentCostingProfile && !currentCostingProfile.Project)
      history.replace("/");
  });
  useEffect(() => {
    if (toggle.methodology === false) {
      const newObj = {};
      for (const key in methodologyToggles) {
        newObj[key] = false;
      }
      setMethodologyToggles(newObj);
      console.log(newObj);
    }
  }, [toggle.methodology]);

  const validateForms = () => {
    let isValid = true;
    let countrySpecs = [...props.countrySpecs];
    countrySpecs.map((cs) => {
      if (cs.MethodologySpecs) {
        cs.MethodologySpecs.map((ms) => {
          ms.RFQSchema.invalidProps = [];
          if (!ms.NotApplicable) {
            Object.keys(ms.RFQSchema.properties).map((pps) => {
              if (
                ms.RFQSchema.required &&
                ms.RFQSchema.required.indexOf(pps) != -1
              ) {
                if ((ms.RFQData && !ms.RFQData[pps]) || !ms.RFQData) {
                  ms.RFQSchema.invalidProps.push(pps);
                  isValid = false;
                }
                if (
                  ms.RFQSchema.properties[pps] &&
                  ms.RFQSchema.properties[pps].enum &&
                  ms.RFQData &&
                  ms.RFQData[pps] &&
                  ms.RFQSchema.dependencies &&
                  ms.RFQSchema.dependencies[pps]
                ) {
                  ms.RFQSchema.dependencies[pps].oneOf.map((rfdep) => {
                    if (
                      rfdep.properties[pps].enum.indexOf(ms.RFQData[pps]) != -1
                    ) {
                      Object.keys(rfdep.properties).map((rfdepprops) => {
                        if (
                          ms.RFQSchema.required.indexOf(rfdepprops) != -1 &&
                          !ms.RFQData[rfdepprops]
                        ) {
                          ms.RFQSchema.invalidProps.push(rfdepprops);
                          isValid = false;
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
    if (!isValid) {
      props.setCountrySpecs(countrySpecs);
      return false;
    } else {
      return true;
    }
  };

  const submitCostingProfile = () => {
    if (validateForms()) {
      console.log("submit costing clicked");
      const updatedCosting = update(props.currentCostingProfile, {
        ["CountrySpecs"]: { $set: props.countrySpecs },
      });
      const costingProfileToSave = update(updatedCosting, {
        ["Project"]: { $set: props.project },
      });
      console.log("updated costing here");
      console.log(costingProfileToSave);
      console.log(calcAll);
      let newWaveSpecs = calcAll(
        props.project,
        costingProfileToSave,
        props.countrySpecs,
        waveSpecs,
        props.rateCards
      );

      let CSRateCardUsed = {};
      if (
        costingProfileToSave.ProfileSetting &&
        costingProfileToSave.ProfileSetting.CSRateCardUsed
      ) {
        CSRateCardUsed = costingProfileToSave.ProfileSetting.CSRateCardUsed;
      }
      costingProfileToSave.WaveSpecs = [...newWaveSpecs];
      Object.keys(commercialFields).map((cf) => {
        costingProfileToSave[commercialFields[cf]] = 0;
        costingProfileToSave.WaveSpecs.map((ws) => {
          ws[commercialFields[cf]] =
            ws.CommercialHoursData && ws.CommercialHoursData[cf]
              ? ws.CommercialHoursData[cf]["Total"] *
                CSRateCardUsed[rateCardReferences[cf]]
              : 0;
          costingProfileToSave[commercialFields[cf]] =
            costingProfileToSave[commercialFields[cf]] +
            ws[commercialFields[cf]];
        });
      });

      dispatch(waveSpecsActions.setWaveSpecs(newWaveSpecs));
      dispatch(currentCostingActions.profileCalc(costingProfileToSave)); // redundant

      props.saveCostingProfile(costingProfileToSave);
      setErrorMsg("");
    } else {
      toastr.error("Cannot Save Profile", "Please review your form inputs");
      setErrorMsg("Please review your form inputs.");
    }
  };

  const chooseCostMethod = (method) => {
    dispatch({
      type: currentCostingActions.UPDATE_NEW_COSTING,
      currentCostingProfile: { CostingType: method },
    });
    switch (method) {
      case "VENDOR":
        console.log("VENDOR");
        setShowCostMethod(false);
        return;
      case "SHEETS":
        console.log("SHEETS");
        if (currentCostingProfile.CostingsSheetId) {
          window.open(
            "https://docs.google.com/spreadsheets/d/" +
              currentCostingProfile.CostingsSheetId
          );
        } else {
          toastr.success("Costing Sheet is being created...");
          axios
            .post("/utils/sheets/" + currentCostingProfile.id + "/costing")
            .then((res) => {
              dispatch(
                currentCostingActions.saveCostingProfile({
                  ...currentCostingProfile,
                  CostingsSheetId: res.data.CostingsSheetId,
                  CostingType: "SHEETS",
                })
              );
              toastr.success(res.data.message);
              // window.open(
              //   "https://docs.google.com/spreadsheets/d/" +
              //   res.data.CostingsSheetId
              // );
            })
            .catch((err) => {
              toastr.error("Additional Sheet creation failed");
            });
        }
        setShowCostMethod(false);
        return;
      case "DEFAULT":
        setShowManualCostEntry(true);
        setShowCostMethod(false);
        return;
    }
  };
  const onWaveNameEdit = () => {
    let currentwavespec = {
      ...currentWaveSpec,
      WaveName: editableWaveName,
    };
    let wavespecs = [...waveSpecs];
    wavespecs = wavespecs.map((ws) => {
      if (ws.id == currentWaveSpec.id) {
        ws = currentwavespec;
      }
      return { ...ws };
    });
    dispatch(waveSpecsActions.setWaveSpecs([...wavespecs]));
    dispatch(updateCurrentWaveSpec({ ...currentwavespec }));

    let editablecostingprofile = { ...currentCostingProfile };
    editablecostingprofile.WaveSpecs = editablecostingprofile.WaveSpecs.map(
      (ws) => {
        if (ws.id == currentwavespec.id) {
          return { ...currentwavespec };
        } else {
          return { ...ws };
        }
      }
    );
    dispatch(
      currentCostingActions.saveCostingProfile(
        { ...editablecostingprofile },
        () => setWaveEditModal(false)
      )
    );
    dispatch(
      updateCostingProfiles(costingProfiles, { ...editablecostingprofile })
    );
  };
  const selectCostInputModal = () => {
    return (
      <Modal
        isOpen={showCostMethod}
        toggle={() => setShowCostMethod(!showCostMethod)}
        centered={true}
        size={"lg"}
        backdrop={"static"}
      >
        <ModalHeader toggle={() => setShowCostMethod(!showCostMethod)}>
          <h4>Select Costing Method</h4>
        </ModalHeader>
        <ModalBody>
          <h5>
            Please Note: You can only select one costing method per profile.
            Some options may not be available depending on your market's default
            settings.
          </h5>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => chooseCostMethod("VENDOR")}>
            Trigger Vendor Bidding
          </Button>{" "}
          <Button onClick={() => chooseCostMethod("SHEETS")}>
            Use Google Sheets
          </Button>{" "}
          <Button onClick={() => chooseCostMethod("DEFAULT")}>
            Input Cost Directly
          </Button>{" "}
        </ModalFooter>
      </Modal>
    );
  };

  return currentCostingProfile.Project ? (
    <Layout
      costMethod={props.currentCostingProfile.CostingType}
      setShowCostMethod={setShowCostMethod}
      showManualCostEntry={showManualCostEntry}
      setShowManualCostEntry={setShowManualCostEntry}
      showSheetsCosts={showSheetsCosts}
      setShowSheetsCosts={setShowSheetsCosts}
      showCart={true}
      profileStatusToDisplay={getLabel(
        "CostingStatusOptions",
        currentCostingProfile.ProfileStatus
      )}
      projectStatusToDisplay={getLabel(
        "ProjectStatusOptions",
        currentCostingProfile.Project?.ProjectStatus
      )}
    >
      {selectCostInputModal()}
      {costingStatus.showSheetsCosts ? (
        <>
          <GlobalCostingSheet setShowSheetsCosts={setShowSheetsCosts} />
        </>
      ) : costingStatus.showManualCostEntry ? (
        <ManualCostEntry setShowManualCostEntry={setShowManualCostEntry} />
      ) : (
        <>
          <Container fluid={props.currentCostingProfile.IsTracker}>
            <Card>
              <CardHeader>
                <Row className="d-flex justify-content-between">
                  <Col xs="9" className="align-self-center">
                    <Row className="d-flex justify-content-start">
                      <Col className="align-self-center">
                        <CardTitle className="text-uppercase mb-0">
                          Costing Profile Details
                        </CardTitle>
                      </Col>
                      {/* <Col className="align-self-center">
                            <Badge title="Costing Profile Status">
                              {getLabel(
                                "CostingStatusOptions",
                                props.currentCostingProfile?.ProfileStatus
                              )}
                            </Badge>
                          </Col> */}
                    </Row>
                  </Col>
                  <Col xs="3" className="align-self-center">
                    <Link
                      className=" p-1 medium float-right mr-2"
                      onClick={(e) =>
                        setToggle({
                          ...toggle,
                          overall: !toggle.overall,
                          projectOverview: !toggle.overall ? true : false,
                          methodology: !toggle.overall ? true : false,
                          opsResources: !toggle.overall ? true : false,
                          commercialHours: !toggle.overall ? true : false,
                        })
                      }
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
              {/* <CardHeader>
                <Row>
                  <Col xs="9">
                    <CardTitle className="text-uppercase">
                      Costing Profile Details
                    </CardTitle>
                  </Col>
                  <Col xs="3"></Col>
                </Row>
              </CardHeader> */}
            </Card>
            <Card className="ml-2 mr-2 mb-2">
              <CardHeader
                onClick={(e) =>
                  setToggle({
                    ...toggle,
                    projectOverview: !toggle.projectOverview,
                  })
                }
              >
                <Row>
                  <Col xs="11">
                    <CardTitle className="mb-0">Project Overview</CardTitle>
                  </Col>
                  <Col xs="1">
                    <FontAwesomeIcon
                      className="align-middle mr-2"
                      icon={
                        !toggle.projectOverview ? faChevronRight : faChevronDown
                      }
                      fixedWidth
                    />
                  </Col>
                </Row>
              </CardHeader>
              <Collapse isOpen={toggle.projectOverview}>
                <Suspense fallback={<RecordsSpinner />}>
                  <CardBody>
                    <ProjectOverview
                      project={props.project}
                      costingSPOCs={props.costingSPOCs}
                      updateProject={props.updateProject}
                    />
                  </CardBody>
                </Suspense>
              </Collapse>
            </Card>
            <Card className="ml-2 mr-2 mb-2">
              <CardHeader
                onClick={(e) =>
                  setToggle({ ...toggle, methodology: !toggle.methodology })
                }
              >
                <Row>
                  <Col xs="11">
                    <CardTitle className="mb-0">Methodology Details</CardTitle>
                    {validationError ? (
                      <CardText className="error">{validationError}</CardText>
                    ) : null}
                  </Col>
                  <Col xs="1">
                    <FontAwesomeIcon
                      className="align-middle mr-2"
                      icon={
                        !toggle.methodology ? faChevronRight : faChevronDown
                      }
                      fixedWidth
                    />
                  </Col>
                </Row>
              </CardHeader>
              <Collapse isOpen={toggle.methodology}>
                <Suspense fallback={<RecordsSpinner />}>
                  <CardBody>
                    <Methodology
                      methodologyToggles={methodologyToggles}
                      setMethodologyToggles={setMethodologyToggles}
                      validationError={validationError}
                    />
                  </CardBody>
                </Suspense>
              </Collapse>
            </Card>
            {currentCostingProfile &&
            currentCostingProfile.WaveSpecs &&
            currentCostingProfile.WaveSpecs.filter(
              (ws) => ws.OpsResourcesSchema
            ).length ? (
              <Card className="ml-2 mr-2 mb-2">
                <CardHeader
                  onClick={(e) =>
                    setToggle({ ...toggle, opsResources: !toggle.opsResources })
                  }
                >
                  <Row>
                    <Col xs="11">
                      <CardTitle className="mb-0">
                        Operations Resources
                      </CardTitle>
                    </Col>
                    <Col xs="1">
                      <FontAwesomeIcon
                        className="align-middle mr-2"
                        icon={
                          !toggle.opsResources ? faChevronRight : faChevronDown
                        }
                        fixedWidth
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <Collapse isOpen={toggle.opsResources}>
                  <Suspense fallback={<RecordsSpinner />}>
                    <CardBody>
                      <OpsResources
                        toggleWaveEditModal={() =>
                          setWaveEditModal(!waveEditModal)
                        }
                      />
                    </CardBody>
                  </Suspense>
                </Collapse>
              </Card>
            ) : null}
            {currentCostingProfile &&
            currentCostingProfile.ProfileSetting &&
            !currentCostingProfile.ProfileSetting.UsesOopOverrideIntCommCost &&
            currentCostingProfile.ProfileSetting.CommercialHoursSchema ? (
              <Card className="ml-2 mr-2">
                <CardHeader
                  onClick={(e) =>
                    setToggle({
                      ...toggle,
                      commercialHours: !toggle.commercialHours,
                    })
                  }
                >
                  <Row>
                    <Col xs="11">
                      <CardTitle className="mb-0">
                        Commercial Time Cost
                      </CardTitle>
                    </Col>
                    <Col xs="1">
                      <FontAwesomeIcon
                        className="align-middle mr-2"
                        icon={
                          !toggle.commercialHours
                            ? faChevronRight
                            : faChevronDown
                        }
                        fixedWidth
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <Collapse isOpen={toggle.commercialHours}>
                  <Suspense fallback={<RecordsSpinner />}>
                    <CardBody>
                      <CommercialHours
                        toggleWaveEditModal={() =>
                          setWaveEditModal(!waveEditModal)
                        }
                      />
                    </CardBody>
                  </Suspense>
                </Collapse>
              </Card>
            ) : null}
          </Container>
          <Container className="d-flex mt-4 mr-2 justify-content-end">
            <Button
              color="primary"
              disabled={
                props.app.recordloading ||
                currentCostingProfile.IsImportedProfile
              }
              onClick={(e) => {
                if (!currentCostingProfile.IsImportedProfile)
                  submitCostingProfile();
                else e.preventDefault();
              }}
            >
              Save
              {props.app.recordloading ? (
                <Spinner size="small" color="#495057" />
              ) : null}
            </Button>
          </Container>
          <Container className="d-flex justify-content-center">
            <Badge href="#" color="secondary">
              Back to top ↑
            </Badge>
          </Container>
        </>
      )}
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
              onWaveNameEdit();
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
  ) : (
    <div></div>
  );
};

const mapStateToProps = (state) => {
  return {
    project: state.currentProject.newProject,
    costingSPOCs: state.currentProject.costingSPOCs,
    currentCostingProfile: state.currentCosting.currentCostingProfile,
    countrySpecs: state.countrySpecs,
    rateCards: state.rateCards,
    app: state.app,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateProject: (newProject) =>
      dispatch({
        type: currentProjectActions.UPDATE_NEW_PROJECT,
        newProject: newProject,
      }),
    saveProject: () => dispatch(currentProjectActions.saveProject()),
    clearCosting: () =>
      dispatch({ type: currentCostingActions.CLEAR_NEW_COSTING }),
    saveCostingProfile: (costingProfile) =>
      dispatch(currentCostingActions.saveCostingProfile(costingProfile)),
    setCountrySpecs: (countrySpecs) =>
      dispatch(countryActions.setCountrySpecs(countrySpecs)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Costing);

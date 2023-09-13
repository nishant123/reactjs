import React, { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "@alexcambose/react-infinite-scroll";
import {
  // Spinner,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faPen,
  faCheck,
  faClipboard,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

import axios from "../../axios-interceptor";
import Navbar from "../../components/NavbarDelivery";
import { getLabel } from "../../utils/codeLabels";
import * as deliveryActions from "../../redux/actions/deliveryActions";
import ExpandableRows from "./ExpandableRows";
import RecordsSpinner from "../../components/RecordsSpinner";
import RecordsBadge from "../../components/RecordsBadge";
import DeliveryDashboardLayout from "../../layouts/DeliveryDashboardLayout";
import { getProject } from "../../redux/actions/currentProjectActions";
import Spinner from "../../components/Spinner";
import SurveyInformation from "./SurveyInformation";

// const RecordsSpinner = lazy(() => import('../../../components/recordsSpinner'));
// const RecordsBadge = lazy(() => import('../../../components/RecordsBadge'));
// const ExpandableRows = lazy(() => import('./ExpandableRows'));

const DeliveryDashboard = () => {
  const [infiniteLoad, setInfiniteLoad] = useState(false);
  const [isModalOpen, setModal] = useState(false);
  const [isProjectCopyAlert, setProjectCopyAlert] = useState(false);
  const [currentDupProject, setCurrentDupProject] = useState({});
  const [currentExistProject, setExistingProject] = useState({});
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const totalItems = useSelector(({ deliveries }) => deliveries.totalItems);
  const hasMore = useSelector(({ deliveries }) => deliveries.hasMore);
  const [isEwnNotesModal, setEwnModal] = useState(false);
  const [currentEwn, setCurrentEwn] = useState(false);
  const [currentEditDel, setCurrentEditDel] = useState({});
  const [isEditModal, setEditModal] = useState(false);
  const app = useSelector(({ app }) => app);
  const deliveries = useSelector(({ deliveries }) => deliveries);
  const deliveriesList = useSelector(({ deliveries }) => deliveries.items);
  const countries =
    useSelector(({ codeLabels }) => codeLabels.CommissioningCountriesOptions) ||
    [];
  const businessUnits =
    useSelector(({ codeLabels }) => codeLabels.BusinessUnitOptions) || [];
  const projectStatus =
    useSelector(({ codeLabels }) => codeLabels.ProjectStatusOptions) || [];
  const searchCharactors =
    useSelector(({ navbar }) => navbar.SearchCharactors) || "";
  const searchBy = useSelector(({ navbar }) => navbar.SearchBy) || "";
  const [clear, isClear] = useState(false);
  const [isOpen, handleOpen] = useState(false);
  const [selectedCountries, setCountries] = useState([]);
  const [selectedBusinessUnits, setBusinessUnits] = useState([]);
  const [selectedStatus, setStatus] = useState([]);

  //edit project
  const currentDelivery = useSelector(
    ({ deliveries }) => deliveries.currentDelivery
  );

  const [editableDelivery, setEditableDelivery] = useState({
    ...currentDelivery,
  });

  const editSurveyForm = (eve, isWaveSpec) => {
    if (isWaveSpec) {
      editableDelivery.WaveSpec[eve.target.id] = eve.target.value;
    } else {
      editableDelivery[eve.target.id] = eve.target.value;
    }
    if (eve.target.id == "ChangesToUniqueQuestionsNA" && eve.target.value) {
      editableDelivery.ChangesToUniqueQuestions = null;
    }
    setEditableDelivery({ ...editableDelivery });
  };

  const decommisionedStatus = _.head(
    codeLabels.DeliveryStatusOptions.filter(
      (ds) => ds.Label === "Decommissioned"
    )
  ) ?.Code;
  deliveriesList ?.map((dl) => {
    let existingDelivery = deliveriesList.filter(
      (d) =>
        d.ProjectDeliveryNumber === dl.ProjectDeliveryNumber &&
        d.DeliveryStatus !== dl.DeliveryStatus
    );
    //dummy code for duplicate check
    if (existingDelivery.length && dl.DeliveryStatus === decommisionedStatus) {
      dl.duplicateExisted = true;
    }
  });
  const submitSurveyInfo = () => {
    // dispatch(saveDelivery(props.editableDelivery, () => history.push('/deliveries')))
    dispatch(
      deliveryActions.saveDelivery(editableDelivery, () => setEditModal(false))
    );
  };
  const isAuthenticated = useSelector(
    ({ user }) =>
      user.authToken !== null &&
      user.authToken !== "undefined" &&
      user.authToken !== ""
  );
  // const searchbar = useSelector(({ navbar }) => navbar.SearchCharactors);
  const searchbarTypes = useSelector(
    ({ codeLabels }) => codeLabels.SearchProjectsBy
  );
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!deliveriesList || deliveriesList.length) {
      dispatch(deliveryActions.setDeliveries({}));
    }
    dispatch({ type: "SET_SEARCHBY", SearchTypes: searchbarTypes });
  }, []);

  useEffect(() => {
    deliveryActions.handleDeliveryProps("hasMore", true);
  }, [deliveriesList]);

  const fetchMoreData = () => {
    setInfiniteLoad(true);
    let jsonBody = getJson();
    if (searchCharactors.length > 2)
      jsonBody = {
        ...jsonBody,
        [getSearchBy()]: searchCharactors,
      };
    if (deliveriesList ?.length >= totalItems) {
      setInfiniteLoad(false);
      deliveryActions.handleDeliveryProps("hasMore", false);
      return;
    }
    axios.post("/deliveries/filter?limit=20&offset=" + deliveriesList.length, jsonBody)
      .then((res) => {
        dispatch(deliveryActions.appendDeliveries(res.data.items, res.data.totalItems));
        setInfiniteLoad(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //This warning below now needs to be tested against exact match for
  //ProjectDeliveryNumber on deliveryspec record (Example AU2012090406W001)
  const openProjectWarning = (project) => {
    setCurrentDupProject(project);
    let existingProj = _.head(
      deliveriesList.filter(
        (dl) =>
          dl.ProjectDeliveryNumber == project.ProjectDeliveryNumber &&
          dl.DeliveryStatus != project.DeliveryStatus
      )
    );
    setExistingProject(existingProj);
    setProjectCopyAlert(true);
  };
  const onSearchBarValueChange = (chr) => {
    dispatch({ type: "SEARCH_CHARACTORS", Charactors: chr });
  };
  const onSearchBarTypeChange = (typ) => {
    dispatch({ type: "SEARCH_TYPE", SearchingType: typ });
    dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
  };
  const onModalChange = () => {
    handleOpen(!isOpen);
  };
  const hanldeCountries = (code) => {
    const arrayList = [...selectedCountries];
    if (!selectedCountries.includes(code)) arrayList.push(code);
    else {
      let i = arrayList.indexOf(code);
      arrayList.splice(i, 1);
    }
    setCountries([...arrayList]);
  };

  const hanldeBusinessUnits = (code) => {
    const arrayList = [...selectedBusinessUnits];
    if (!selectedBusinessUnits.includes(code)) arrayList.push(code);
    else {
      let i = arrayList.indexOf(code);
      arrayList.splice(i, 1);
    }
    setBusinessUnits([...arrayList]);
  };
  const hanldeProjectStatus = (code) => {
    const arrayList = [...selectedStatus];
    if (!selectedStatus.includes(code)) arrayList.push(code);
    else {
      let i = arrayList.indexOf(code);
      arrayList.splice(i, 1);
    }
    setStatus([...arrayList]);
  };
  const getJson = () => {
    return {
      businessUnits:
        selectedBusinessUnits.length > 0 ? selectedBusinessUnits : undefined,
      countries: selectedCountries.length > 0 ? selectedCountries : undefined,
      projectStatus: selectedStatus.length > 0 ? selectedStatus : undefined,
    };
  };
  const handleAdvancedFilter = (e) => {
    handleOpen(false);
    isClear(true);
    dispatch(deliveryActions.setDeliveries(getJson()));
    // dispatch(projectsActions.getProjects(getJson()))
  };
  const getSearchBy = () => {
    let searchType = searchBy;
    switch (searchType) {
      case "projectId":
        searchType = "projectId";
        break;
      case "projectName":
        searchType = "projectName";
        break;
      case "waveName":
        searchType = "waveName";
        break;
      case "programmer":
        searchType = "programmer";
        break;
      case "projectmanager":
        searchType = "projectmanager";
        break;
      case "proposalOwner":
        searchType = "proposalOwner";
        break;
      default:
        searchType = "projectId";
        break;
    }
    return searchType;
  };
  const [timelimit, setTimeLimit] = useState(0);
  const handleSearch = () => {
    if (timelimit) clearTimeout(timelimit);
    if (searchCharactors.length >= 3 || searchCharactors.length === 0) {
      setTimeLimit(
        setTimeout(() => {
          let jsonBody = {
            [getSearchBy()]: searchCharactors,
          };
          dispatch(deliveryActions.setDeliveries(jsonBody));
          isClear(true);
        }, 500)
      );
    }
  };
  const handleClear = () => {
    isClear(false);
    setStatus([]);
    setCountries([]);
    setBusinessUnits([]);
    dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
    dispatch(deliveryActions.setDeliveries({}));
  };

  const copyDataToExisted = () => {
    let currentexistproj = { ...currentExistProject };
    currentexistproj = {
      ...currentexistproj,
      ..._.omit(currentDupProject, [
        "WaveSpec",
        "WaveSpecId",
        "UpdatedBy",
        "createdAt",
        "duplicateExisted",
        "DeliveryStatus",
        "ProjectDeliveryNumber",
        "CreatedBy",
        "updatedAt",
        "id",
        "IsDecommissionedFixed",
      ]),
    };
    currentexistproj.WaveSpec = {
      ...currentexistproj.WaveSpec,
      ..._.omit(currentDupProject.WaveSpec, [
        "updatedAt",
        "UpdatedBy",
        "id",
        "createdAt",
        "CreatedBy",
        "WaveNumber",
        "WaveName",
        "WaveFolderId",
        "TimeTrackerId",
        "ProjectBoxId",
        "OpsResourcesSchema",
        "OpsResourcesData",
        "CostingProfileId",
        "CostingProfile",
      ]),
    };
    // currentExistProject
    dispatch(
      deliveryActions.saveDelivery({
        ...currentDupProject,
        IsDecommissionedFixed: true,
      })
    );
    dispatch(
      deliveryActions.saveDelivery(currentexistproj, () =>
        setProjectCopyAlert(false)
      )
    );
  };
  const saveDeliveryStatus = () => {
    dispatch(
      deliveryActions.saveDelivery(currentEditDel, () => setModal(false))
    );
  };
  // useEffect(() => {
  //   hist.replace("/");
  // }, [isAuthenticated]);

  const data = {
    tableColumns: [
      {
        dataField: "ProjectId",
        text: "PROJECT ID",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "12%" };
        },
        formatter: (cell, row) => <span>{row.ProjectDeliveryNumber}</span>,
      },
      {
        dataField: "ProjectName",
        text: "PROJECT NAME",
        headerStyle: (colum, colIndex) => {
          return { width: "25%" };
        },
        formatter: (cell, row) => {
          let project =
            row.WaveSpec.CostingProfile && row.WaveSpec.CostingProfile.Project;
          return (
            <span>
              {project ? project.ProjectName : ""}{" "}
              {row.duplicateExisted ? (
                <FontAwesomeIcon
                  className={`warning ${!row.IsDecommissionedFixed ? "pointer" : "no-actions"
                    }`}
                  icon={faExclamationTriangle}
                  title={`Found Duplicate Project for - ${row.ProjectDeliveryNumber}.`}
                  onClick={() => openProjectWarning(row)}
                />
              ) : null}
              {row.IsDecommissionedFixed ? (
                <FontAwesomeIcon
                  className="not-allowed"
                  color="green"
                  icon={faCheckCircle}
                  title={`No action required. Duplicate Project for - ${row.ProjectDeliveryNumber} is already fixed. Please use the other project with same ID.`}
                />
              ) : null}
            </span>
          );
        },
        sort: true,
      },
      {
        dataField: "ProjectName",
        text: "WAVE",
        headerStyle: (colum, colIndex) => {
          return { width: "12%" };
        },
        formatter: (cell, row) => {
          return (
            <span>
              {"#"}
              {row.WaveSpec.WaveNumber} {row.WaveSpec.WaveName}
            </span>
          );
        },
        sort: false,
      },
      {
        dataField: "DeliveryStatus",
        text: "STATUS",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "10%" };
        },
        formatter: (cell, row) => {
          let project =
            row.WaveSpec.CostingProfile && row.WaveSpec.CostingProfile.Project;

          const label = getLabel("DeliveryStatusOptions", row.DeliveryStatus);
          // const label = getLabel("ProjectStatusOptions", project.ProjectStatus)
          return (
            <div
              className={`text-center btn p-0 ${row.DeliveryStatus == decommisionedStatus ? "no-actions" : ""
                }`}
            >
              <Badge
                key={row.id}
                color="secondary"
                title={`Change Project Status`}
                onClick={(e) => {
                  e.stopPropagation();
                  setModal(!isModalOpen);
                  // setCurrentProject(row);
                  setCurrentEditDel(row);
                  // dispatch(deliveryActions.setCurrentDelivery(row));
                }}
              >
                {label}
              </Badge>
            </div>
          );
        },
      },
      {
        dataField: "ProposalOwnerEmail",
        text: "PROPOSAL OWNER",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "15%" };
        },
        formatter: (cell, row) => {
          let project =
            row.WaveSpec.CostingProfile && row.WaveSpec.CostingProfile.Project;
          if (project && project.ProposalOwnerEmail ?.value) {
            return project.ProposalOwnerEmail.value
              .toLowerCase()
              .split("@")[0]
              .split(".")
              .map((word) => {
                return word.replace(word[0], word[0].toUpperCase());
              })
              .join(" ");
          } else {
            return "";
          }
        },
      },
      {
        dataField: "CommissioningCountry",
        text: "COUNTRY",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "8%" };
        },
        formatter: (cell, row) => {
          let project =
            row.WaveSpec.CostingProfile && row.WaveSpec.CostingProfile.Project;
          return getLabel(
            "FieldingCountriesOptions",
            project ? project.CommissioningCountry : ""
          );
        },
      },
      {
        dataField: "CommissionDate",
        text: "COMMISIONED DATE",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "10%" };
        },
        formatter: (cell, row) => {
          return row.WaveSpec.DateWaveCommissioned ?.split("T")[0];
        },
      },
      {
        dataField: "",
        text: "ACTIONS",
        sort: false,
        headerStyle: (colum, colIndex) => {
          return { width: "8%" };
        },
        formatter: (cell, row) => {
          let project =
            row.WaveSpec.CostingProfile && row.WaveSpec.CostingProfile.Project;
          return (
            <div className="text-center btn p-0">
              <Row>
                <Col>
                  <FontAwesomeIcon
                    icon={faPen} //change to view icon for decomm
                    title={`Input Delivery Details`}
                    onClick={() => {
                      // dispatch(
                      //   getProject(row.WaveSpec.CostingProfile.Project.ProjectId)
                      // );
                      dispatch(deliveryActions.setCurrentDelivery(row));
                      setEditableDelivery(row);
                      setEditModal(true);
                      // history.push("/survey");
                    }}
                  />
                </Col>
                <Col>
                  <FontAwesomeIcon
                    icon={faClipboard}
                    title={`View EWN Notes`}
                    onClick={() => {
                      setEwnModal(!isEwnNotesModal);
                      setCurrentEwn(row);
                    }}
                  />
                </Col>
              </Row>
            </div>
          );
        },
      },
    ],
    tableData: deliveriesList && deliveriesList.length ? deliveriesList : [],
  };
  let length = Math.max(
    countries.length,
    projectStatus.length,
    businessUnits.length
  );
  return (
    <DeliveryDashboardLayout
      navbar={
        <Navbar
          headerTitle="SETUP AND DELIVERY"
          onSearchBarValueChange={onSearchBarValueChange}
          onSearchBarTypeChange={onSearchBarTypeChange}
          handleOpen={onModalChange}
          handleSearch={handleSearch}
          handleClear={handleClear}
          searchCharactors={searchCharactors}
          clear={clear}
        />
      }
    >
      {deliveriesList ? (
        <>
          <h2>
            Showing {deliveriesList.length} of {totalItems} Waves for all Projects
          </h2>
          <InfiniteScroll
            loadMore={fetchMoreData}
            hasMore={hasMore}
            isLoading={infiniteLoad}
            loading={<RecordsSpinner />}
            noMore={<RecordsBadge recordTypeLabel="deliveries" />}
            initialLoad={false}
          >
            <ExpandableRows {...data}></ExpandableRows>
          </InfiniteScroll>
        </>
      ) : null}
      <Modal isOpen={isModalOpen} className="modal-sm">
        <ModalHeader toggle={() => setModal(!isModalOpen)}>
          <h4>Change Project Status</h4>
        </ModalHeader>
        <ModalBody>
          <strong>
            {currentEditDel ?.WaveSpec ?.CostingProfile ?.Project.ProjectName}
          </strong>
          <p>{currentEditDel ?.ProjectDeliveryNumber}</p>
          <div>
            <p>Change Project Status To:</p>
            <select
              className="form-control"
              id="ProjectStatus"
              defaultValue={currentEditDel ?.DeliveryStatus}
              onChange={(e) =>
                setCurrentEditDel({
                  ...currentEditDel,
                  DeliveryStatus: e.target.value,
                })
              }
            >
              {codeLabels.DeliveryStatusOptions.map((dso) => (
                <option value={dso.Code}>{dso.Label}</option>
              ))}
            </select>
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button
              color="secondary"
              className="mr-2"
              disabled={app.recordloading}
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={app.recordloading}
              onClick={() => saveDeliveryStatus()}
            >
              Update
              {app.recordloading ? (
                <Spinner size="small" color="#000000" />
              ) : null}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isProjectCopyAlert} className="modal-md">
        <ModalHeader toggle={() => setProjectCopyAlert(!isProjectCopyAlert)}>
          <h4>Duplicate Project Record Found!</h4>
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>Please Note:</strong>
            <br />
            This project record is now decommissioned.
            <br />A newer project record was found with the same Project ID (
            <strong>{currentExistProject.ProjectDeliveryNumber}</strong>) and
            status -{" "}
            <strong>
              {getLabel(
                "DeliveryStatusOptions",
                currentExistProject.DeliveryStatus
              )}
            </strong>
          </p>
          <p>
            This is due to changes made in the costing of the project post
            commissioning. This record should no longer be used for any inputs
            or reporting. Please use the newer project for any further updates.
            <br />
            <strong>
              To minimise manual effort, would you like to copy existing data to
              the newer record?
            </strong>
          </p>
          {/* <p>{currentProject.ProjectId}</p> */}
        </ModalBody>
        <ModalFooter>
          <div>
            <Button
              onClick={() => setProjectCopyAlert(false)}
              color="secondary"
              className="mr-2"
              disabled={app.recordloading}
            >
              Cancel
            </Button>
            <Button
              onClick={copyDataToExisted}
              disabled={app.recordloading}
              color="primary"
            >
              Ok
              {app.recordloading ? (
                <Spinner size="small" color="#000000" />
              ) : null}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isEwnNotesModal} className="modal-sm">
        <ModalHeader toggle={() => setEwnModal(!isEwnNotesModal)}>
          <Row>
            <Col>
              <h4>EWN Notes</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5>
                {currentEwn.WaveSpec ?.CostingProfile ?.Project.ProjectName}
              </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <h5> {currentEwn.ProjectDeliveryNumber}</h5>
            </Col>
          </Row>
        </ModalHeader>
        <ModalBody>
          <strong>
            {currentEwn.waveSpec ?.CostingProfile ?.Project.ProjectName}
          </strong>
          <p>{currentEwn.waveSpec ?.CostingProfile ?.Project.ProjectId}</p>
          <div>
            <div>
              <label>Notes for Project Manager</label>
              <br></br>
              <textarea
                className="form-control"
                defaultValue={currentEwn.waveSpec ?.NotesPM}
                disabled="true"
              ></textarea>
            </div>
            <div>
              <label>Notes for Programming</label>
              <br></br>
              <textarea
                className="form-control"
                defaultValue={currentEwn.waveSpec ?.NotesFinalQuestionnaire}
                disabled="true"
              ></textarea>
            </div>
            <div>
              <label>Notes for Translations</label>
              <br></br>
              <textarea
                className="form-control"
                defaultValue={currentEwn.waveSpec ?.NotesTranslations}
                disabled="true"
              ></textarea>
            </div>
            <div>
              <label>Notes for Field work</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFieldwork"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesFieldwork}
              ></textarea>
            </div>
            <div>
              <label>Notes for Verbatim Coding</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFieldwork"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesVerbatimCoding}
              ></textarea>
            </div>
            <div>
              <label>Notes for Data Processing</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFieldwork"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesDataProcessing}
              ></textarea>
            </div>
            <div>
              <label>Notes for Charting</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFieldwork"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesCharts}
              ></textarea>
            </div>
            <div>
              <label>Notes for Dashboarding</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFieldwork"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesDashboards}
              ></textarea>
            </div>
            <div>
              <label>Notes for Final Report</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesFinalReport"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesFinalReport}
              ></textarea>
            </div>
            <div>
              <label>Other notes</label>
              <br></br>
              <textarea
                className="form-control"
                id="NotesOther"
                disabled="true"
                defaultValue={currentEwn.waveSpec ?.NotesOther}
              ></textarea>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={isEditModal} className="modal-lg edit-project-details">
        <ModalHeader toggle={() => setEditModal(!isEditModal)}>
          <h4>
            {editableDelivery.WaveSpec ?.CostingProfile ?.Project.ProjectName}
          </h4>
          <h5> {editableDelivery.ProjectDeliveryNumber}</h5>
        </ModalHeader>
        <ModalBody>
          {editableDelivery && editableDelivery.WaveSpec ? (
            <SurveyInformation
              isNotEditable={
                editableDelivery.DeliveryStatus == decommisionedStatus
              }
              editSurveyForm={editSurveyForm}
              editableDelivery={editableDelivery}
              teamLeads={deliveries.teamLeads}
              programmers={deliveries.programmers}
            />
          ) : null}
        </ModalBody>
        <ModalFooter>
          <div>
            <Button
              className="mr-2"
              color="secondary"
              disabled={app.recordloading}
              onClick={() => setEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={
                app.recordloading ||
                editableDelivery.DeliveryStatus == decommisionedStatus
              }
              onClick={submitSurveyInfo}
            >
              Save
              {app.recordloading ? <Spinner size="small" color="grey" /> : null}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isOpen} toggle={() => handleOpen()} size="lg">
        <ModalHeader toggle={() => handleOpen()}>Refine Search</ModalHeader>
        <ModalBody>
          <Table borderless>
            <thead>
              <tr>
                <th>PROJECT STATUS</th>
                <th>COMMISSIONING COUNTRY</th>
                <th>BUSINESS UNITS</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(length).keys()].map((index) => (
                <tr>
                  {projectStatus.map(
                    (status, key) =>
                      key === index &&
                      projectStatus.length > index && (
                        <td
                          onClick={() => hanldeProjectStatus(status.Code)}
                          className={
                            selectedStatus.includes(status.Code)
                              ? "selected-column"
                              : "table-column"
                          }
                        >
                          {selectedStatus.includes(status.Code) && (
                            <span style={{ marginRight: "5%" }}>
                              {" "}
                              <FontAwesomeIcon icon={faCheck} fixedWidth />
                            </span>
                          )}
                          {status.Label}
                        </td>
                      )
                  )}
                  {index >= projectStatus.length && <td></td>}
                  {countries.map(
                    (country, key) =>
                      key === index &&
                      countries.length > index && (
                        <td
                          onClick={() => hanldeCountries(country.Code)}
                          className={
                            selectedCountries.includes(country.Code)
                              ? "selected-column"
                              : "table-column"
                          }
                        >
                          {selectedCountries.includes(country.Code) && (
                            <span style={{ marginRight: "5%" }}>
                              <FontAwesomeIcon icon={faCheck} fixedWidth />
                            </span>
                          )}
                          {country.Label}
                        </td>
                      )
                  )}
                  {index >= countries.length && <td></td>}
                  {businessUnits.map(
                    (bu, key) =>
                      key === index &&
                      businessUnits.length > index && (
                        <td
                          onClick={() => hanldeBusinessUnits(bu.Code)}
                          className={
                            selectedBusinessUnits.includes(bu.Code)
                              ? "selected-column"
                              : "table-column"
                          }
                        >
                          {selectedBusinessUnits.includes(bu.Code) && (
                            <span style={{ marginRight: "5%" }}>
                              <FontAwesomeIcon icon={faCheck} fixedWidth />
                            </span>
                          )}
                          {bu.Label}
                        </td>
                      )
                  )}
                  {index >= businessUnits.length && <td></td>}
                </tr>
              ))}
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              handleAdvancedFilter(e);
            }}
          >
            Filter
          </Button>{" "}
          <Button color="secondary" onClick={() => handleOpen()}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </DeliveryDashboardLayout>
  );
};

export default DeliveryDashboard;

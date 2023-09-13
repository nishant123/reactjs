import React, { useEffect, useState } from "react";
import { toastr } from "react-redux-toastr";
import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "@alexcambose/react-infinite-scroll";
import axios from "../../../axios-interceptor";
import { Badge } from "reactstrap";
import Navbar from "../../../components/Navbar";
import { useHistory } from "react-router-dom";
import { getLabel } from "../../../utils/codeLabels";
import * as projectsActions from "../../../redux/actions/projectsActions";
import {
  clearCurrentProject,
  saveProject,
} from "../../../redux/actions/currentProjectActions";
import ExpandableRows from "./ExpandableRows";
import DashboardLayout from "../../../layouts/Dashboard";
import RecordsSpinner from "../../../components/RecordsSpinner";
import RecordsBadge from "../../../components/RecordsBadge";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../../components/Spinner";

// const RecordsSpinner = lazy(() => import('../../../components/recordsSpinner'));
// const RecordsBadge = lazy(() => import('../../../components/RecordsBadge'));
// const ExpandableRows = lazy(() => import('./ExpandableRows'));
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Input,
  Label,
  CardTitle,
} from "reactstrap";

const Dashboard = () => {
  const [infiniteLoad, setInfiniteLoad] = useState(false);
  const [isOpen, handleOpen] = useState(false);
  const [selectedCountries, setCountries] = useState([]);
  const [selectedVerticals, setVerticals] = useState([]);
  const [selectedBusinessUnits, setBusinessUnits] = useState([]);
  const [selectedStatus, setStatus] = useState([]);
  const [currentSelectedProject, setCurrentSelectedProject] = useState({});
  const app = useSelector(({ app }) => app);
  const projects = useSelector(({ projects }) => projects.items);
  const totalItems = useSelector(({ projects }) => projects.totalItems);
  const hasMore = useSelector(({ projects }) => projects.hasMore);
  const countries =
    useSelector(({ codeLabels }) => codeLabels.UserScopeOptions) || [];
  const verticals =
    useSelector(({ codeLabels }) => codeLabels.VerticalOptions) || [];
  const businessUnits =
    useSelector(({ codeLabels }) => codeLabels.BusinessUnitOptions) || [];
  const projectStatus =
    useSelector(({ codeLabels }) => codeLabels.ProjectStatusOptions) || [];
  const searchCharactors =
    useSelector(({ navbar }) => navbar.SearchCharactors) || "";
  const searchBy = useSelector(({ navbar }) => navbar.SearchBy) || "";
  const [clear, isClear] = useState(false);
  const [editStatusModal, setEditStatusModal] = useState(false);
  const [projectList, selectProjects] = useState("allProjects");
  const isAuthenticated = useSelector(
    ({ user }) =>
      user.authToken !== null &&
      user.authToken !== "undefined" &&
      user.authToken !== ""
  );
  const searchbarTypes = useSelector(
    ({ codeLabels }) => codeLabels.SearchProjectsBy
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [isWelcome, setWelcome] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("appMsg") &&
      localStorage.getItem("appMsg").value === false
    )
      setWelcome(false);
    else if (
      localStorage.getItem("showModal") !== true &&
      !localStorage.getItem("appMsg")
    ) {
      setWelcome(true);
      localStorage.setItem("showModal", true);
    }
    dispatch({ type: "SEARCH_TYPE", SearchingType: "ID" });
  }, []);

  const handleCookies = () => {
    setCookies();
    setWelcome(false);
  };
  const fetchMoreData = () => {
    let jsonBody = getJson();
    if (searchCharactors.length > 2)
      jsonBody = {
        ...jsonBody,
        [getSearchBy()]: searchCharactors,
      };
    if (projects.length >= totalItems) {
      dispatch(projectsActions.setProjects({ hasMore: false }));
      return;
    }
    setInfiniteLoad(true);
    axios
      .post("/projects/filter?limit=20&offset=" + projects.length, jsonBody)
      .then((res) => {
        dispatch(projectsActions.appendProjects(res.data.items));
        setInfiniteLoad(false);
      })
      .catch((err) => {
        toastr.error("Loading Failed", err.data.message);
        setInfiniteLoad(false);
      });
  };
  const hist = useHistory();

  useEffect(() => {
    dispatch(projectsActions.getProjects());
    dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
  }, []);

  useEffect(() => {
    dispatch(projectsActions.setProjects({ hasMore: true }));
  }, [projects]);

  useEffect(() => {
    hist.replace("/");
  }, [isAuthenticated]);

  const data = {
    tableColumns: [
      {
        dataField: "ProjectId",
        text: "PROJECT ID",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "10%" };
        },
      },
      {
        dataField: "ProjectName",
        text: "PROJECT NAME",
        sort: true,
        formatter: (cell, row) => {
          return (
            <span>
              {cell}{" "}
              {row.IsImportedProject ? (
                <FontAwesomeIcon
                  className="warning pointer"
                  icon={faExclamationTriangle}
                  title="Project Migrated from v1. Some features may not be available."
                />
              ) : null}
            </span>
          );
        },
      },
      {
        dataField: "ProjectStatus",
        text: "STATUS",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "12%" };
        },
        formatter: (cell, row) => {
          const label = getLabel("ProjectStatusOptions", cell);
          return (
            <div>
              <Badge
                color="secondary"
                className="pointer"
                onClick={() => {
                  setCurrentSelectedProject(row);
                  setEditStatusModal(true);
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
          return { width: "20%" };
        },
        formatter: (cell) => {
          if (cell.value) {
            return cell.value
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
          return { width: "15%" };
        },
        formatter: (cell) => {
          return getLabel("FieldingCountriesOptions", cell);
        },
      },
      {
        dataField: "createdAt",
        text: "CREATED DATE",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "10%" };
        },
        formatter: (cell) => {
          return cell.split("T")[0];
        },
      },
    ],
    tableData: projects,
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
  const hanldeVerticals = (code) => {
    const arrayList = [...selectedVerticals];
    if (!selectedVerticals.includes(code)) arrayList.push(code);
    else {
      let i = arrayList.indexOf(code);
      arrayList.splice(i, 1);
    }
    setVerticals([...arrayList]);
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
      verticals: selectedVerticals.length > 0 ? selectedVerticals : undefined,
      businessUnits:
        selectedBusinessUnits.length > 0 ? selectedBusinessUnits : undefined,
      countries: selectedCountries.length > 0 ? selectedCountries : undefined,
      projectStatus: selectedStatus.length > 0 ? selectedStatus : undefined,
      [projectList]: true,
    };
  };
  const handleAdvancedFilter = (e) => {
    handleOpen(false);
    isClear(true);
    dispatch(projectsActions.getProjects(getJson()));
  };
  const getSearchBy = () => {
    let searchType = searchBy;
    switch (searchType) {
      case "ID":
        searchType = "projectId";
        break;
      case "NAME":
        searchType = "projectName";
        break;
      case "OP":
        searchType = "opNumber";
        break;
      case "PO":
        searchType = "proposalOwner";
        break;
      case "AN":
        searchType = "accountName";
        break;
      case "PM":
        searchType = "projectmanager";
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
          dispatch(projectsActions.getProjects(jsonBody));
          isClear(true);
        }, 500)
      );
    }
  };
  const handleClear = () => {
    isClear(false);
    setVerticals([]);
    setStatus([]);
    setCountries([]);
    setBusinessUnits([]);
    dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
    dispatch(projectsActions.getProjects({}));
    selectProjects("allProjects");
  };
  const setCookies = () => {
    var now = new Date();
    now.setTime(now.getTime() + 1 * 3600 * 1000 * 24 * 7);
    let expirationDate = new Date(
      new Date().getTime() + 1 * 3600 * 1000 * 24 * 7
    );
    let newValue = {
      value: false,
      expirationDate: expirationDate.toISOString(),
    };
    localStorage.setItem("appMsg", JSON.stringify(newValue));
  };
  const handleRadio = (value) => {
    selectProjects(value);
  };
  const radioList = [
    { name: "All Projects", id: "allProjects" },
    { name: "My Projects", id: "myProject" },
    { name: "Team Projects", id: "teamProject" },
  ];
  let length = Math.max(
    countries.length,
    verticals.length,
    projectStatus.length,
    businessUnits.length
  );
  return (
    <>
      <DashboardLayout
        navbar={
          <Navbar
            headerTitle="DASHBOARD"
            onSearchBarValueChange={onSearchBarValueChange}
            onSearchBarTypeChange={onSearchBarTypeChange}
            handleOpen={onModalChange}
            handleSearch={handleSearch}
            handleClear={handleClear}
            searchCharactors={searchCharactors}
            clear={clear}
          />
        }

        //button={
        //  <Button
        //    style={{
        //      position: "fixed",
        //      bottom: "1.5em",
        //      right: "1.5em",
        //      borderRadius: "50%",
        //      fontSize: "2em",
        //      width: "2em",
        //      height: "2em",
        //      paddingTop: "0px",
        //    }}
        //    onClick={(e) => {
        //      history.push("/proposal");
        //      dispatch(clearCurrentProject());
        //    }}
        //  >
        //    +
        //  </Button>
        //}

        button={
                  <Button
                      style={{
                          position: "fixed",
                          bottom: "1.5em",
                          right: "1.5em",
                          borderRadius: "50%",
                          fontSize: "2em",
                          width: "2em",
                          height: "2em",
                          paddingTop: "0px",
                      }}
                      onClick={(e) =>
                      {
                          history.push("/proposal-new");
                          dispatch(clearCurrentProject());
                      }}
                  >
                      ++
          </Button>
              }
      >
        <React.Fragment>
          <h2>
            Showing {projects.length} of {totalItems} Projects
          </h2>
          {projects ? (
            <>
              <InfiniteScroll
                loadMore={fetchMoreData}
                hasMore={hasMore}
                isLoading={infiniteLoad}
                loading={<RecordsSpinner />}
                noMore={<RecordsBadge recordTypeLabel="projects" />}
                initialLoad={false}
              >
                <ExpandableRows {...data}></ExpandableRows>
              </InfiniteScroll>
            </>
          ) : null}
        </React.Fragment>
      </DashboardLayout>
      <Modal isOpen={isOpen} toggle={() => handleOpen()} size="lg">
        <ModalHeader toggle={() => handleOpen()}>Refine Search</ModalHeader>
        <ModalBody>
          <Table borderless>
            <thead>
              <tr>
                <th>Projects</th>
                <th>PROJECT STATUS</th>
                <th>COMMISSIONING COUNTRY</th>
                <th>VERTICALS</th>
                <th>BUSINESS UNITS</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(length).keys()].map((index) => (
                <tr>
                  {radioList.map(
                    (value, key) =>
                      key === index &&
                      index < radioList.length && (
                        <td>
                          <Label check>
                            <Input
                              type="radio"
                              checked={projectList === value.id}
                              onChange={() => {
                                handleRadio(value.id);
                              }}
                            />
                            {value.name}
                          </Label>
                        </td>
                      )
                  )}
                  {index >= radioList.length && <td></td>}
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
                  {verticals.map(
                    (vertical, key) =>
                      key === index &&
                      verticals.length > index && (
                        <td
                          onClick={() => hanldeVerticals(vertical.Code)}
                          className={
                            selectedVerticals.includes(vertical.Code)
                              ? "selected-column"
                              : "table-column"
                          }
                        >
                          {selectedVerticals.includes(vertical.Code) && (
                            <span style={{ marginRight: "5%" }}>
                              <FontAwesomeIcon icon={faCheck} fixedWidth />
                            </span>
                          )}
                          {vertical.Label}
                        </td>
                      )
                  )}
                  {index >= verticals.length && <td></td>}
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
      <Modal isOpen={isWelcome} toggle={() => setWelcome(!isWelcome)} size="lg">
        <ModalHeader toggle={() => setWelcome(!isWelcome)}>
          <CardTitle>Welcome to CI Central v2.0</CardTitle>
        </ModalHeader>
        <ModalBody>
          <p>
            <strong className="text-uppercase">
              Important note for our users
            </strong>
          </p>
          <p>
            After last few months of tireless development efforts, we are
            excited to finally launch the next-generation CI workflow platfrom
            to our global CI markets.
          </p>
          <p>
            CI Central v1 was built with a collabrative effort from a very small
            team of internal developers by leveraging Appmaker - Google Gsuite's
            low-code appplication development environment for building custom
            business apps.
          </p>
          <p>
            Last year, when the pandemic had just started to disrupt the global
            order, we were met with another setback of our own. Google announced
            the Appmaker shut down within just over 3 years since it's launch on
            19 January, 2021.
          </p>
          <p>
            Having to migrate CI Central meant that everthing in v2 had to be
            built from the very ground up. Although this provided us an
            excellent opportunity to address the v1 limitations, it also meant
            having to work within a very tight, hard deadline.
          </p>
          <p>
            Ideally, we would have liked to involve users from all markets in
            extensive training sessions and UAT pre-launch. Unfortunately, to
            prevent any disruptions across our 40+ CI markets already on the
            platform we had no option but to launch v2.0 before 19 Jan, 2021.
          </p>
          <p>
            In the coming weeks, your local market administrators and the global
            team will be reaching out to understand the customizations required
            for your markets. For various countries who have not yet recieved
            the training, you can expect these sessions to be scheduled in next
            few days.
          </p>
          <p>
            Along with some performance optimizations, we also aim to roll out
            various suggested feature improvements in weekly minor releases.
            Meanwhile, if you encounter any issues or bugs, please reach out to
            your local contact or the global team.
          </p>
          <p>
            <strong>
              <em>
                For existing projects migrated from v1, please remember to first
                select the project's Business Unit and Industry Vertical and
                saving before creating new costing profiles.
              </em>
            </strong>
          </p>
          <p>
            <strong>We thank you for your support!</strong>
          </p>
          <p>
            <strong>Team CI Central</strong>
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              handleCookies();
            }}
          >
            Do not show this message again
          </Button>{" "}
          {/* <Button color="secondary" onClick={() => setWelcome(false)}>
						No
					</Button> */}
        </ModalFooter>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={editStatusModal}
        toggle={() => setEditStatusModal(!editStatusModal)}
        size="sm"
      >
        <ModalHeader toggle={() => setEditStatusModal(!editStatusModal)}>
          <h4>Change Project Status</h4>
        </ModalHeader>
        <ModalBody>
          <p>
            <strong>{currentSelectedProject.ProjectName}</strong>
            <br />
            <strong>{currentSelectedProject.ProjectId}</strong>
          </p>
          <p>
            <em>Project status change guidelines here.</em>
          </p>
          <p>Change Project Status To:</p>
          <select
            className="form-control"
            onChange={(e) =>
              setCurrentSelectedProject({
                ...currentSelectedProject,
                ProjectStatus: e.target.value,
              })
            }
            defaultValue={currentSelectedProject.ProjectStatus}
          >
            {projectStatus
              .filter((ps) => ["4", "5", "98"].indexOf(ps.Code) !== -1)
              .map((ps) => (
                <option value={ps.Code}>{ps.Label}</option>
              ))}
          </select>
          <Label className="mb-2 mt-2">Project Status Notes:</Label>
          <Input
            type="textarea"
            id="NotesFinance"
            //className="form-control"
            onChange={(e) =>
              setCurrentSelectedProject({
                ...currentSelectedProject,
                NotesProjectStatus: e.target.value,
              })
            }
            value={
              currentSelectedProject.NotesProjectStatus
                ? currentSelectedProject.NotesProjectStatus
                : ""
            }
            rows="3"
            placeholder="Please provide any relevant notes any project status related notes here..."
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            disabled={app.recordLoading}
            onClick={() => setEditStatusModal(!editStatusModal)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={app.recordLoading}
            onClick={() => {
              dispatch(
                saveProject(
                  currentSelectedProject,
                  () => setEditStatusModal(!editStatusModal),
                  true
                )
              );
            }}
          >
            Update
            {app.recordloading ? (
              <Spinner size="small" color="#495057" />
            ) : null}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Dashboard;

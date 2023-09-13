import React, { useEffect, useState } from "react";
// import { Form } from 'react-bootstrap';
import InfiniteScroll from "@alexcambose/react-infinite-scroll";
import Switch from "react-bootstrap/esm/Switch";
import { Col, Row, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import _ from "lodash";
import ExpandableRows from "./ExpandableRows";
import Navbar from "../../components/RequestsNavbar";
import RecordsSpinner from "../../components/RecordsSpinner";
import RecordsBadge from "../../components/RecordsBadge";
import DashboardLayout from "../../layouts/RequestsBoardLayout";
import Spinner from "../../components/Spinner";

import {
  handleRequestProps,
  appendRequests,
  setRequests,
  setIndividualRequest,
  getRequestTypes,
  setRequestTypes
} from "../../redux/actions/requestsActions";
import Select from "react-select";

const RequestsBoard = () => {
  let { requestId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [infiniteLoad, setInfiniteLoad] = useState(false);
  const [calledRequests, setCalledRequests] = useState(false);
  const hasMore = useSelector(({ requests }) => requests.hasMore);
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const totalItems = useSelector(({ requests }) => requests.totalItems);
  const requestsList = useSelector(({ requests }) => requests.items);
  const requestTypesList = useSelector(({ requests }) => requests.requestTypes) || [];
  const [searchList, setSearchList] = useState({});
  const userEmail = useSelector(({ user }) => user.userRecord.Email);
  const pageloaded = useSelector(({ app }) => app.pageloaded);
  const [objectData, setObjectJson] = useState({});
  const userCountries = useSelector(({ codeLabels }) => codeLabels.UserScopeOptions) || [];
  useEffect(() => {
    if (requestId && (!requestsList || !requestsList.length) && !calledRequests) {
      dispatch(setIndividualRequest(requestId));
    }
  })
  //TODO: Load from codelabels "RequestFilterOptions" once ready.
  const requestOwnerFilter = [
    { id: "allRequests", value: "All Requests " },
    { id: "createdBy", value: "All Requests I Created" },
    { id: "assignedTo", value: "All Requests I Am Assigned To" },
    { id: "unassignedTo", value: "All Unassigned Requests" },
    { id: "inProgress", value: "All Work-in-Progress Requests" },
    { id: "closed", value: "Closed Requests" },
  ];
  //TODO: load from Request Type later. dynamic based on request country >> Business Unit
  const requestTypeFilter = requestTypesList.map((data) => {
    return {
      id: data.RequestTypeName,
      value: data.RequestTypeName
    }
  })
  //TODO: load from user access countries and then get labels
  const requestCountriesFilter = userCountries.map((country) => {
    return {
      id: country.id,
      value: country.Label,
      code: country.Code
    }
  })
  const addSearchCountry = async (value, key) => {
    let searchlist = { ...searchList };
    let objectJson = { ...objectData }
    searchlist[key] = value;
    setSearchList({ ...searchlist });
    if (value && value.length > 0) {
      dispatch(getRequestTypes({ countryCode: value ? value.map(data => data.value) : [] }));
      objectJson = {
        ...objectJson,
        countryCode: value.map(data => data.code)
      }
    }
    else {
      dispatch(setRequestTypes());
      delete objectJson.countryCode
    }
    delete objectJson.requestType
    setObjectJson(objectJson)
    addSearchRequestType([], "requestType", true)
    dispatch(setRequests(objectJson));
  }
  const addSearchQuery = (value, key) => {
    if (key === "clear") {
      setSearchList({});
      setObjectJson({})
      dispatch(setRequestTypes());
      return;
    }
    let searchlist = { ...searchList };
    let objectJson = { ...objectData }
    searchlist[key] = value;
    setSearchList({ ...searchlist });

    if (key === "requestOwner") {
      if (value.value === "createdBy") {
        objectJson = {
          "RequestorEmail": userEmail
        }
      }
      else if (value.value === "assignedTo") {
        objectJson = {
          "agentEmail": userEmail
        }
      }
      else if (value.value === "unassignedTo") {
        objectJson = {
          "agentEmail": null
        }
      }
      else if (value.value === "inProgress") {
        objectJson = {
          "agentEmail": null,
          isClosed: false
        }
      }
      else if (value.value === "closed") {
        objectJson = {
          isClosed: true
        }
      }
      else if (value.value === "allRequests") {
        objectJson = {
        }
      }
    }
    setObjectJson(objectJson)
    dispatch(setRequests(objectJson));
  };
  const addSearchRequestType = (value, key, flag = false) => {
    if (key === "clear") {
      setSearchList({});
      setObjectJson({})
      return;
    }
    let searchlist = { ...searchList };
    let objectJson = { ...objectData }
    searchlist[key] = value;
    if(!flag)
    setSearchList({ ...searchlist });
    if (value && value.length > 0)
      objectJson = {
        ...objectJson,
        "requestType": value.map(data => data.value)
      }
    else
      delete objectJson.requestType
    setObjectJson(objectJson)
    if (!flag)
      dispatch(setRequests(objectJson));
  }
  const fetchMoreData = () => {
    setInfiniteLoad(true);
    if (requestsList ?.length >= totalItems) {
      setInfiniteLoad(false);
      dispatch(handleRequestProps("hasMore", false));
      return;
    }
    //todo: api call
    // axios
    //     .get("/requests?limit=20&offset=" + requestsList.length)
    //     .then((res) => {
    //         console.log("new records here");
    //         console.log(res);
    //         dispatch(appendRequests(res.data.items, res.data.totalItems));
    //         setInfiniteLoad(false);
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
  };
  useEffect(() => {
    if ((!requestsList || !requestsList.length) && !requestId) {
      dispatch(setRequests());
    }
    dispatch(handleRequestProps("hasMore", false));
  }, []);
  const getNameFromMail = (mail) => {
    let allMails = mail ?.split(",")
    if (allMails)
      return allMails.map(mail => {
        return _.head(mail.toLowerCase().split("@")).replaceAll(".", " ");
      }).join(", ")
    else
      return ""
  };
  const data = {
    tableColumns: [
      {
        dataField: "id",
        text: "ID",
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: "5%" };
        },
      },
      {
        dataField: "ProjectId",
        text: "PROJECT ID",
        sort: true,
        // headerStyle: (colum, colIndex) => {
        //     return { width: "12%" };
        // },
        formatter: (cell, row) => (
          <span>{row.CostingProfile ?.Project.ProjectId}</span>
        ),
      },
      {
        dataField: "ProjectName",
        text: "PROJECT NAME",
        sort: true,
        formatter: (cell, row) => (
          <span>{row.CostingProfile ?.Project.ProjectName}</span>
        ),
      },
      {
        dataField: "RequestType",
        text: "REQUEST TYPE",
        sort: true,
        formatter: (cell, row) => <span>{row.RequestType}</span>,
      },
      {
        dataField: "ProfileName",
        text: "COSTING PROFILE",
        sort: true,
        formatter: (cell, row) => (
          <span>
            {"#"}
            {row.CostingProfile ?.ProfileNumber} {row.CostingProfile ?.ProfileName}
          </span>
        ),
      },
      {
        dataField: "RequestedBy",
        text: "REQUEST BY",
        sort: true,
        // formatter: (cell, row) => <span>{row.RequestorEmail}</span>,
        formatter: (cell, row) => {
          return row.RequestorEmail ? (
            <span className="capitalize">
              {getNameFromMail(row.RequestorEmail)}
            </span>
          ) : (
              ""
            );
        },
      },
      {
        dataField: "AssignedTo",
        text: "ASSIGNED TO",
        sort: true,
        formatter: (cell, row) => {
          return row.AgentEmail ? (
            <span className="capitalize">
              {getNameFromMail(row.AgentEmail)}
            </span>
          ) : (
              ""
            );
          // if (row.AgentEmail) {
          //     return row.AgentEmail.toLowerCase()
          //         .split("@")[0]
          //         .split(".")

          //         .join(" ");
          // } else {
          //     return "";
          // }
        },
      },
      {
        dataField: "createdAt",
        text: "CREATED DATE",
        sort: true,
        formatter: (cell, row) => (
          <span>{cell ? _.head(cell.split("T")) : ""}</span>
        ),
      },
    ],
    tableData: requestsList && requestsList.length ? requestsList : [],
  };
  return (
    <DashboardLayout navbar={<Navbar headerTitle="REQUESTS BOARD" />}>
      <>
        {requestsList ? (
          <>
            <Row className="align-items-start mb-3">
              <Col>
                <h2>
                  Showing {requestsList.length} of {totalItems} requests
                </h2>
              </Col>
            </Row>
            <Row className="justify-content-between">
              <Col lg="3" md="3" sm="12" xs="12" className="mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Filter by</span>
                  </div>
                  <Select
                    className="custom-select-box"
                    placeholder="All Requests"
                    options={requestOwnerFilter.map((c) => {
                      return {
                        value: c.id,
                        label: c.value,
                      };
                    })}
                    onChange={(select) => {
                      addSearchQuery(select, "requestOwner")
                    }
                    }
                    value={searchList && searchList.requestOwner ? searchList.requestOwner : null}
                  />
                </div>
              </Col>
              <Col lg="3" md="3" sm="12" xs="12" className="mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Country</span>
                  </div>
                  <Select
                    isMulti
                    className="custom-select-box"
                    placeholder="All Countries I Have Access To"
                    options={requestCountriesFilter.map((c) => {
                      return {
                        value: c.id,
                        label: c.value,
                        code: c.code
                      };
                    })}
                    onChange={(select) =>
                      addSearchCountry(select, "requestCountry")
                    }
                    value={searchList && searchList.requestCountry ? searchList.requestCountry : null}
                  />
                </div>
              </Col>
              <Col lg="3" md="3" sm="12" xs="12" className="mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Type</span>
                  </div>
                  <Select
                    isMulti
                    className="custom-select-box"
                    placeholder="All Request Types"
                    options={requestTypeFilter.map((c) => {
                      return {
                        value: c.id,
                        label: c.value,
                      };
                    })}
                    onChange={(select) =>
                      addSearchRequestType(select, "requestType")
                    }
                    value={searchList && searchList.requestType ? searchList.requestType : null}
                  />
                </div>
              </Col>
              <Col lg="2" md="2" sm="12" xs="12" className="mb-3">
                <Button color="secondary"
                  onClick={() => {
                    dispatch(setRequests());
                    addSearchQuery({}, "clear")
                    // addSearchCountry([], "clear")
                    // addSearchRequestType([], "clear")
                    // ; history.replace("/requests")
                  }}
                >Clear Filters</Button>
              </Col>
            </Row>
            {pageloaded ? <InfiniteScroll
              loadMore={fetchMoreData}
              hasMore={hasMore}
              isLoading={infiniteLoad}
              loading={<RecordsSpinner />}
              noMore={<RecordsBadge recordTypeLabel="requests" />}
              initialLoad={false}
            >
              <ExpandableRows {...data}></ExpandableRows>
            </InfiniteScroll>
              : (
                <Spinner />
              )}
          </>
        ) : null}
      </>
    </DashboardLayout>
  );
};

export default RequestsBoard;

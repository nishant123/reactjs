import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import * as currentProjectActions from "../../../redux/actions/currentProjectActions";

import { getLabel } from "../../utils/codeLabels";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { MinusCircle, PlusCircle } from "react-feather";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faSave,
  faBell,
  faCheck,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import _ from "lodash";
import * as deliveryActions from "../../redux/actions/deliveryActions";
import { getProject } from "../../redux/actions/currentProjectActions";
import { setCurrentWaveSpec } from "../../redux/actions/waveSpecsActions";
import {
  mailRequest,
  postComment,
  updateRequest,
} from "../../redux/actions/requestsActions";
import { getCosting } from "../../redux/actions/currentCostingActions";
import Select from "react-select";

const getNameFromMail = (mail) => {
  return _.head(mail.toLowerCase().split("@")).replaceAll(".", " ");
};

const ExpandableRowsTable = ({ tableData, tableColumns }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const app = useSelector(({ app }) => app);
  const allusers = useSelector(({ requests }) => requests.allusers);
  const [currentComment, updateComment] = useState("");
  const [isCloseRequestModal, setRequestClosingModal] = useState(false);
  const [isOpenRequestModal, setRequestOpeningModal] = useState(false);
  const [isAssignUserModal, setAssignUserModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState();

  let comment = React.createRef();

  const userRecord = JSON.parse(localStorage.getItem("userRecord"));
  const getNameFromMailOptions = (mail) => {
    return <span className="text-capitalize">{_.head(mail.toLowerCase().split("@")).replaceAll(".", " ")}</span>
  };
  const postSelfComment = (reqId) => {
    if (currentComment)
      dispatch(
        postComment(
          {
            Comment: currentComment?.trim(),
            CommentOwnerEmail: userRecord.Email,
            RequestId: reqId,
          },
          () => updateComment("")
        )
      );
  };

  const initiateAssignUser = (req) => {
    setCurrentRequest(req);
    setAssignUserModal(true);
  };
  const getDefaultValue = (AgentEmail) => {
    if (AgentEmail) {
      let reqVal = (allusers.filter((au) => _.includes(AgentEmail.split(","), au.Email)));
      if (reqVal)
        return reqVal.map(rv => {
          return {
            value: rv.Email,
            label: `${rv.FirstName} ${rv.LastName}`,
          }
        })
    }
    else
      return ""
  };

  const projectDetails = (row) => {
    return (
      <Col
        lg="8"
        md="8"
        sm="12"
        xs="12"
        style={{ borderRight: "1px solid #cccccc" }}
      >
        <Row className="req-left-section">
          <Col>
            <Row className="mt-2 mb-2">
              <Col>
                <h5>Request Details</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">
                    Commissioning Country
                  </label>
                  <span className="ml-3">
                    {getLabel(
                      "FieldingCountriesOptions",
                      row.CostingProfile.Project?.CommissioningCountry
                    )}
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">
                    Commissioning Office
                  </label>
                  <span className="ml-3">
                    {getLabel(
                      "OfficeOptions",
                      row.CostingProfile.Project?.CommissioningOffice
                    )}
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">Business Unit</label>
                  <span className="ml-3">
                    {getLabel(
                      "BusinessUnitOptions",
                      row.CostingProfile.Project?.BusinessUnit
                    )}
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">Industry Vertical</label>
                  <span className="ml-3">
                    {getLabel(
                      "VerticalOptions",
                      row.CostingProfile.Project?.IndustryVertical
                    )}
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">
                    Associated Methodology
                  </label>
                  <span className="ml-3">
                    <ul style={{ paddingInlineStart: "0" }}>
                      {row.Methodology
                        ? row.Methodology.split(",").map((method, index) => {
                          return (
                            <li key={index} style={{ listStyle: "none" }}>
                              {getLabel("MethodologyOptions", method)}
                            </li>
                          );
                        })
                        : null}
                    </ul>
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold">
                    Response Requested By
                  </label>
                  <span className="ml-3">
                    {row.DateDue
                      ? _.head(row.DateDue.split("T"))
                      : "Not Provided"}
                  </span>
                </span>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="proj-detail">
                  <label className="font-weight-bold mr-3">Primary CS Contact</label>
                  <span className="capitalize">
                    {getNameFromMail(
                      row.CostingProfile.Project?.ProposalOwnerEmail.value
                    )}
                  </span>
                </span>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row className="mt-2 mb-2">
              <Col>
                <h5>Inital Request Notes</h5>
              </Col>
            </Row>
            <Row>
              <Col>
                <textarea
                  rows="9"
                  className="form-control"
                  disabled
                  value={row.InitialNotes}
                ></textarea>
              </Col>
            </Row>
          </Col>
        </Row>
        <hr
          className="mb-4 mt-0"
          style={{
            borderTop: "1px solid #cccccc",
          }}
        />
        <Row>
          <Col>
            <div className="d-flex justify-content-center">
              <Button
                className="btn-secondary mr-2"
                disabled={app.recordloading}
                onClick={() => {
                  dispatch(getProject(row.CostingProfile.Project?.ProjectId));
                  dispatch(
                    getCosting(row.CostingProfile.id, () =>
                      history.push(`/summary/${row.CostingProfile.id}`)
                    )
                  );
                }}
              >
                View Costing Profile Summary
              </Button>
              <Button
                className="btn-secondary mr-2"
                disabled={app.recordloading}
                onClick={() => {
                  window.open(
                    "https://drive.google.com/drive/folders/" +
                    row.CostingProfile.Project.CostingsFolderId
                  );
                }}
              >
                Open Costing Folder
              </Button>
              <Button
                className="btn-secondary mr-2"
                onClick={() => initiateAssignUser(row)}
                disabled={app.recordloading || row.IsClosed}
              >
                Assign To User
              </Button>
              {!row.IsClosed ? (
                <Button
                  className="btn-secondary mr-2"
                  disabled={app.recordloading}
                  onClick={() => {
                    setCurrentRequest(row);
                    setRequestClosingModal(true);
                  }}
                >
                  Close Request
                </Button>
              ) : null}
              {row.IsClosed ? (
                <Button
                  className="btn-secondary mr-2"
                  onClick={() => {
                    setCurrentRequest(row);
                    setRequestOpeningModal(true);
                  }}
                  disabled={app.recordloading}
                >
                  Re-Open Request
                </Button>
              ) : null}
              <Button
                className="btn-secondary"
                onClick={() => {
                  dispatch(mailRequest(currentRequest.id, "update"));
                }}
                disabled={!row.AgentEmail || row.IsClosed || app.recordloading}
              >
                Send Email Notification
              </Button>
            </div>
          </Col>
        </Row>
      </Col>
    );
  };
  const chatBox = (row) => {
    return (
      <Col lg="4" md="4" sm="12" xs="12" className="d-flex flex-column pl-0">
        <div
          className="p-2 chat-messages"
          style={{
            overflowY: "auto",
            borderRight: "1px solid #cccccc",
          }}
        >
          {row.RequestLogs?.length ? (
            row.RequestLogs?.map((chat) => {
              return (
                <>
                  <div
                    className={`pb-4 ${chat.CommentOwnerEmail == userRecord.Email
                      ? "chat-message-right"
                      : "chat-message-left"
                      } `}
                  >
                    <div
                      className={`flex-shrink-1 rounded py-2 px-3 mr-3 ${chat.IsNotification ? "bg-light" : "bg-warning"
                        } `}
                    >
                      {!chat.IsNotification ? (
                        <div
                          className={`font-weight-bold mb-1 ${chat.CommentOwnerEmail == userRecord.Email
                            ? "text-right"
                            : "text-left"
                            } `}
                        >
                          {chat.CommentOwnerEmail.toLowerCase()
                            .split("@")[0]
                            .split(".")
                            .map((word) => {
                              return word.replace(
                                word[0],
                                word[0].toUpperCase()
                              );
                            })
                            .join(" ")}
                        </div>
                      ) : (
                          <div
                            className={`font-weight-bold mb-1 ${chat.CommentOwnerEmail == userRecord.Email
                              ? "text-right"
                              : "text-left"
                              } `}
                          >
                            <FontAwesomeIcon
                              className="not-allowed"
                              icon={faBell}
                            />
                            <FontAwesomeIcon
                              className="not-allowed"
                              icon={faCheck}
                            />
                          </div>
                        )}
                      <div>{chat.Comment}</div>
                      <div
                        className={`small text-nowrap mt-2 ${chat.CommentOwnerEmail == userRecord.Email
                          ? "text-right"
                          : "text-left"
                          } `}
                      >
                        {chat.createdAt
                          ? moment(chat.createdAt).format("llll")
                          : "Just now"}
                      </div>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
              <div className="text-center my-auto">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-muted mb-1"
                  size="lg"
                />
                <h5 className="text-muted">No Additional Notes Available</h5>
              </div>
            )}
        </div>
        <div
          className="new-chat d-flex"
          style={{
            overflowY: "auto",
            borderTop: "1px solid #cccccc",
          }}
        >
          <textarea
            className="border-0"
            disabled={row.IsClosed}
            placeholder={
              row.IsClosed
                ? "Adding new notes to closed requests is not permitted..."
                : "Enter any new request related notes here..."
            }
            onChange={(e) => updateComment(e.target.value)}
            ref={(ref) => (comment = ref)}
          ></textarea>
          <div className="send-btn-container">
            <Button
              disabled={row.IsClosed}
              onClick={() => {
                //todo: optimize
                postSelfComment(row.id);
                comment.value = "";
                setTimeout(() => {
                  updateComment("");
                });
              }}
              className={
                app.recordloading || !currentComment ? "no-actions" : "pointer"
              }
            >
              <FontAwesomeIcon className="pointer" icon={faSave} />
            </Button>
          </div>
        </div>
      </Col>
    );
  };

  const expandRow = {
    renderer: (row) => (
      <div className="mb-0">
        <Row>
          {projectDetails(row)}
          {chatBox(row)}
        </Row>
      </div>
    ),
    showExpandColumn: true,
    expandHeaderColumnRenderer: ({ isAnyExpands }) =>
      isAnyExpands ? (
        <MinusCircle width={16} height={16} />
      ) : (
          <PlusCircle width={16} height={16} />
        ),
    expandColumnRenderer: ({ expanded }) =>
      expanded ? (
        <MinusCircle width={16} height={16} />
      ) : (
          <PlusCircle width={16} height={16} />
        ),
  };

  return (
    <Card>
      <CardBody className="p-4">
        <BootstrapTable
          defaultSorted={[{ dataField: "createdAt", order: "desc" }]}
          bootstrap4
          hover
          striped
          bordered={false}
          keyField="id"
          data={tableData}
          columns={tableColumns}
          expandRow={expandRow}
        />
      </CardBody>
      <Modal
        isOpen={isCloseRequestModal}
        toggle={() => setRequestClosingModal(false)}
        size="sm"
      >
        <ModalHeader toggle={() => setRequestClosingModal(false)}>
          <h4>{currentRequest?.CostingProfile.Project?.ProjectName}</h4>
          <h5>
            {"#"}
            {currentRequest?.CostingProfile?.ProfileNumber}{" "}
            {currentRequest?.CostingProfile?.ProfileName}
          </h5>
        </ModalHeader>
        <ModalBody>
          <p>
            This will send will notify the Request Creator that the request has
            been closed.
            <br />
            You will have to re-open this request to make any further changes.
          </p>
          <p>
            <h5>
              Are you sure you want to close Request #{currentRequest?.id}?
            </h5>
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-between">
            <Button
              className="form-control"
              color="secondary"
              disabled={app.recordloading}
              onClick={() => setRequestClosingModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="form-control ml-2"
              color="primary"
              disabled={app.recordloading}
              onClick={() =>
                dispatch(
                  updateRequest(
                    {
                      ...currentRequest,
                      IsClosed: true,
                      DateClosed: new Date(),
                    },
                    () => {
                      dispatch(mailRequest(currentRequest.id, "close"));
                      setRequestClosingModal(false);
                    }
                  )
                )
              }
            >
              Confirm
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isOpenRequestModal}
        toggle={() => setRequestOpeningModal(false)}
        size="sm"
      >
        <ModalHeader toggle={() => setRequestOpeningModal(false)}>
          <h4>{currentRequest?.CostingProfile.Project?.ProjectName}</h4>
          <h5>
            {"#"}
            {currentRequest?.CostingProfile?.ProfileNumber}{" "}
            {currentRequest?.CostingProfile?.ProfileName}
          </h5>
        </ModalHeader>
        <ModalBody>
          <p>
            This action <strong>will not</strong> automatically notify the
            Request Assignee that the request has been re-opened.
          </p>
          <p>
            Once the request is re-opened, you can add new notes/comments and
            then use "Send Email Notification" button to notify the Request
            Assignee.
          </p>
          <p>
            <h5>
              Are you sure you want to re-open the Request #{currentRequest?.id}
              ?
            </h5>
          </p>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-between">
            <Button
              className="form-control"
              color="secondary"
              disabled={app.recordloading}
              onClick={() => setRequestOpeningModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="form-control ml-2"
              color="primary"
              disabled={app.recordloading}
              onClick={() =>
                dispatch(
                  updateRequest(
                    {
                      ...currentRequest,
                      IsClosed: false,
                      DateClosed: new Date(),
                    },
                    () => {
                      dispatch(mailRequest(currentRequest.id, "reopen"));
                      setRequestOpeningModal(false);
                    }
                  )
                )
              }
            >
              Confirm
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={isAssignUserModal}
        toggle={() => setAssignUserModal(false)}
        size="sm"
      >
        <ModalHeader toggle={() => setAssignUserModal(false)}>
          <h4>{currentRequest?.CostingProfile.Project?.ProjectName}</h4>
          <h5>
            {"#"}
            {currentRequest?.CostingProfile?.ProfileNumber}{" "}
            {currentRequest?.CostingProfile?.ProfileName}
          </h5>
        </ModalHeader>
        <ModalBody>
          <p>Please select a user to assign this Request to:</p>
          <Select
            className="custom-select-box"
            isMulti
            options={
              allusers
                ? allusers.map((c) => {
                  return {
                    value: c.Email,
                    label: getNameFromMailOptions(c.Email),
                  };
                })
                : []
            }
            defaultValue={
              allusers && currentRequest?.AgentEmail
                ? getDefaultValue(currentRequest.AgentEmail)
                : ""
            }
            onChange={(select) =>
              setCurrentRequest({ ...currentRequest, AgentEmail: select ? select.map(s => s.value).join() : "" })
            }
          />
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-between">
            <Button
              className="form-control"
              color="secondary"
              disabled={app.recordloading}
              onClick={() => setAssignUserModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="form-control ml-2"
              color="primary"
              disabled={app.recordloading}
              onClick={() =>
                dispatch(
                  updateRequest(currentRequest, () => setAssignUserModal(false))
                )
              }
            >
              Confirm
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

const Tables = (props) => {
  return (
    <Container fluid className="p-0 requests-board-table">
      <ExpandableRowsTable {...props} />
    </Container>
  );
};

export default Tables;

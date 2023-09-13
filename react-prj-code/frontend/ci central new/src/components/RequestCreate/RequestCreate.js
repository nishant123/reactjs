import React, { useState, useEffect } from "react";
import { toastr } from "react-redux-toastr";
import { useSelector, useDispatch } from "react-redux";
import * as appActions from "../../redux/actions/appActions";
import { mailRequest } from "../../redux/actions/requestsActions";
import Spinner from "../../components/Spinner";
import axios from "../../axios-interceptor";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  Row,
  Col,
  FormFeedback,
  FormGroup,
} from "reactstrap";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

import { getLabel, stringToMulti } from "../../utils/codeLabels";

let requestTypeOptions = [
  {
    Code: "1",
    Label: "Online (Feasibility Check)",
    DefaultRecipients: "aashish.negi@nielsen.com,dominic.yang@nielsen.com",
  },
  {
    Code: "2",
    Label: "Online (Booster Sample)",
    DefaultRecipients: "aashish.negi@nielsen.com,dominic.yang@nielsen.com",
  },
  {
    Code: "3",
    Label: "Offline (Qualitative)",
    DefaultRecipients: "dominic.yang@nielsen.com",
  },
  {
    Code: "4",
    Label: "Offline (CATI)",
    DefaultRecipients: "aashish.negi@nielsen.com",
  },
  {
    Code: "5",
    Label: "Offline (Other)",
    DefaultRecipients: "aashish.negi@nielsen.com,dominic.yang@nielsen.com",
  },
  {
    Code: "6",
    Label: "Project Management",
    DefaultRecipients: "aashish.negi@nielsen.com,dominic.yang@nielsen.com",
  },
];

const RequestCreate = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const [request, setRequest] = useState({});
  const [validation, setValidation] = useState({});
  const profile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const user = useSelector(({ user }) => user.userRecord);
  const loading = useSelector(({ app }) => app.recordloading);

  useEffect(() => {
    dispatch(appActions.recordLoadStart());
    if (profile.Project && profile.Project.CommissioningCountry) {
      axios
        .get(
          "/marketsettings/" +
            profile.Project.CommissioningCountry +
            "/requesttypes/all"
        )
        .then((res) => {
          console.log(res);
          requestTypeOptions = res.data.RequestTypes[0].RequestTypes.map(
            (type) => {
              return {
                ...type,
                value: type.RequestTypeName,
                label: type.RequestTypeName,
              };
            }
          );
          console.log(requestTypeOptions);
          dispatch(appActions.recordLoadEnd());
        })
        .catch((err) => {
          dispatch(appActions.recordLoadEnd());
          console.log(err);
          toastr.error("Error loading request types");
        });
    }
  }, []);
  const resetForm = () => {
    setRequest({});
    setValidation({});
  };
  useEffect(() => {
    console.log("request change", request);
  }, [request]);
  const onChangeHandler = (field, value) => {
    console.log("request", request);
    console.log(field, value);
    setRequest({ ...request, [field]: value });
  };

  const invalidate = () => {
    let invalid = false;
    let newObj = {};
    if (!request.RequestType || request.RequestType === "") {
      newObj.RequestType = true;
      invalid = true;
    }
    if (!request.Methodology || request.Methodology === "") {
      newObj.Methodology = true;
      invalid = true;
    }
    if (!request.DateDue || request.DateDue === "") {
      invalid = true;
      newObj.DateDue = true;
    }
    if (!request.InitialNotes || request.InitialNotes === "") {
      invalid = true;
      newObj.InitialNotes = true;
    }
    setValidation(newObj);
    return invalid;
  };
  const createRequest = () => {
    let data = {
      ...request,
      RequestorEmail: user.Email,
      CostingProfileId: profile.id,
    };
    if (!invalidate()) {
      console.log(data);
      dispatch(appActions.recordLoadStart());
      axios
        .post("/requests", data)
        .then((res) => {
          console.log(res.data);
          dispatch(mailRequest(res.data.Request.id, "new"));
          dispatch(appActions.recordLoadEnd());
          toastr.success("Request Sent", res.data.message);
          resetForm();
        })
        .catch((err) => {
          console.log(err);
          dispatch(appActions.recordLoadEnd());
          toastr.error("Send failed", err.data.message);
        });
    } else {
      console.log("validations failed", validation);
      console.log(data);
    }
  };

  const requestTypeHandler = (e) => {
    console.log("in request type handler");
    console.log(e);
    setRequest({
      ...request,
      RequestType: e.value,
      AgentEmail: e.PrimaryContactEmails,
      CcAgentEmails: e.OtherContactEmails,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      fade={true}
      unmountOnClose={true}
      className="modal-lg"
    >
      <ModalHeader toggle={toggle}>
        <h4>Create New Request</h4>
      </ModalHeader>
      <ModalBody>
        <Row className="mb-1">
          <Col>Project Name</Col>
          <Col>{profile?.Project?.ProjectName}</Col>
        </Row>
        <Row className="mb-1">
          <Col>Costing Profile</Col>
          <Col>
            {"#"}
            {profile?.ProfileNumber} {profile?.ProfileName}
          </Col>
        </Row>
        <Row className="mb-1">
          <Col>Request Type</Col>
          <Col>
            <FormGroup>
              <Select
                options={requestTypeOptions}
                value={
                  request.RequestType
                    ? { value: request.RequestType, label: request.RequestType }
                    : ""
                }
                onChange={(e) => {
                  requestTypeHandler(e);
                }}
                className={
                  validation.RequestType
                    ? "react-select-container is-invalid"
                    : "react-select-container"
                }
              />
              <FormFeedback>Please select a request type</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col>Default Recipient(s)</Col>
          <Col>{request.AgentEmail ?? "Select a request type"}</Col>
        </Row>
        <Row className="mb-1">
          <Col>Associated Methodology</Col>
          <Col>
            <FormGroup>
              <Select
                options={stringToMulti(
                  "MethodologyOptions",
                  profile.Methodology
                )}
                isMulti
                defaultValue
                value={request.Methodology ?? null}
                onChange={(e) => onChangeHandler("Methodology", e)}
                // onChange={(e) => methodologyHandler(e)}
                className={
                  validation.Methodology
                    ? "react-select-container is-invalid"
                    : "react-select-container"
                }
              />

              <FormFeedback>Please select a methodology</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col>Response Needed By</Col>
          <Col>
            <FormGroup>
              <Input
                type="date"
                invalid={validation.DateDue ?? false}
                value={request.DateDue ?? ""}
                onChange={(e) => onChangeHandler("DateDue", e.target.value)}
              />
              <FormFeedback>Please select a date</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-1">
          <Col>Request Notes /Instructions</Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Input
                type="textarea"
                invalid={validation.InitialNotes}
                placeholder="Please provide all the request specific details here..."
                value={request.InitialNotes ?? ""}
                onChange={(e) =>
                  onChangeHandler("InitialNotes", e.target.value)
                }
              />
              <FormFeedback>Please provide request details</FormFeedback>
            </FormGroup>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className="d-flex justify-content-end">
          <Button
            className="mr-2"
            color="secondary"
            //   onClick={() => toggle()}
          >
            <FontAwesomeIcon
              title="Upload Files to Costings Folder"
              icon={faPaperclip}
              fixedWidth
              onClick={() => {
                window.open(
                  "https://drive.google.com/drive/folders/" +
                    profile.Project.CostingsFolderId
                );
              }}
            />
          </Button>
          <Button
            className="mr-2"
            color="secondary"
            onClick={() => {
              resetForm();
              toggle();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => createRequest()}
            disabled={loading}
          >
            Send {loading ? <Spinner size="small" /> : null}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default RequestCreate;

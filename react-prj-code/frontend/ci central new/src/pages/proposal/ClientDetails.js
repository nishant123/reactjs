import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { getSingleOptions } from "../../utils/codeLabels";
import * as projectActions from "../../redux/actions/currentProjectActions";

import { Button, Input, Row, Col } from "reactstrap";

const ClientDetails = ({
  newContractNumber,
  addOpp,
  setSF,
  syndicated,
  fieldInvalidation,
}) => {
  const dispatch = useDispatch();
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const project = useSelector(
    ({ currentProject }) => currentProject.newProject
  );
  const [client, setClient] = useState({ clientName: "", industryGroup: "" });
  const [invalid, setInvalid] = useState({});
  const addOpportunity = () => {
    let contractDetails = {
      successMessage: null,
      StartofDelivery: null,
      Stage: null,
      SalesOrgName: null,
      SalesOrgcode: null,
      Probability: null,
      OwnerRole: null,
      OpportunityRecordType: null,
      OpportunityOwnerName: null,
      OpportunityOwnerEmail: null,
      OpportunityNumber: null,
      OpportunityName: null,
      opportunityLineItemDetails: null,
      opportunityContactTeamDetails: null,
      opportunityTeamMemberDetails: null,
      OpportunityID: null,
      LastModifiedDate: null,
      isDev: null,
      errorMessage: null,
      EndofDelivery: null,
      CreatedDate: null,
      ContractType: null,
      CloseDate: null,
      AmountCurrency: null,
      Amount: 0,
      AmountUSD: 0,
      Industry: client.industryGroup,
      AccountName: client.clientName,
      isSF: false,
      id: null,
      contractNumber: newContractNumber,
    };
    addOpp(contractDetails);
    setClient({ clientName: "", industryGroup: "" });
    console.log(client);
  };
  // SOS Sai
  // refer to line 141
  // let vert = [];
  // vert = codeLabels.UserScopeOptions.filter((obj) => {
  //   if (obj.Code === project.CommissioningCountry) {
  //     return obj;
  //   }
  // })[0]
  //   .BusinessUnits.filter((obj) => {
  //     if (obj.Code === project.BusinessUnit) {
  //       return obj;
  //     }
  //   })[0]
  //   .Verticals.filter((obj) => {
  //     return obj.Code === project.IndustryVertical;
  //   });

  const currentSFOPStatus = () => {
    let currentCC = _.head(
      codeLabels.UserScopeOptions.filter(
        (uso) => uso.Code === project.CommissioningCountry
      )
    );
    let currentBU = _.head(
      currentCC.BusinessUnits.filter((bu) => bu.Code === project.BusinessUnit)
    );
    let currentVertical = _.head(
      currentBU.Verticals.filter((ver) => ver.Code == project.IndustryVertical)
    );
    return currentVertical;
  };
  const validate = () => {
    let valid = true;
    let validObj = {};

    if (!client.clientName || client.clientName.trim().length < 1) {
      valid = false;
      validObj.clientName = true;
    } else {
      validObj.clientName = false;
    }
    if (!client.industryGroup || client.industryGroup.length < 1) {
      valid = false;
      validObj.industryGroup = true;
    } else {
      validObj.industryGroup = false;
    }
    setInvalid(validObj);
    return valid;
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <h5>Project Name</h5>
          <Input
            placeholder="Enter Project Name..."
            value={project.ProjectName}
            onChange={(e) =>
              dispatch({
                type: projectActions.UPDATE_NEW_PROJECT,
                newProject: { ProjectName: e.target.value },
              })
            }
          />
          {fieldInvalidation.ProjectName ? (
            <span style={{ color: "red" }}>Please enter a project name</span>
          ) : null}
        </Col>
        {!syndicated ? (
          <>
            <Col>
              <h5>Client/Account Name</h5>
              <Input
                placeholder="Enter Client Name..."
                value={client.clientName}
                onChange={(e) =>
                  setClient({ ...client, clientName: e.target.value })
                }
              />
              {invalid.clientName ? (
                <span style={{ color: "red" }}>Please enter a client name</span>
              ) : null}
            </Col>
            <Col>
              <h5>Client Industry Group</h5>
              <Input
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                value={client.industryGroup}
                onChange={(e) =>
                  setClient({ ...client, industryGroup: e.target.value })
                }
              >
                <option value="">Please select an option</option>
                {getSingleOptions(codeLabels.IndustryGroupOptions)}
              </Input>
              {invalid.industryGroup ? (
                <span style={{ color: "red" }}>Please select an option</span>
              ) : null}
            </Col>
          </>
        ) : null}
      </Row>
      {/* {!syndicated || vert[0]?.NeedsSFOpportunityNumber ? ( )} */}
      {!syndicated || currentSFOPStatus()?.NeedsSFOpportunityNumber ? (
        <>
          <Button
            color="link"
            style={{ paddingLeft: "0px" }}
            onClick={(e) => {
              setSF(true);
            }}
          >
            Input using Opportunity Number
          </Button>
          {!syndicated ? (
            <div style={{ display: "flex" }}>
              <Button
                style={{ marginLeft: "auto" }}
                onClick={(e) => {
                  if (validate()) {
                    addOpportunity();
                  }
                }}
              >
                Add Client
              </Button>
            </div>
          ) : null}
        </>
      ) : null}
      <hr />
    </React.Fragment>
  );
};

export default ClientDetails;

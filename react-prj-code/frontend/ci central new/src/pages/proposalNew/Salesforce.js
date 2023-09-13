import React, { useState, useEffect } from "react";

import SalesforceInput from "./SalesforceInput";
import ClientDetails from "./ClientDetails";
import ClientListTable from "./ClientListTable";
import _ from "lodash";
import {
  CustomInput,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  CardTitle
} from "reactstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "../../axios-interceptor";
import { toastr } from "react-redux-toastr";
import {
  pageLoadEnd,
  pageLoadStart,
} from "../../redux/actions/appActions";


const Salesforce = ({ fieldInvalidation, updateProject, user, project }) => {
  const [isOpen, setOpen] = useState(false);
  const [currentDelete, setCurrentDelete] = useState({});
  // SOS Sai
  // refer to client details line 54
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const dispatch = useDispatch();
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
  const [isSF, setSF] = useState(currentSFOPStatus() ?.NeedsSFOpportunityNumber);
  // const [isSF, setSF] = useState(true);

  // const [isSF, setSF] = useState(
  //   _.head(project.VerticalObj)?.NeedsSFOpportunityNumber
  // );
  useEffect(() => {
    console.log(isSF);
  }, [isSF]);
  useEffect(() => {
    // If opportunities state changes, update project name with opportunity as default
    if (
      project.ProjectName === "New Project..." &&
      project.ContractDetails.length > 0
    ) {
      updateProject({
        ProjectName: project.ContractDetails[0].OpportunityName,
      });
    }
  }, [project.ContractDetails]);

  useEffect(() => {
    console.log("CONTACT UPDATE IS HAPPENING");
    // populating project record with salesforce contracts
    let primaryCS = "";

    // project status setting
    project.ContractDetails.forEach((obj) => {
      if (obj.Probability >= 90 && project.ProjectStatus === "1") {
        updateProject({ ProjectStatus: "6" });
      }
    });

    // contact emails setting
    if (!project.ProposalOwnerEmail.value) {
      primaryCS = user.Email;
    } else {
      primaryCS = project.ProposalOwnerEmail.value;
    }
    if (!project.IsSFContactSyncPaused) {
      let opTeamMemberDetails = [];
      project.ContractDetails.forEach((obj) => {
        if (obj.isSF) {
          opTeamMemberDetails = opTeamMemberDetails.concat(
            obj.opportunityTeamMemberDetails
          );
        }
      });
      opTeamMemberDetails = opTeamMemberDetails.map((obj) => {
        return obj.EmailAddresses;
      });
      opTeamMemberDetails = opTeamMemberDetails.filter((email, index) => {
        return opTeamMemberDetails.indexOf(email) === index;
      });
      if (opTeamMemberDetails.indexOf(primaryCS) !== -1) {
        opTeamMemberDetails.splice(opTeamMemberDetails.indexOf(primaryCS), 1);
      }
      opTeamMemberDetails = opTeamMemberDetails.map((email) => {
        return { value: email, label: email };
      });
      if (!project.id && (!project.OtherProjectTeamContacts
        || (project.OtherProjectTeamContacts
          && !project.OtherProjectTeamContacts.length))) {
        updateProject({
          OtherProjectTeamContacts: opTeamMemberDetails,
        });
      }
    }
  }, [project.ContractDetails]);

  const data = {
    tableColumns: [
      {
        dataField: "OpportunityNumber",
        text: "Opportunity #",
        formatter: (cell) => {
          if (cell) {
            return cell;
          } else {
            return "-";
          }
        },
      },
      {
        dataField: "OpportunityName",
        text: "Opportunity Name",
        formatter: (cell) => {
          if (cell) {
            return cell;
          } else {
            return "-";
          }
        },
      },
      { dataField: "AccountName", text: "Client Name" },
      {
        dataField: "Stage",
        text: "Stage",
        formatter: (cell) => {
          if (cell) {
            return cell;
          } else {
            return "-";
          }
        },
      },
      {
        dataField: "AmountUSD",
        text: "Amount",
        formatter: (cell) => {
          if (cell === 0 || cell == null) {
            return "-";
          } else {
            return cell + " USD";
          }
        },
      },
    ],
    tableData: project.ContractDetails,
  };

  const addOpp = (newOpp) => {
    updateProject({
      ContractDetails: [...project.ContractDetails, newOpp],
    });
  };

  const handleDelete = () => {
    if(!currentDelete.id)
    {
      setOpen(false)
    updateProject({
      ContractDetails:  [
        ...project.ContractDetails.filter((obj) => {
          return obj.OpportunityNumber !== currentDelete.OpportunityNumber;
        }),
      ] 
    })
  }
    else
    {
    dispatch(pageLoadStart())
    axios
      .delete(`projects/contractdetails/${currentDelete.id}`).then((res) => {
        dispatch(pageLoadEnd())
        setOpen(false)
        setCurrentDelete({})
        toastr.success(res.data.message);
        updateProject({
          ContractDetails:  [
              ...project.ContractDetails.filter((obj) => {
                return obj.id !== currentDelete.id;
              }),
            ],
        })
      }
      ).catch((e) => {
        setOpen(false)
        setCurrentDelete({})
        dispatch(pageLoadEnd())
        toastr.error("Opportunity Delete Failed", e.data.message);
        console.log(e.toString())
      })
    }
  }
  const delOpp = (OpportunityNumber, id) => {
    if (project.ContractDetails.length > 1) {
      setOpen(true)
      setCurrentDelete({ OpportunityNumber: OpportunityNumber, id: id })
    }
    else {
      toastr.error("There should be atleast one opportunity number.");
    }
  };

  let contractNum = 0;
  project.ContractDetails.forEach((obj) => {
    if (obj.ContractNumber > contractNum) {
      contractNum = obj.ContractNumber;
    }
  });

  return (
    <React.Fragment>
      <Modal isOpen={isOpen} toggle={() => {
        setCurrentDelete({})
        setOpen(!isOpen)
      }} >
        <ModalHeader toggle={() => setOpen(!isOpen)}>
          <CardTitle>Are you sure you want to delete the opportunity number?</CardTitle>
        </ModalHeader>
        <ModalFooter>
          <Button
            color="primary"
            onClick={(e) => {
              handleDelete()
            }}
          >
            Yes
					</Button>{" "}
          <Button color="secondary" onClick={() => {
            setCurrentDelete({})
            setOpen(!isOpen)
          }}>
            Cancel
					</Button>
        </ModalFooter>
      </Modal>
      <CustomInput
        type="switch"
        id="syndicated"
        name="syndicated"
        className="h5 mb-3"
        label="This is a Syndicated Project"
        checked={project.IsSyndicated}
        onChange={(e) => {
          if (!project.IsSyndicated) {
            updateProject({
              IsSyndicated: !project.IsSyndicated,
              ContractDetails: [],
            });
          } else {
            updateProject({ IsSyndicated: !project.IsSyndicated });
          }
          setSF(false);
        }}
      />
      {isSF ? (
        <SalesforceInput
          newContractNumber={(contractNum += 1)}
          setSF={setSF}
          addOpp={addOpp}
          delOpp={delOpp}
        />
      ) : (
          <ClientDetails
            newContractNumber={(contractNum += 1)}
            setSF={setSF}
            addOpp={addOpp}
            delOpp={delOpp}
            syndicated={project.IsSyndicated}
            fieldInvalidation={fieldInvalidation}
          />
        )}
      {fieldInvalidation.Contracts ? (
        <h5 style={{ color: "red" }}>please add a client</h5>
      ) : null}
      {project.ContractDetails.length !== 0 && !project.IsSyndicated ? (
        <ClientListTable {...data} delOpp={delOpp} />
      ) : null}
    </React.Fragment>
  );
};

export default Salesforce;

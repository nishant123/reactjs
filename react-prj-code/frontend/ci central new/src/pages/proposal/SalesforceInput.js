import React, { useState, useEffect } from "react";
import axios from "../../axios-interceptor";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import Spinner from "../../components/Spinner";
import { useSelector } from "react-redux";
import { toastr } from "react-redux-toastr";

const SalesforceInput = ({ newContractNumber, setSF, addOpp, delOpp }) => {
  const [opNum, setOpNum] = useState("");
  const [loadingOpp, setLoadingOpp] = useState(false);
  const [valid, setValid] = useState(false);
  const userRecord = useSelector(({ user }) => user.userRecord);

  useEffect(() => {
    validate();
  }, [opNum]);

  const handleChange = (e) => {
    setOpNum(e.target.value.trim());
  };

  const validate = () => {
    if (opNum.substring(0, 2) === "OP" && opNum.length === 12) {
      setValid(true);
    } else {
      setValid(false);
    }
    return valid;
  };

  const sfCall = (opportunityNumber) => {
    setLoadingOpp(true);
    // const opportunityNumber = "OP0000576681";
    const URL = "/salesforce/" + opportunityNumber;

    const config = {
      headers: { "auth-token": localStorage.getItem("auth-token") },
    };

    axios
      .get(URL, config)
      .then((response) => {
        console.log(response.data);
        setOpNum("");
        let contractDetails = {
          ...response.data.opportunity,
          AccountName: response.data.opportunity.accountDetails.AccountName,
          Industry: response.data.opportunity.accountDetails.Industry,
          isSF: true,
          ContractNumber: newContractNumber,
        };
        console.log(contractDetails);
        addOpp(contractDetails);
        setLoadingOpp(false);
        return response.status;
      })
      .catch((err) => {
        console.log(err);
        toastr.error("Getting opportunity from Salesforce failed");
        setLoadingOpp(false);
      });
  };

  return (
    <React.Fragment>
      <h5 className="mb-3">Add Salesforce Opportunity</h5>
      <InputGroup className="mb-3">
        <Input
          placeholder="Please enter an Opportunity Number (eg. OP000000001)"
          value={opNum}
          onChange={(e) => handleChange(e)}
        />
        <InputGroupAddon addonType="append" color="primary">
          {/* {loadingOpp ? (
            <Button disabled={loadingOpp}>
              <Spinner size="small" />
            </Button>
          ) : ( */}
          <Button
            disabled={!valid || loadingOpp}
            onClick={(e) => sfCall(opNum)}
          >
            {loadingOpp ? <Spinner size="small" /> : "Search"}
          </Button>
          {/* )} */}
        </InputGroupAddon>
      </InputGroup>
      {userRecord.CanBypassSalesForce ? (
        <Button
          color="link"
          className="mb-3 pl-0"
          onClick={(e) => {
            setSF(false);
          }}
        >
          Continue without Opportunity Number
        </Button>
      ) : null}
    </React.Fragment>
  );
};

export default SalesforceInput;

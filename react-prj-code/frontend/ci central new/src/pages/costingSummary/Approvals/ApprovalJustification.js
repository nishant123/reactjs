import React from "react";
import { Row, Col, Input, Button } from "reactstrap";

const ApprovalJustification = () => {
  return (
    <React.Fragment>
      <div>
        <h2>Approval Justification</h2>

        <Input type="textarea"></Input>

        <div>
          <Button className="float-right">SEND FOR APPROVAL</Button>
        </div>
      </div>

      <div>
        <h2>Approver Comments</h2>
        <Input type="textarea"></Input>
        <div>
          <Button className="float-right">APPROVE</Button>
          <Button className="float-right">DENY</Button>
          <Button className="float-right">SEND FOR APPROVAL</Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(ApprovalJustification);

import React from "react";
import InputMask from "react-input-mask";
//import CurrencyFormat from 'react-currency-format';
// react-currency-format will be better for our purpose
import { Card, CardBody, Row, Col, Input } from "reactstrap";
import ApprovalMatrix from "./Approvals/ApprovalMatrix";
import ApprovalJustification from "./Approvals/ApprovalJustification.js";

const PriceToClientApproval = () => {
  const currency = "NZD";
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>Actual Price To Client</Col>
          <Col xs="3">
            <Row>
              <Col>
                <InputMask mask="9,999.99">
                  {(inputProps) => <Input {...inputProps} type="text" />}
                </InputMask>
              </Col>
              <Col xs="4">{currency}</Col>
            </Row>
          </Col>
        </Row>
        <ApprovalMatrix></ApprovalMatrix>
        <ApprovalJustification></ApprovalJustification>
      </CardBody>
    </Card>
  );
};

export default React.memo(PriceToClientApproval);

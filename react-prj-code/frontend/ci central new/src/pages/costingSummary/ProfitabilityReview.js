import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

const ProfitabilityReview = () => {
  const currency = "NZD";
  return (
    <Card>
      <CardBody>
        <h1>Profitability Review</h1>
        <Row>
          <Col>Internal Operations</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>External Operations / OOP / Third party cost</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Internal Commercial</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>External Commercial</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>TOTAL OF COSTS ABOVE EXCLUDING OVERHEADS, MARGINS, TAXES</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>MARKUP TO GET TO 25% CONTRIBUTION MARGIN</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <hr />
        <Row>
          <Col>MINIMUM RECOMMENDED PRICE TO CLIENT</Col>
          <Col xs="1">0.00 {currency}</Col>
        </Row>
        <hr />
        <Row>
          <Col>Operations Out of Pocket %</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Contribution Margin %</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Net Revenue %</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Commercial Cost %</Col>
          <Col xs="1">0.00</Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default React.memo(ProfitabilityReview);

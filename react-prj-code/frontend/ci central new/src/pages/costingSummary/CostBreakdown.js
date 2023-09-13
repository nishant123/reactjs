import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

const CostBreakdown = () => {
  const currency = "NZD";
  return (
    <Card>
      <CardBody>
        <Row>
          <Col>
            <h1>COST BREAKDOWN</h1>
          </Col>
          <Col xs="2">
            <a href="#">View Costing Notes</a>
          </Col>
          <Col xs="2">
            <a href="#">View Cost Breakdown</a>
          </Col>
        </Row>
        <h1>Internal Commercial Costs</h1>
        <Row>
          <Col>Executive Director</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Director</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Associate Director</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Senior Manager</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Manager</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Senior Executive</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Executive</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Data Science</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <hr />
        <Row>
          <Col>TOTAL INTERNAL COMMERCIAL COSTS</Col>
          <Col xs="1">0.00 {currency}</Col>
        </Row>
        <br></br>

        <h1>External Commercial Costs</h1>
        <Row>
          <Col>External consultant/report writing</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Travel, Lodging and Entertainment</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>CS Other Expenses</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <hr></hr>
        <Row>
          <Col>TOTAL EXTERNAL COMMERCIAL COSTS</Col>
          <Col xs="1">0.00 {currency}</Col>
        </Row>
        <br></br>

        <h1>Internal Operations Costs</h1>
        <Row>
          <Col>Internal Time Programming</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Internal Time Field, Project Management & QC</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Internal Time Data Processing/Coding/Analysis</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Internal Other Ops</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <hr />
        <Row>
          <Col>TOTAL INTERNAL OPERATIONS COST</Col>
          <Col xs="1">0.00 {currency}</Col>
        </Row>
        <br></br>

        <h1>External Operations Costs (OOP)</h1>
        <Row>
          <Col>Interviewers - Temporaries & Subcontractors</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Travel, Lodging and Entertainment</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>External DC/Coding/QC/DP/Programming/Scripting</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Incentives/Respondent Fees</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>External Consultant/Vendor</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Venue/Hire/Recruitment and Other Misc. Externals</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Printing/Stationery</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>Freight/Shipping</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>External Others</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <Row>
          <Col>MCP/Group Company Sub-Contracting</Col>
          <Col xs="1">0.00</Col>
        </Row>
        <hr />
        <Row>
          <Col>TOTAL EXTERNAL OPERATIONS COST</Col>
          <Col xs="1">0.00 {currency}</Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default React.memo(CostBreakdown);

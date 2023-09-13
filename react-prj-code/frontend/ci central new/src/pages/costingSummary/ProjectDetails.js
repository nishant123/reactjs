import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";

const ProjectDetails = () => {
  return (
    <Card>
      <CardBody>
        <h1>Project Details</h1>
        <Row>
          <Col>Project Name</Col>
          <Col>CI_SNZ_Active Main Survey Jan-Jun 2020: Price Adjustment</Col>
        </Row>
        <Row>
          <Col>Project Number</Col>
          <Col>AU2007161600</Col>
        </Row>
        <Row>
          <Col>Primary Nielsen Contact Email</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Other Project Team Contacts</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Client Details</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Current Status</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Commissioning Office</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Business Unit</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>All Fielding Countries</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Methodology</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Tracker</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Tracking Frequency</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Number of Waves</Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>Syndicated Project</Col>
          <Col></Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default React.memo(ProjectDetails);

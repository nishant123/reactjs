import React from "react";
import {
  Card,
  Table,
  UncontrolledCollapse,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
} from "reactstrap";

const OperationResources = () => {
  const rows = [1, 2, 3];
  return (
    <React.Fragment>
      <Card>
        <h1>Operations Resources</h1>

        <Row>
          <Col xs="11">
            <h2>Specifications</h2>
          </Col>
          <Col xs="1">
            <a id="specifications" href="#specifications">
              open
            </a>
          </Col>
        </Row>

        <UncontrolledCollapse toggler="#specifications">
          <CardBody>
            <Row>
              <Col>Quesionnaire Complexity</Col>
              <Col>Average</Col>
            </Row>
            <Table responsive hover>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Wave Name</th>
                  <th scope="col">Data Processing Complexity</th>
                  <th scope="col">Data Processing Resource</th>
                  <th scope="col">Charting Complexity</th>
                  <th scope="col">Charting</th>
                  <th scope="col">Charting Resource</th>
                  <th scope="col">Data Science</th>
                  <th scope="col">Data Science Hours</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((val, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{val}</th>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </UncontrolledCollapse>
        <hr />
        <Row>
          <Col xs="11">
            <h2>Verbatim Coding Requirements</h2>
          </Col>
          <Col xs="1">
            <a id="verbatim" href="#verbatim">
              open
            </a>
          </Col>
        </Row>
        <UncontrolledCollapse toggler="#verbatim">
          <CardBody>
            <Table responsive hover>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Wave Name</th>
                  <th scope="col">Coding Required</th>
                  <th scope="col">Coding Resource</th>
                  <th scope="col">Coding Full OE</th>
                  <th scope="col">Coding Other Specify(s)</th>
                  <th scope="col">Text Analytics Required</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((val, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{val}</th>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </UncontrolledCollapse>
        <hr />
        <Row>
          <Col xs="11">
            <h2>Other Requirements</h2>
          </Col>
          <Col xs="1">
            <a id="other" href="#other">
              open
            </a>
          </Col>
        </Row>
        <UncontrolledCollapse toggler="#other">
          <CardBody>
            <Table responsive hover>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Data Prep Assistance Required</th>
                  <th scope="col">Data Prep Hours</th>
                  <th scope="col">Additional Operations Support Required</th>
                  <th scope="col">Additional Operations Support Hours</th>
                  <th scope="col">Translations Required</th>
                  <th scope="col">Translation Languages</th>
                  <th scope="col">Translation Hours</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((val, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{val}</th>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </UncontrolledCollapse>
        <hr />
      </Card>
    </React.Fragment>
  );
};

export default React.memo(OperationResources);

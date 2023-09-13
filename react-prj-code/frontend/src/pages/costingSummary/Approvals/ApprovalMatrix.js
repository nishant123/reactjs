import React from "react";
import { Row, Col, CustomInput, Container } from "reactstrap";

const ApprovalMatrix = () => {
  return (
    <React.Fragment>
      <h3>Approval Needed:</h3>
      <Container>
        <Row>
          <Col>
            <Row>Level 0</Row>
            <Row>
              Commercial
              <CustomInput
                type="checkbox"
                id="L0Commercial"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Operations
              <CustomInput
                type="checkbox"
                id="L0Operations"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Finance
              <CustomInput
                type="checkbox"
                id="L0Finance"
                checked
                disabled
                className="mb-2"
              />
            </Row>
          </Col>
          <Col>
            <Row>Level 1</Row>
            <Row>
              Commercial
              <CustomInput
                type="checkbox"
                id="L1Commercial"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Operations
              <CustomInput
                type="checkbox"
                id="L1Operations"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Finance
              <CustomInput
                type="checkbox"
                id="L1Finance"
                checked
                disabled
                className="mb-2"
              />
            </Row>
          </Col>
          <Col>
            <Row>Level 2</Row>
            <Row>
              Commercial
              <CustomInput
                type="checkbox"
                id="L2Commercial"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Operations
              <CustomInput
                type="checkbox"
                id="L2Operations"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Finance
              <CustomInput
                type="checkbox"
                id="L2Finance"
                checked
                disabled
                className="mb-2"
              />
            </Row>
          </Col>
          <Col>
            <Row>Level 3</Row>
            <Row>
              Commercial
              <CustomInput
                type="checkbox"
                id="L3Commercial"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Operations
              <CustomInput
                type="checkbox"
                id="L3Operations"
                checked
                disabled
                className="mb-2"
              />
            </Row>
            <hr />
            <Row>
              Finance
              <CustomInput
                type="checkbox"
                id="L3Finance"
                checked
                disabled
                className="mb-2"
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default React.memo(ApprovalMatrix);

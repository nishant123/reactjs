import React from "react";
import { Container, Card, CardHeader, CardBody, Col, Row, Label, Input } from "reactstrap";
import Form from 'react-bootstrap/Form';                                                                                        
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";

const ApproverContacts = () => {

    return (
        <>
            <Container style={{fontSize: "0.7rem"}}>
                <Row>
                    <Col>
                        <Row>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h5 style={{ padding: "0 0 10px 0" }}>Level 0 Approver(s)</h5>
                                        <Form style={{ width: "100%" }}>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 0 Commercial Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 0 Ops Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 0 Finance Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h5 style={{ padding: "0 0 10px 0" }}>Level 2 Approver(s)</h5>
                                        <Form style={{ width: "100%" }}>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 2 Commercial Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 2 Ops Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 2 Finance Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h5 style={{ padding: "0 0 10px 0" }}>Level 1 Approver(s)</h5>
                                        <Form style={{ width: "100%" }}>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 1 Commercial Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 1 Ops Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 1 Finance Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h5 style={{ padding: "0 0 10px 0" }}>Level 3 Approver(s)</h5>
                                        <Form style={{ width: "100%" }}>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 3 Commercial Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 3 Ops Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                            <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                                <Form.Label>Level 3 Finance Approvers</Form.Label>
                                                <Form.Control type="text" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ApproverContacts;
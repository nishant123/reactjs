import React from "react";
import { Container, Card, CardHeader, CardBody, Col, Row, Label, Input } from "reactstrap";
import Form from 'react-bootstrap/Form';                                                                                        
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";

const NotificationRecipients = () => {

    return (
        <>
            <Container style={{ fontSize: "0.7rem" }}>
                <CardBody>
                    <Row>
                        <Col>
                            <Row><h5 style={{ padding: "0 0 10px 0" }}>Email Notifications Recipients</h5></Row>
                            <Row>
                                <Col>
                                    <Form style={{ width: "100%" }}>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Finance</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Single Country Cost Requests</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Multi Country Cost Requests</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Translation Requests</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Data Acquisition</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col>
                                    <Form style={{ width: "100%" }}>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Online Quote/Feasibility Check (Pacific)</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Offline Quote/Feasibility Check (Pacific)</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Internal Operations Primary</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Internal Operations Others</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Notification BCC</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col>
                                    <Form style={{ width: "100%" }}>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Programming</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Data Processing</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Charting</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Coding</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Internal Coding</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col>
                                    <Form style={{ width: "100%" }}>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Dashboarding</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Internal Dashboarding</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>External Data Science</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
                                            <Form.Label>Internal Data Science</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Container>
        </>
    );
}

export default NotificationRecipients;
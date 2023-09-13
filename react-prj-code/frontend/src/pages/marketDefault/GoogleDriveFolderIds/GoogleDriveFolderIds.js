import React from "react";
import { Container, Card, CardHeader, CardBody, Col, Row, Label, Input } from "reactstrap";
import Form from 'react-bootstrap/Form';                                                                                        
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";

const GoogleDriveFolderIds = () => {

    return (
        <>
            <Container style={{fontSize: "0.7rem"}}>
                <Row>
                    <Col xs="4">
                        <Row>
                            <CardBody>
                                <Row>
                                    <Col>
                                        <h5 style={{padding: "0 0 10px 0"}}>Costings and Resources Root Folder Owner</h5>
                                        <Form style={{width: "100%"}}>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Costings and Resources Root Folder Owner</Form.Label>
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
                                        <h5 style={{padding: "0 0 10px 0"}}>Project Resources Root Folder Ids</h5>
                                        <Form style={{width: "100%"}}>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Project Resources Template Id</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Consumer Insights Project Resources</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Nielsen Sports Project Resources</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Media Analytics Project Resources</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Other Media Project Resources</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Homescan Or Retail Project Resources</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Archived Resources Folder</Form.Label>
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
                                        <h5 style={{padding: "0 0 10px 0"}}>Costing Sheets Root Folder Ids (No TCS Access)</h5>
                                        <Form style={{width: "100%"}}>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Costing Sheet Template Id</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Consumer Insights Costings</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Nielsen Sports Costings</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Media Analytics Costings</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Other Media Costings</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Homescan Or Retail Costings</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Archived Costings Folder</Form.Label>
                                            <Form.Control type="text" />
                                        </Form.Group>
                                        <Form.Group style={{padding: "0 0 20px 0", margin: 0}}>
                                            <Form.Label>Project Box Template Id</Form.Label>
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

export default GoogleDriveFolderIds;
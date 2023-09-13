import React from "react";
import {
	Container,
	Card,
	CardHeader,
	CardBody,
	Col,
	Row,
	Label,
	Input,
} from "reactstrap";
import Form from "react-bootstrap/Form";
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";

const MarketRates = () => {
	return (
		<>
			<Container>
				<Row>
					<Col>
						<Row>
							<CardBody>
								<Row>
									<Col>
										<h5 style={{ padding: "0 0 10px 0" }}>
											Country Currency Details
										</h5>
										<Form style={{ width: "100%" }}>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>
													Conversion Rate To Local Currency
												</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Local Currency Unit</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
										</Form>
									</Col>
								</Row>
								<Row>
									{/* <MultiSelect 
                                        options={[
                                            { Code: "1", Label: "Uses Global Costing Sheet" },
                                            { Code: "2", Label: "Do Not Auto Calculate Ops PM Cost" },
                                            { Code: "3", Label: "Use OOP % Multiplier for Commercial Time Cost" },
                                            { Code: "4", Label: "Use OOP % Multiplier for Internal Operations Cost" },
                                            { Code: "5", Label: "Use OOP % as Mark Up" },
                                        ]}
                                        onChangeResult={(val) => console.log(val)}
                                    /> */}
									<Col>
										<Form>
											<Form.Group>
												<Label>
													<Input type="checkbox" /> Uses Global Costing Sheet
												</Label>
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Label style={{ marginLeft: "1.25rem" }}>
													<Input type="checkbox" /> Do Not Auto Calculate Ops PM
													Cost
												</Label>
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Label style={{ marginLeft: "1.25rem" }}>
													<Input type="checkbox" /> Use OOP % Multiplier for
													Commercial Time Cost
												</Label>
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Label style={{ marginLeft: "1.25rem" }}>
													<Input type="checkbox" /> Use OOP % Multiplier for
													Internal Operations Cost
												</Label>
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Label style={{ marginLeft: "1.25rem" }}>
													<Input type="checkbox" /> Use OOP % as Mark Up
												</Label>
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
										<h5 style={{ padding: "0 0 10px 0" }}>Hourly Rates</h5>
										<Form style={{ width: "100%" }}>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Offshore Charting</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Offshore Dataprocessing</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Data Entry</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>CATI QC</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Operations Project Management</Form.Label>
												<Form.Control type="number" />
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
										<h5 style={{ padding: "0 0 10px 0" }}>Per Unit Rates</h5>
										<Form style={{ width: "100%" }}>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Decipher Hosting Charge</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Offshore Programming</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Full OE Coding</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Other Specified Coding</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>number Analytics</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Minutes Per Chart</Form.Label>
												<Form.Control type="number" />
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
										<h5 style={{ padding: "0 0 10px 0" }}>Offline PM Hours</h5>
										<Form style={{ width: "100%" }}>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>
													Project Management Hours Offline
												</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Project Management Hours Qual</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Project Management Hours CATI</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Project Management Hours SMM</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>
													Project Management Hours Smartst
												</Form.Label>
												<Form.Control type="number" />
											</Form.Group>
											<Form.Group style={{ padding: "0 0 20px 0", margin: 0 }}>
												<Form.Label>Project Management Hours Other</Form.Label>
												<Form.Control type="number" />
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
};

export default MarketRates;

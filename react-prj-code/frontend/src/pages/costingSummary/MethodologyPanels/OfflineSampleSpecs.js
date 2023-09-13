import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Card,
  Col,
  Row,
  Input,
  FormGroup,
  CustomInput,
  Label,
  Container,
} from "reactstrap";

const OfflineTab = (props) => {
  const options = [1, 2, 3];
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Container>
      <h1>{props.data}</h1>
      <Row>
        <Col>
          <FormGroup row>
            <Label for="sampleSource" xs="6">
              Sample Source
            </Label>
            <Col xs="6">
              <Input
                id="sampleSource"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="locationCity" xs="6">
              Location (City)
            </Label>
            <Col xs="6">
              <Input
                id="locationCity"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="locationVenue" xs="6">
              Location (Venue)
            </Label>
            <Col xs="6">
              <Input
                id="locationVenue"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="storePermissions" xs="6">
              Store Permissions
            </Label>
            <Col xs="6">
              <Input
                id="storePermissions"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="incidenceRate" xs="6">
              Incidence Rate (If known)
            </Label>
            <Col xs="6">
              <Input
                id="incidenceRate"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="totalSampleSize" xs="6">
              Total Sample Size
            </Label>
            <Col xs="6">
              <Input
                id="totalSampleSize"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="quotaBreakdown" xs="6">
              Quota Breakdown
            </Label>
            <Col xs="6">
              <Input
                id="quotaBreakdown"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="questionnaireLength" xs="6">
              Questionnaire Length
            </Label>
            <Col xs="6">
              <CustomInput
                type="select"
                id="exampleCustomSelect"
                name="customSelect"
                className="mb-3"
              >
                <option key={0} value="">
                  No Selection
                </option>
                {options.map((val, index) => {
                  return <option key={index}>{val}</option>;
                })}
              </CustomInput>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="fieldStartDate" xs="6">
              Field Start Date
            </Label>
            <Col xs="6">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="fieldEndDate" xs="6">
              Field End Date
            </Label>
            <Col xs="6">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label for="projectBackground">
              Project Background and Objectives
            </Label>
            <Input
              id="projectBackground"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="targetRespondents">Target Respondents</Label>
            <Input
              id="targetRespondents"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="targetCriteria">Target Criteria/Screeners</Label>
            <Input
              id="targetCriteria"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="additionalInformation">Additional Information</Label>
            <Input
              id="additionalInformation"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
};

const OfflineSampleSpecs = () => {
  const rows = [1, 2, 3];
  if (true) {
    return (
      <React.Fragment>
        <h1>Offline Sample Specs</h1>
        <Card>
          {rows.map((val, index) => {
            return <OfflineTab data={val} key={index} />;
          })}
        </Card>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default React.memo(OfflineSampleSpecs);

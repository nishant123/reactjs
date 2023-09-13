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

const QualTab = (props) => {
  const options = [1, 2, 3];
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Container>
      <h1>{props.data}</h1>
      <Row>
        <Col>
          <FormGroup row>
            <Label for="recruitmentStartDate">Recruitment Start Date</Label>
            <Col>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="fieldStartDate">Field Start Date</Label>
            <Col>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="methodology">Methodology</Label>
            <Col>
              <Input
                id="methodology"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="lengthOfInterview">Length of Interview</Label>
            <Col>
              <CustomInput
                type="select"
                id="lengthOfInterview"
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
            <Label for="sampleSource">Sample Source</Label>
            <Col>
              <Input
                id="sampleSource"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="numberToRecruit">
              Number to Recruit - In Depth Interview(s)
            </Label>
            <Col>
              <Input
                id="numberToRecruit"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="numberOfGroups">Number of Groups</Label>
            <Col>
              <Input
                id="numberOfGroups"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="numberOfParticipantsPerGroup">
              Number of Participants Per Group
            </Label>
            <Col>
              <Input
                id="numberOfParticipantsPerGroup"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="locations">Location(s)</Label>
            <Col>
              <Input
                id="locations"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="quotas">Quota(s)</Label>
            <Col>
              <Input
                id="quotas"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="incidenceRate">Incidence Rate (If known)</Label>
            <Col>
              <Input
                id="incidenceRate"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="incentivePerPerson">Incentive Per Person</Label>
            <Col>
              <Input
                id="incentivePerPerson"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="extraIncentive">
              Extra Incentive for prework per person
            </Label>
            <Col>
              <Input
                id="extraIncentive"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="transcriptionRequired">Transcription Required</Label>
            <Col>
              <CustomInput
                type="switch"
                id="transcriptionRequired"
                name="transcriptionRequired"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="refreshments">Refreshments/Food</Label>
            <Col>
              <CustomInput
                type="switch"
                id="refreshments"
                name="refreshments"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="hostessing">Hostessing</Label>
            <Col>
              <CustomInput type="switch" id="hostessing" name="hostessing" />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="other">Other</Label>
            <Col>
              <Input
                id="other"
                type="text"
                placeholder="Enter Value..."
              ></Input>
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
            <Label for="prework">Pre-work/homework/diary</Label>
            <Input
              id="prework"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="targetCriteria">Target/Respondent Criteria</Label>
            <Input
              id="targetCriteria"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="otherComments">Other comments</Label>
            <Input
              id="otherComments"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
};

const QualSampleSpecs = () => {
  const rows = [1, 2, 3];
  if (true) {
    return (
      <React.Fragment>
        <h1>Qual Sample Specs</h1>
        <Card>
          {rows.map((val, index) => {
            return <QualTab data={val} key={index} />;
          })}
        </Card>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default React.memo(QualSampleSpecs);

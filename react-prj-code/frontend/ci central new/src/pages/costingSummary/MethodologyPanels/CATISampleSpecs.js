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

const CATITab = (props) => {
  const options = [1, 2, 3];
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Container>
      <h1>{props.data}</h1>
      <Row>
        <Col>
          <FormGroup row>
            <Label for="businessOrResidential">Business or Residential</Label>
            <Col>
              <Input
                id="businessOrResidential"
                type="text"
                placeholder="Enter Value..."
              ></Input>
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
            <Label for="incidenceRate">Incidence Rate</Label>
            <Col>
              <Input
                id="incidenceRate"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="totalCompletedInterviews">
              Total Completed Interviews
            </Label>
            <Col>
              <Input
                id="totalCompletedInterviews"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="questionnaireLength">Questionnaire Length</Label>
            <Col>
              <CustomInput
                type="select"
                id="questionnaireLength"
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
            <Label for="numberOfOpenEnders">Number of Open Enders</Label>
            <Col>
              <Input
                id="numberOfOpenEnders"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="incentive">Incentive</Label>
            <Col>
              <Input
                id="incentive"
                type="text"
                placeholder="Enter Value..."
              ></Input>
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
            <Label for="fieldEndDate">Field End Date</Label>
            <Col>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="lengthOfTimeInField">Length of Time In Field</Label>
            <Col>
              <Input
                id="lengthOfTimeInField"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="finalDataDeliveryDate">Final Data Delivery Date</Label>
            <Col>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              ></DatePicker>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="questionnaireAvailable">Questionnaire Available</Label>
            <Col>
              <Input
                id="questionnaireAvailable"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="questionnaireComplexity">
              Questionnaire Complexity
            </Label>
            <Col>
              <CustomInput
                type="select"
                id="questionnaireComplexity"
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
            <Label for="timeStampsRequired">Time Stamps Required</Label>
            <Col>
              <CustomInput
                type="switch"
                id="timeStampsRequired"
                name="timeStampsRequired"
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="dataOutput">Data Output (At Pilot and Final)</Label>
            <Col>
              <Input
                id="dataOutput"
                type="text"
                placeholder="Enter Value..."
              ></Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="frequencyOfFieldworkUpdates">
              Frequency of Fieldwork Updates
            </Label>
            <Col>
              <CustomInput
                type="select"
                id="frequencyOfFieldworkUpdates"
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
            <Label for="targetCriteria">Target/Respondent Criteria</Label>
            <Input
              id="targetCriteria"
              type="textarea"
              placeholder="Enter Value..."
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label for="quotaBreakdown">Quota Breakdown</Label>
            <Input
              id="quotaBreakdown"
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

const CATISampleSpecs = () => {
  const rows = [1, 2, 3];
  if (true) {
    return (
      <React.Fragment>
        <h1>CATI Sample Specs</h1>
        <Card>
          {rows.map((val, index) => {
            return <CATITab data={val} key={index} />;
          })}
        </Card>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default React.memo(CATISampleSpecs);

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import {
  CustomInput,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import Select from "react-select";

import {
  getMultiOptions,
  getMultiOptionsWithDependency,
  getSubMethodologyAttribute,
  getSingleOptions,
} from "../../utils/codeLabels";

const ProjectDetails = ({ fieldInvalidation }) => {
  const newProject = useSelector(
    ({ currentProject }) => currentProject.newProject
  );
    const codeLabels = useSelector(({ codeLabels }) => codeLabels);

  const costingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const dispatch = useDispatch();

  const updateCostingProfile = (costingProfile) => {
    dispatch({
      type: "UPDATE_NEW_COSTING",
      currentCostingProfile: costingProfile,
    });
  };

  useEffect(() => {
    if (newProject.CommissioningCountry !== "") {
      updateCostingProfile({
        FieldingCountries: getMultiOptions(
          codeLabels.FieldingCountriesOptions,
          newProject.CommissioningCountry
        ),
      });
    }
  }, [newProject.CommissioningCountry]);
  const handleTrackerChange = (e) => {
    updateCostingProfile({
      IsTracker: !e.target.defaultChecked,
      NumberOfWaves: 1,
      TrackingFrequency: "",
    });
  };

  const handleMultiCountryChange = (e) => {
    if (e.target.defaultChecked) {
      updateCostingProfile({
        IsMultiCountry: false,
        FieldingCountries: getMultiOptions(
          codeLabels.FieldingCountriesOptions,
          newProject.CommissioningCountry
        ),
      });
    } else {
      updateCostingProfile({ IsMultiCountry: true });
    }
  };

  const handleMethodologyChange = (e) => {
    // Methodology change only removes SubMethodologies that no longer apply
    if (e) {
      updateCostingProfile({
        Methodology: e,
        SubMethodology: [],
        ResearchType: "",
        FieldType: "",
      });
    } else {
      updateCostingProfile({
        Methodology: [],
        SubMethodology: [],
        ResearchType: "",
        FieldType: "",
      });
    }
  };

  const handleSubMethodologyChange = (e) => {
    console.log("called", e);
    if (e) {
      updateCostingProfile({
        SubMethodology: e,
        ResearchType: getSubMethodologyAttribute(
          codeLabels.MethodologyOptions,
          costingProfile.Methodology,
          e,
          "ResearchType"
        ),
        FieldType: getSubMethodologyAttribute(
          codeLabels.MethodologyOptions,
          costingProfile.Methodology,
          e,
          "FieldType"
        ),
      });
    } else {
      updateCostingProfile({
        SubMethodology: [],
        ResearchType: "",
        FieldType: "",
      });
    }
  };
  return (
    <React.Fragment>
      <FormGroup>
        <Label className="h5">Costing Profile Name</Label>
        <Input
          type="text"
          placeholder="This name can be anything that describes your costing scenario..."
          value={costingProfile.ProfileName}
          onChange={(e) =>
            updateCostingProfile({ ProfileName: e.target.value })
          }
        />
        <FormFeedback>Please check study type selection.</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label className="h5">Study Type</Label>
        <Select
          className={
            fieldInvalidation.StudyType
              ? "react-select-container is-invalid"
              : "react-select-container"
          }
          classNamePrefix="react-select"
          options={getMultiOptions(codeLabels.StudyTypeOptions)}
          isMulti
          value={costingProfile.StudyType}
          onChange={(e) => updateCostingProfile({ StudyType: e })}
        />
        <FormFeedback>Please check study type selection.</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Label className="h5">Methodologies</Label>
        <br />
        <Label>
          <a
            href="https://docs.google.com/spreadsheets/d/1IusaGQVisvsy_DFkV8HT_-q-7h3fciehPqEwsv9jyKU/"
            target="_blank"
          >
            View Mapping List
          </a>
        </Label>
        <Select
          className={
            fieldInvalidation.Methodology
              ? "react-select-container is-invalid"
              : "react-select-container"
          }
          classNamePrefix="react-select"
          options={getMultiOptions(codeLabels.MethodologyOptions)}
          isMulti
          value={costingProfile.Methodology}
          onChange={(e) => handleMethodologyChange(e)}
        />
        <FormFeedback>Please check methodology selection.</FormFeedback>
      </FormGroup>
      {getMultiOptionsWithDependency(
        codeLabels.MethodologyOptions,
        costingProfile.Methodology
      )?.length !== 0 ? (
        <FormGroup>
          <Label className="h5">Sub-Methodologies</Label>
          <Select
            className={
              fieldInvalidation.SubMethodology
                ? "react-select-container is-invalid"
                : "react-select-container"
            }
            classNamePrefix="react-select"
            options={getMultiOptionsWithDependency(
              codeLabels.MethodologyOptions,
              costingProfile.Methodology
            )}
            isMulti
            value={costingProfile.SubMethodology}
            onChange={(e) => {
              handleSubMethodologyChange(e);
            }}
          />
          <FormFeedback>Please check sub-Methodology selection.</FormFeedback>
        </FormGroup>
      ) : null}
      <FormGroup>
        <CustomInput
          type="switch"
          id="trackingSwitch"
          name="customSwitch"
          label="Tracking Project"
          className="h5"
          defaultChecked={costingProfile.IsTracker}
          onChange={(e) => {
            handleTrackerChange(e);
          }}
        />
      </FormGroup>
      {costingProfile.IsTracker ? (
        <React.Fragment>
          <Row>
            <Col>
              <FormGroup>
                <Label className="h5">Number of Waves</Label>
                <Input
                  type="text"
                  name="input"
                  placeholder="Input"
                  invalid={fieldInvalidation.NumberOfWaves}
                  value={costingProfile.NumberOfWaves}
                  onChange={(e) =>
                    updateCostingProfile({ NumberOfWaves: e.target.value })
                  }
                />
                <FormFeedback>
                  Tracking projects should have more than 1 wave.
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="h5">Tracking Frequency</Label>
                <Input
                  type="select"
                  id="exampleCustomSelect"
                  name="customSelect"
                  invalid={fieldInvalidation.TrackingFrequency}
                  value={costingProfile.TrackingFrequency}
                  onChange={(e) =>
                    updateCostingProfile({
                      TrackingFrequency: e.target.value,
                    })
                  }
                >
                  <option value="">Please select an option</option>
                  {getSingleOptions(codeLabels.TrackingFrequencyOptions)}
                </Input>
                <FormFeedback>
                  Please check tracking frequency selection.
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </React.Fragment>
      ) : null}

      <CustomInput
        type="switch"
        id="multiCountrySwitch"
        name="customSwitch"
        label="Multi-Country Project"
        className="h5"
        defaultChecked={costingProfile.IsMultiCountry}
        onChange={(e) => handleMultiCountryChange(e)}
      />

      <Label className="h5">Fielding Countries</Label>
      <FormGroup>
        <Select
          className={
            fieldInvalidation.FieldingCountries
              ? "react-select-container is-invalid"
              : "react-select-container"
          }
          classNamePrefix="react-select"
          options={getMultiOptions(codeLabels.FieldingCountriesOptions)}
          isMulti
          isSearchable
          isDisabled={!costingProfile.IsMultiCountry}
          value={costingProfile.FieldingCountries}
          onChange={(e) => updateCostingProfile({ FieldingCountries: e })}
        />
        <FormFeedback>
          Multi-Country projects must include atleast two different countries
          (including commission country).
        </FormFeedback>
      </FormGroup>
    </React.Fragment>
  );
};

export default ProjectDetails;

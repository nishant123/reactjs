import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import
{
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

import
{
    getMultiOptions,
    getMultiOptionsWithDependency,
    getSubMethodologyAttribute,
    getSingleOptions,
} from "../../utils/codeLabels";

const ProjectDetails = ({ project, fieldInvalidation, updateProject }) =>
{
    const codeLabels = useSelector(({ codeLabels }) => codeLabels);

    const dispatch = useDispatch();

    const handleStudyTypeChange = (value) =>
    {
        updateProject({
             StudyType: value
        });
    };

    const handleMethodologyChange = (e) =>
    {
        // Methodology change only removes SubMethodologies that no longer apply
        if (e)
        {
            //updateCostingProfile({
            //    Methodology: e,
            //    SubMethodology: [],
            //    ResearchType: "",
            //    FieldType: "",
            //});

            updateProject({
                Methodology: e,
                SubMethodology: [],
                ResearchType: "",
                FieldType: "",
            });

        }
        else
        {
            //updateCostingProfile({
            //    Methodology: [],
            //    SubMethodology: [],
            //    ResearchType: "",
            //    FieldType: "",
            //});

            updateProject({
                Methodology: [],
                SubMethodology: [],
                ResearchType: "",
                FieldType: "",
            });

        }
    };

    const handleSubMethodologyChange = (e) =>
    {       
       
        if (e)
        { 
            updateProject({
                SubMethodology: e,
                ResearchType: getSubMethodologyAttribute(
                    codeLabels.MethodologyOptions,
                    project.Methodology,
                    e,
                    "ResearchType"
                ),
                FieldType: getSubMethodologyAttribute(
                    codeLabels.MethodologyOptions,
                    project.Methodology,
                    e,
                    "FieldType"
                ),
            });


        } else
        {            
            updateProject({
                SubMethodology: [],
                ResearchType: "",
                FieldType: "",
            });
        }
    };

    const handleTrackerChange = (val) =>
    {
        //updateCostingProfile({
        //    IsTracker: !e.target.defaultChecked,
        //    NumberOfWaves: 1,
        //    TrackingFrequency: "",
        //});
        debugger;
        updateProject({
            IsTracker: val,
            NumberOfWaves: 1,
            TrackingFrequency: "",
        });
    };

    const handleMultiCountryChange = (val) =>
    {
        if (!val)
        {
            //updateCostingProfile({
            //    IsMultiCountry: false,
            //    FieldingCountries: getMultiOptions(
            //        codeLabels.FieldingCountriesOptions,
            //        newProject.CommissioningCountry
            //    ),
            //});


            updateProject({
                IsMultiCountry: false,
                FieldingCountries: getMultiOptions(
                    codeLabels.FieldingCountriesOptions,
                    project.CommissioningCountry
                ),
            });
        } else
        {
            //updateCostingProfile({ IsMultiCountry: true });
            updateProject({
                IsMultiCountry: true
            });
        }
    };

    return (
        <React.Fragment>            
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
                    value={project.StudyType}
                    onChange={(e) => handleStudyTypeChange(e)}
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
                    value={project.Methodology}
                    onChange={(e) => handleMethodologyChange(e)}
                />
                <FormFeedback>Please check methodology selection.</FormFeedback>
            </FormGroup>
            {getMultiOptionsWithDependency(
                codeLabels.MethodologyOptions,
                project.Methodology
            ) ?.length !== 0 ? (
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
                            project.Methodology
                        )}
                        isMulti
                        value={project.SubMethodology}
                        onChange={(e) =>
                        {
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
                    defaultChecked={project.IsTracker}
                    onChange={(e) =>
                    {
                        handleTrackerChange(e.target.checked);
                    }}
                />
            </FormGroup>
            {project.IsTracker ? (
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
                                    value={project.NumberOfWaves}
                                    onChange={(e) =>
                                        updateProject({ NumberOfWaves: e.target.value })
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
                                    value={project.TrackingFrequency}
                                    onChange={(e) =>
                                        updateProject({
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
                defaultChecked={project.IsMultiCountry}
                onChange={(e) => handleMultiCountryChange(e.target.checked)}
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
                    isDisabled={!project.IsMultiCountry}
                    value={project.FieldingCountries}
                    onChange={(e) => updateProject({ FieldingCountries: e })}
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

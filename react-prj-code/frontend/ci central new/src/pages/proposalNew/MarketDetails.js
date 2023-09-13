import React, { useEffect } from "react";
import { Col, Row, CardBody, FormFeedback, FormGroup } from "reactstrap";
import { useSelector } from "react-redux";
import _ from "lodash"
import { CustomInput, Input } from "reactstrap";

import { getMultiOptions } from "../../utils/codeLabels";

const Start = ({ project, updateProject, fieldInvalidation }) => {
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  useEffect(() => {
    let dropdownOptions = [];
    if (project.CommissioningCountry !== "") {
      dropdownOptions = codeLabels.UserScopeOptions.filter((obj) => {
        if (obj.Code === project.CommissioningCountry) {
          return obj;
        }
      })[0]?.Offices;

      if (project.CommissioningOffice === "" && dropdownOptions.length === 1) {
        updateProject({ CommissioningOffice: dropdownOptions[0]?.Code });
      }
    }
  }, [project.CommissioningCountry]);

  useEffect(() => {
    let dropdownOptions = [];
    if (project.CommissioningCountry !== "") {
      dropdownOptions = codeLabels.UserScopeOptions.filter((obj) => {
        if (obj.Code === project.CommissioningCountry) {
          return obj;
        }
      })[0]?.BusinessUnits;

      if (project.BusinessUnit === "" && dropdownOptions.length === 1) {
        updateProject({
          BusinessUnit: dropdownOptions[0].Code,
          BusinessUnitId: dropdownOptions[0].id,
        });
      }
    }
  }, [project.CommissioningCountry]);

  useEffect(() => {
    let dropdownOptions = [];
    if (project.CommissioningCountry !== "" && project.BusinessUnit !== "") {
      dropdownOptions = codeLabels.UserScopeOptions.filter((obj) => {
        if (obj.Code === project.CommissioningCountry) {
          return obj;
        }
      })[0]?.BusinessUnits.filter((obj) => {
        if (obj.Code === project.BusinessUnit) {
          return obj;
        }
      })[0]?.Verticals;

      if (project.IndustryVertical === "" && dropdownOptions.length === 1) {
        handleIndustryVerticalChange(dropdownOptions[0].Code);
      }
    }
  }, [project.BusinessUnit]);




    const handleCommCountryChange = (value) =>
    {

        debugger;
    updateProject({
      CommissioningCountry: value,
      CommissioningOffice: "",
      BusinessUnit: "",
      IndustryVertical: "",
      FieldingCountries: getMultiOptions(
        codeLabels.FieldingCountriesOptions,
        value
      ),
      VerticalId: null,
      BusinessUnitId: null,
    });
  };

  const handleBusinessUnitChange = (e) => {
    updateProject({
      BusinessUnit: e.target.value,
      BusinessUnitId: Number(e.target.selectedOptions[0].id),
      IndustryVertical: "",
      VerticalId: null,
    });
  };
  const currentSFOPStatus = (vertCode) => {
    let currentCC = _.head(codeLabels.UserScopeOptions.filter(uso => uso.Code === project.CommissioningCountry))
    let currentBU = _.head(currentCC.BusinessUnits.filter(bu => bu.Code === project.BusinessUnit))
    let currentVertical = _.head(currentBU.Verticals.filter(ver => ver.Code == vertCode))
    return currentVertical
  }
  const handleIndustryVerticalChange = (vertCode) => {
    console.log("in handle industry vertical change");
    if (project.CommissioningCountry !== "" && project.BusinessUnit !== "") {
      let vert = currentSFOPStatus(vertCode)

      updateProject({
        IndustryVertical: vertCode,
        VerticalId: vert?.id,
      });
    }
  };
  return (
    <React.Fragment>
      <Row>
        <Col>
          <h5>Commissioning Country</h5>
          <FormGroup>
            <Input
              type="select"
              id="commissioningCountry"
              name="commissioningCountry"
              value={project.CommissioningCountry}
              invalid={fieldInvalidation.CommissioningCountry}
              onChange={(e) => {
                handleCommCountryChange(e.target.value);
              }}
            >
              <option value="">Please select an option</option>
              {codeLabels.UserScopeOptions.map((obj) => {
                return (
                  <option key={obj.Code} value={obj.Code}>
                    {obj.Label}
                  </option>
                );
              })}
            </Input>
            <FormFeedback>Please check country selection.</FormFeedback>
          </FormGroup>
        </Col>
        <Col>
          <h5>Commissioning Office</h5>
          <FormGroup>
            <Input
              type="select"
              id="commissioningOffice"
              name="commissioningOffice"
              invalid={fieldInvalidation.CommissioningOffice}
              value={project.CommissioningOffice}
              onChange={(e) =>
                updateProject({ CommissioningOffice: e.target.value })
              }
            >
              <option value="">Please select an option</option>
              {project.CommissioningCountry !== ""
                ? _.head(codeLabels.UserScopeOptions.filter((obj) => {
                  if (obj.Code === project.CommissioningCountry) {
                    return obj;
                  }
                }))?.Offices.map((obj) => {
                  return (
                    <option key={obj.Code} value={obj.Code}>
                      {obj.Label}
                    </option>
                  );
                })
                : null}
            </Input>
            <FormFeedback>Please check office selection.</FormFeedback>
          </FormGroup>
        </Col>
        <Col>
          <h5>Business Unit</h5>
          <FormGroup>
            <Input
              type="select"
              id="businessUnit"
              name="businessUnit"
              value={project.BusinessUnit}
              invalid={fieldInvalidation.BusinessUnit}
              onChange={(e) => {
                handleBusinessUnitChange(e);
              }}
            >
              <option value="">Please select an option</option>
              {project.CommissioningCountry !== ""
                ? _.head(codeLabels.UserScopeOptions.filter((obj) => {
                  if (obj.Code === project.CommissioningCountry) {
                    return obj;
                  }
                }))?.BusinessUnits.map((obj) => {
                  return (
                    <option key={obj.Code} value={obj.Code} id={obj.id}>
                      {obj.Label}
                    </option>
                  );
                })
                : null}
            </Input>
            <FormFeedback>Please check business unit selection.</FormFeedback>
          </FormGroup>
        </Col>
        <Col>
          <h5>Industry Vertical</h5>
          <FormGroup>
            <Input
              type="select"
              id="industryVertical"
              name="industryVertical"
              value={project.IndustryVertical}
              invalid={fieldInvalidation.IndustryVertical}
              onChange={(e) => {
                handleIndustryVerticalChange(e.target.value);
              }}
            >
              <option value="">Please select an option</option>
              {project.CommissioningCountry !== "" && project.BusinessUnit &&
                project.BusinessUnit !== ""
                ? _.head(codeLabels.UserScopeOptions.filter((obj) => {
                  if (obj.Code === project.CommissioningCountry) {
                    return obj;
                  }
                }))
                  .BusinessUnits.filter((obj) => {
                    if (obj.Code === project.BusinessUnit) {
                      return obj;
                    }
                  })[0]
                  ?.Verticals.map((obj) => {
                    return (
                      <option
                        key={obj.Code}
                        value={obj.Code}
                        id={obj.id}
                        vertical={obj}
                      >
                        {obj.Label}
                      </option>
                    );
                  })
                : null}
            </Input>
            <FormFeedback>
              Please check industry vertical selection.
            </FormFeedback>
          </FormGroup>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Start;

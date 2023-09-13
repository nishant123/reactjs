import { Card, CardBody, Col, Container, Row } from "reactstrap";
import React, { useState, useEffect, useRef } from "react";
import Selector from "../../components/Selector/Selector";
import { getLabel } from "../../utils/codeLabels";
import { calcAll } from "../../utils/calculations";
import update from "immutability-helper";
import Form from "@rjsf/bootstrap-4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import * as waveSpecsActions from "../../redux/actions/waveSpecsActions";
import * as currentWaveSpecActions from "../../redux/actions/currentWaveSpecActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import ObjectFieldTemplate from "./ObjectFieldTemplate";

import schema from "./opsResourcesSchema.json";

const OpsResources = (props) => {
  const dispatch = useDispatch();
  const currentProject = useSelector(
    ({ currentProject }) => currentProject.newProject
  );

  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
  const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
  const currentWaveSpec = useSelector(({ currentWaveSpec }) => currentWaveSpec);
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const rateCards = useSelector(({ rateCards }) => rateCards);
  const app = useSelector(({ app }) => app);
  // if (!currentWaveSpec.OpsResourcesData) {
  //   dispatch({
  //     type: currentWaveSpecActions.updateCurrentWaveSpec,
  //     OpsResourcesData: {},
  //   });
  // }

  // DB schemas
  let schemas = [currentWaveSpec.OpsResourcesSchema];

  // Dummy local schema for testing
  // schemas = [schema];

  if (schemas && schemas.length) {
    schemas.map((sch) => {
      if (sch?.properties) {
        Object.keys(sch.properties)
          .filter(
            (pro) =>
              sch.properties[pro].isMultiCountry ==
              !currentCostingProfile.IsMultiCountry
          )
          .map((pro) => {
            delete sch.properties[pro];
          });
        Object.keys(sch.properties).map(pro => {
          if (sch.properties[pro].widgetType == "multiselectdropdown" && sch.properties[pro].isMulti) {
            sch.properties[pro].isCreatable = true
          }
        })
      }
      if (sch?.dependencies) {
        Object.keys(sch.dependencies).map((dep) => {
          sch.dependencies[dep].oneOf.map((oo) => {
            Object.keys(oo.properties).map((pro) => {
              if (
                oo.properties[pro].isMultiCountry ==
                !currentCostingProfile.IsMultiCountry
              ) {
                delete oo.properties[pro];
              }
              Object.keys(oo.properties).map((pro) => {
                if (oo.properties[pro].widgetType == "multiselectdropdown") {
                  oo.properties[pro].isCreatable = true
                }
              })
            });
          });
        });
      }
    });
  }

  const onChangeHandler = ({ formData, schema }) => {
    var final = Object.keys(formData).filter(
      (fd) => Object.keys(schema.dependencies).indexOf(fd) != -1
    );

    final.map((f) => {
      schema.dependencies[f].oneOf.map((oo) => {
        Object.keys(oo.properties).map((prp) => {
          if (prp != f && !formData[f]) formData[prp] = null;
        });
      });
    });
    dispatch(
      currentWaveSpecActions.updateCurrentWaveSpec({
        ...currentWaveSpec,
        OpsResourcesData: formData,
      })
    );

    let wavespecs = [...waveSpecs];
    wavespecs.map((ws) => {
      if (ws.id == currentWaveSpec.id) ws.OpsResourcesData = formData;
    });

    wavespecs = calcAll(
      currentProject,
      currentCostingProfile,
      countrySpecs,
      wavespecs,
      rateCards
    );

    dispatch(waveSpecsActions.setWaveSpecs(wavespecs));
  };
  const onOptionLabelChange = (value, key) => {
    if (Array.isArray(value))
      onChangeHandler({
        formData: {
          ...currentWaveSpec.OpsResourcesData,
          [key]: value.map((val) => val.value),
        },
      });
    else
      onChangeHandler({
        formData: { ...currentWaveSpec.OpsResourcesData, [key]: value.value },
      });
  };
  const getSelectedOption = (options, optionalLabel) => {
    if (codeLabels && optionalLabel && codeLabels[optionalLabel] && options) {
      if (Array.isArray(options)) {
        return codeLabels[optionalLabel]
          .filter((cl) => options.indexOf(cl.Code) != -1)
          ?.map((opt) => {
            return { value: opt.Code, label: opt.Label };
          });
      } else {
        let selectedVal = codeLabels[optionalLabel]
          .filter((cl) => cl.Code == options)
          .pop();
        return { value: selectedVal.Code, label: selectedVal.Label };
      }
    } else if (!optionalLabel && options) {
      if (Array.isArray(options)) {
        return options.map((opt) => {
          return { value: opt, label: opt };
        });
      } else {
        return { value: options, label: options };
      }
    } else {
      return "";
    }
  };
  const selectorHandler = (item) => {
    // short circuits if clicked item is current item
    if (item.id === currentWaveSpec.id) return;

    const itemIndex = waveSpecs.findIndex(
      (record) => record.id === currentWaveSpec.id
    );
    const newArr = update(waveSpecs, {
      [itemIndex]: { $set: currentWaveSpec },
    });

    dispatch(currentWaveSpecActions.selectWaveSpec(item));
    dispatch(waveSpecsActions.setWaveSpecs(newArr));
  };

  const applyAllWaves = () => {
    let wavespecs = waveSpecs;
    wavespecs.map((ws) => {
      if (ws.id != currentWaveSpec.id)
        ws.OpsResourcesData = currentWaveSpec.OpsResourcesData;
    });
    wavespecs = calcAll(
      currentProject,
      currentCostingProfile,
      countrySpecs,
      wavespecs,
      rateCards
    );
    dispatch(waveSpecsActions.setWaveSpecs(wavespecs));
    dispatch(currentCostingActions.updateProfile({ WaveSpecs: wavespecs }));
  };

  const renderSelector = () => {
    if (!waveSpecs || (waveSpecs && waveSpecs.length === 1)) return null;
    return (
      <Col lg="2" md="2" sm="12" xs="12">
        <Selector
          heading={"Waves"}
          records={waveSpecs}
          applyAll={applyAllWaves}
          applyAllText={"Apply to All Waves"}
          clicked={selectorHandler}
          interPolField={["WaveNumber", "WaveName"]}
          displayField={
            <>
              <FontAwesomeIcon
                title="Edit Wave Name"
                size="xs"
                icon={faPen}
                className="pointer"
                onClick={props.toggleWaveEditModal}
              />
            </>
          }
          selected={currentWaveSpec}
        //   labelGroup={"FieldingCountriesOptions"}
        />
      </Col>
    );
  };

  return (
    <>
      <Row>
        <Container fluid>
          <Row>
            {renderSelector()}
            <Col>
              {schemas?.map((schema) => {
                let uiSchema = {};
                // let idSchema = {
                //   $id: `${schema.title?.replace(
                //     / /g,
                //     "_"
                //   )}`, properties: {}
                // };
                let schemaTwoProperties = schema?.properties;

                if (schemaTwoProperties) {
                  Object.keys(schemaTwoProperties).map((sch) => {
                    let currentProperty = schemaTwoProperties[sch];
                    // idSchema[sch] = currentProperty.title?.replace(
                    //   / /g,
                    //   "_"
                    // )
                    uiSchema[sch] =
                      currentProperty.widgetType == "multiselectdropdown"
                        ? {
                          "ui:widget": (properties) => {
                            return (
                              <>
                                <label className="form-label">
                                  {currentProperty.title}
                                  <span>*</span>
                                </label>
                                <Select
                                  className="custom-select-box"
                                  isMulti={currentProperty.isMulti}
                                  options={
                                    currentProperty.optionsLabel
                                      ? codeLabels[
                                        currentProperty.optionsLabel
                                      ]?.map((opt) => {
                                        return {
                                          value: opt.Code,
                                          label: opt.Label,
                                        };
                                      })
                                      : properties.options.enumOptions
                                  }
                                  defaultValue={
                                    currentWaveSpec.OpsResourcesData
                                      ? currentWaveSpec.OpsResourcesData[sch]
                                        ? getSelectedOption(
                                          currentWaveSpec.OpsResourcesData[
                                          sch
                                          ],
                                          currentProperty.optionsLabel
                                        )
                                        : ""
                                      : null
                                  }
                                  onChange={(select) =>
                                    onOptionLabelChange(select, sch)
                                  }
                                />
                              </>
                            );
                          },
                        }
                        : currentProperty.widgetType
                          ? {
                            "ui:widget": currentProperty.widgetType,
                          }
                          : {};

                    uiSchema[sch]["ui:options"] = currentProperty.uiOptions;
                  });
                }
                uiSchema["ui:order"] = schema?.order;
                return (
                  <Card>
                    {/* <CardHeader
                      onClick={(e) => {
                        props.setMethodologyToggles({
                          ...props.methodologyToggles,
                          [schema.title]: !props.methodologyToggles[
                            schema.title
                          ],
                        });
                      }}
                    >
                      <Row>
                        <Col xs="11">
                          <h3>
                            {schema.title} -{" "}
                            {getLabel(
                              "FieldingCountriesOptions",
                              props.currentCountrySpec.CountryCode
                            )}
                            {schemas.length > 1 && !schema.NotApplicable ? (
                              <button
                                className="btn btn-primary btn-sm m-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  applyToAllForms(schema.title);
                                }}
                              >
                                Copy to all forms
                              </button>
                            ) : null}
                            <br></br>
                            {props.countrySpecs.length > 1 ? (
                              <span className="methodology-selection">
                                Methodology not applicable for this Country
                                <label className="switch ml-2">
                                  <input
                                    type="checkbox"
                                    onChange={(eve) => {
                                      eve.stopPropagation();
                                      onMethodologyChange(eve, schema);
                                    }}
                                    checked={
                                      schema.NotApplicable ? true : false
                                    }
                                  />
                                  <span className="slider round"></span>
                                </label>
                              </span>
                            ) : null}
                          </h3>
                        </Col>
                        <Col xs="1">
                          <FontAwesomeIcon
                            className="align-middle mr-2"
                            icon={
                              !props.methodologyToggles[schema.title]
                                ? faChevronRight
                                : faChevronDown
                            }
                            fixedWidth
                          />
                        </Col>
                      </Row> 
                       </CardHeader> */}

                    {/* <Collapse isOpen={props.methodologyToggles[schema.title]}> */}
                    <CardBody>
                      {/* {currentWaveSpec.id && !schema.NotApplicable ? ( */}
                      {/* {currentWaveSpec.id ? ( */}
                      {schema ? (
                        <Form
                          schema={schema}
                          formData={currentWaveSpec.OpsResourcesData || {}}
                          uiSchema={uiSchema}
                          idPrefix={`${schema.title
                            ?.replace(/ /g, "_")
                            .replace(/\(/g, "_")
                            .replace(/\)/g, "_")
                            .replace(/./g, "_")
                            .replace(/,/g, "_")}`}
                          // idSchema={idSchema}
                          onChange={(data) => onChangeHandler(data, schema)}
                          ObjectFieldTemplate={ObjectFieldTemplate}
                          className={`${schema.title?.replace(
                            / /g,
                            "_"
                          )}_form methodology_form col-12`}
                          showErrorList={false}
                          key={`${currentWaveSpec.id} ${schema.title}`}
                        >
                          <React.Fragment />
                        </Form>
                      ) : null}
                      {/* ) : null} */}
                    </CardBody>
                    {/* </Collapse> */}
                  </Card>
                );
              })}
            </Col>
          </Row>
        </Container>
      </Row>
    </>
  );
};

export default OpsResources;

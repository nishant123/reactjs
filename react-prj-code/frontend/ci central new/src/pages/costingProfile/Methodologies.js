import {
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Row,
  CardHeader,
  Collapse,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import React, { useState, useEffect, useRef } from "react";
import Selector from "../../components/Selector/Selector";
import { getLabel } from "../../utils/codeLabels";
import update from "immutability-helper";
import Form from "@rjsf/bootstrap-4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { connect, useSelector, useDispatch } from "react-redux";
import validateFormData from "@rjsf/core/lib/validate";
import _ from "lodash";
import { calcAll } from "../../utils/calculations";
import * as countryActions from "../../redux/actions/countrySpecsActions";
import * as waveSpecsActions from "../../redux/actions/waveSpecsActions";
import * as currentCountryActions from "../../redux/actions/currentCountrySpecActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import ObjectFieldTemplate from "./ObjectFieldTemplate";

const Methodologies = (props) => {
  const dispatch = useDispatch();
  const [applyModal, setApplyModal] = useState(false);
  const [currentSchemaTitle, setCurrentSchemaTitle] = useState();
  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const currentProject = useSelector(
    ({ currentProject }) => currentProject.newProject
  );
  const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
  const rateCards = useSelector(({ rateCards }) => rateCards);

  const schemas = props.currentCountrySpec.MethodologySpecs?.map(
    (item, ind) => {
      if (!item.RFQSchemaNA && item.RFQSchema)
        return {
          ...item.RFQSchema,
          NotApplicable: item.NotApplicable,
          Label: item.Label,
        };
      else if (item.RFQSchemaNA && !item.RFQSchema)
        return {
          RFQSchemaNA: item.RFQSchemaNA,
          NotApplicable: item.NotApplicable,
          Label: item.Label,
          RFQSchemaAlternative: item.RFQSchemaAlternative,
        };
    }
  );

  schemas?.map((sch) => {
    if (sch.properties)
      Object.keys(sch.properties)
        .filter(
          (pro) =>
            sch.properties[pro].isMultiCountry ==
            !currentCostingProfile.IsMultiCountry
        )
        .map((pro) => {
          delete sch.properties[pro];
        });
    if (sch.dependencies)
      Object.keys(sch.dependencies).map((dep) => {
        sch.dependencies[dep].oneOf.map((oo) => {
          Object.keys(oo.properties).map((pro) => {
            if (
              oo.properties[pro].isMultiCountry ==
              !currentCostingProfile.IsMultiCountry
            ) {
              delete oo.properties[pro];
            }
          });
        });
      });
  });

  console.log(props);
  useEffect(() => {
    const titles = {};
    schemas?.forEach((item) => {
      titles[item.title] = true;
    });
    props.setMethodologyToggles(titles);
  }, []);

  const onChangeHandler = ({ formData, schema }) => {
    const schemaIndex = props.currentCountrySpec.MethodologySpecs.findIndex(
      (item) => {
        return item.RFQSchema.title === schema.title;
      }
    );

    const newSpec = update(props.currentCountrySpec, {
      MethodologySpecs: {
        [schemaIndex]: {
          RFQData: {
            $set: formData,
          },
        },
      },
    });

    let countrySpecs = [...props.countrySpecs];
    let currentCountrySpec = _.head(
      countrySpecs.filter(
        (ct) => ct.CountryCode == props.currentCountrySpec.CountryCode
      )
    );
    currentCountrySpec.MethodologySpecs = newSpec.MethodologySpecs;

    if (schema.title === "Online Self Completion") {
      // hijack for calc
      console.log("changed methodology");
      console.log(schema, schemaIndex, formData);
      let wavespecs = [...waveSpecs];
      wavespecs = calcAll(
        currentProject,
        currentCostingProfile,
        countrySpecs,
        wavespecs,
        rateCards
      );
      dispatch(waveSpecsActions.setWaveSpecs(wavespecs));
    }

    //updating in country specs
    props.setCountrySpecs(countrySpecs);

    props.updateCountrySpec(newSpec);
  };
  const onOptionLabelChange = (value, key, schema) => {
    let currentMethodology = _.head(
      props.currentCountrySpec.MethodologySpecs.filter(
        (meth) => meth.RFQSchema.title == schema.title
      )
    );
    if (value && Array.isArray(value))
      onChangeHandler({
        formData: {
          ...currentMethodology.RFQData,
          [key]: value.map((val) => val.value),
        },
        schema,
      });
    else
      onChangeHandler({
        formData: { ...currentMethodology.RFQData, [key]: value.value },
        schema,
      });
  };
  const applyToAllForms = (schemaTitle) => {
    let currentCountry = { ...props.currentCountrySpec };
    let existedFormSchema = _.head(
      currentCountry.MethodologySpecs.filter(
        (ms) => ms.RFQSchema.title == schemaTitle
      )
    );
    let remainingSchemas = currentCountry.MethodologySpecs.filter(
      (ms) => ms.RFQSchema.title != schemaTitle && !ms.NotApplicable
    );
    if (
      existedFormSchema &&
      existedFormSchema.RFQData &&
      remainingSchemas.length
    ) {
      Object.keys(existedFormSchema.RFQData).map((existedSchema) => {
        remainingSchemas.map((sch) => {
          if (
            sch.RFQSchema.properties &&
            sch.RFQSchema.properties[existedSchema]
          ) {
            if (!sch.RFQData) sch.RFQData = {};
            if (existedFormSchema.RFQData[existedSchema])
              sch.RFQData[existedSchema] =
                existedFormSchema.RFQData[existedSchema];
          }
        });
      });
    }
    props.updateCountrySpec(currentCountry);
    setApplyModal(false);
  };
  const selectorHandler = (item) => {
    // short circuits if clicked item is current item
    if (item.id === props.currentCountrySpec.id) return;

    const itemIndex = props.countrySpecs.findIndex(
      (record) => record.id === props.currentCountrySpec.id
    );
    const newArr = update(props.countrySpecs, {
      [itemIndex]: { $set: props.currentCountrySpec },
    });

    props.selectCountrySpec(item);
    props.setCountrySpecs(newArr);
  };
  const applyAllCountry = () => {
    // let newArr = [];
    let countrySpecs = [];
    props.countrySpecs.map((cs) => {
      countrySpecs.push(cs);
    });
    countrySpecs.map((cs) => {
      if (cs.CountryCode != props.currentCountrySpec.CountryCode) {
        props.currentCountrySpec.MethodologySpecs.map((meth) => {
          cs.MethodologySpecs.map((met) => {
            if (met.RFQSchema.title == meth.RFQSchema.title) {
              met.NotApplicable = meth.NotApplicable;
              met.RFQData = meth.RFQData;
            }
          });
        });
      }
    });
    let wavespecs = calcAll(
      currentProject,
      currentCostingProfile,
      countrySpecs,
      waveSpecs,
      rateCards
    );
    props.setWaveSpecs(wavespecs);
    props.setCountrySpecs(countrySpecs);
    props.updateProfile({ CountrySpecs: countrySpecs, WaveSpecs: wavespecs });
  };

  const renderSelector = () => {
    if (
      !props.countrySpecs ||
      (props.countrySpecs && props.countrySpecs.length === 1)
    )
      return null;
    return (
      <Col lg="2" md="2" sm="12" xs="12">
        <Selector
          heading={"Fielding Countries"}
          records={props.countrySpecs}
          applyAll={applyAllCountry}
          clicked={selectorHandler}
          displayField={"CountryCode"}
          labelGroup={"FieldingCountriesOptions"}
          selected={props.currentCountrySpec}
        />
      </Col>
    );
  };

  const onMethodologyChange = (eve, schema) => {
    let currentCountrySpec = {
      ...props.currentCountrySpec,
    };
    let currentMethodology = _.head(
      currentCountrySpec.MethodologySpecs?.filter(
        (mt) => mt.RFQSchema.title == schema.title
      )
    );

    currentMethodology.NotApplicable = eve.target.checked;

    if (eve.target.checked) currentMethodology.RFQData = null;
    let countrySpecs = [...props.countrySpecs];
    let presentCountrySpec = _.head(
      countrySpecs.filter(
        (ct) => ct.CountryCode == props.currentCountrySpec.CountryCode
      )
    );
    presentCountrySpec.MethodologySpecs.map((meth) => {
      if (meth.RFQSchema.title == schema.title)
        meth = { ...currentMethodology };
    });
    //updating in country specs
    props.setCountrySpecs(countrySpecs);

    props.updateCountrySpec(currentCountrySpec);
  };

  const getSelectedOption = (options, optionalLabel) => {
    if (
      props.codeLabels &&
      optionalLabel &&
      props.codeLabels[optionalLabel] &&
      options
    ) {
      if (Array.isArray(options)) {
        return props.codeLabels[optionalLabel]
          .filter((cl) => options.indexOf(cl.Code) != -1)
          ?.map((opt) => {
            return { value: opt.Code, label: opt.Label };
          });
      } else {
        let selectedVal = _.head(
          props.codeLabels[optionalLabel].filter((cl) => cl.Code == options)
        );
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
  if (props.countrySpec && !props.countrySpec.data) return null;
  return (
    <>
      {/* <Card>
        <CardBody> */}
      {/* <Row>
            <CardBody>
              <div>
                <h3 style={{ display: "inline-block" }}>Costing Profile #2</h3>
                <div style={{ display: "inline-block" }}>
                  <Input placeholder="Enter Costing Profile Name..."></Input>
                </div>
                <div style={{ display: "inline-block" }}>
                  <div className="mb-2">
                    <FontAwesomeIcon
                      className="align-middle mr-2"
                      icon={faFileUpload}
                      fixedWidth
                    />
                  </div>
                  <Col>
                    <Button>Send Request</Button>
                    <Button>External Costs</Button>
                  </Col>
                </div>
              </div>
            </CardBody>
          </Row> */}
      <Row>
        <Container fluid>
          <Row>
            {renderSelector()}
            <Col>
              {schemas?.map((schema) => {
                let uiSchema = {};
                let schemaTwoProperties = schema.properties;
                if (schemaTwoProperties) {
                  Object.keys(schemaTwoProperties).map((sch) => {
                    let currentProperty = schemaTwoProperties[sch];

                    uiSchema[sch] =
                      currentProperty.widgetType == "multiselectdropdown"
                        ? {
                            "ui:widget": (properties) => {
                              return (
                                <>
                                  <Label className="form-label h5">
                                    {currentProperty.title}
                                    <span>*</span>
                                  </Label>
                                  <Select
                                    className="custom-select-box"
                                    isMulti={currentProperty.isMulti}
                                    options={
                                      currentProperty.optionsLabel
                                        ? props.codeLabels[
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
                                      _.head(
                                        props.currentCountrySpec.MethodologySpecs.filter(
                                          (item) =>
                                            item.RFQSchema.title == schema.title
                                        )
                                      ).RFQData
                                        ? getSelectedOption(
                                            _.head(
                                              props.currentCountrySpec.MethodologySpecs.filter(
                                                (item) =>
                                                  item.RFQSchema.title ==
                                                  schema.title
                                              )
                                            ).RFQData[sch],
                                            currentProperty.optionsLabel
                                          )
                                        : []
                                    }
                                    onChange={(select) =>
                                      onOptionLabelChange(select, sch, schema)
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
                uiSchema["ui:order"] = schema.order;

                return (
                  <Card>
                    <CardHeader
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
                          {schema.title ? (
                            <h4 className="mb-0">
                              {schema.title} -{" "}
                              {getLabel(
                                "FieldingCountriesOptions",
                                props.currentCountrySpec.CountryCode
                              )}
                              {schemas.length > 1 && !schema.NotApplicable ? (
                                <Button
                                  //className="btn btn-primary btn-sm m-2"
                                  size="sm"
                                  className="ml-2"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentSchemaTitle(schema.title);
                                    setApplyModal(true);
                                    // applyToAllForms(schema.title);
                                  }}
                                >
                                  Copy to all forms
                                </Button>
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
                              {
                                <CardText className="error">
                                  {schema.invalidProps?.length
                                    ? "Please review your form inputs."
                                    : null}
                                </CardText>
                              }
                            </h4>
                          ) : (
                            //TODO: show methodologyspec label below. Also this message should be based on methodologyspec.RFQSchemaNA
                            <h4 className="mb-0">
                              {schema.Label} -{" "}
                              {getLabel(
                                "FieldingCountriesOptions",
                                props.currentCountrySpec.CountryCode
                              )}
                            </h4>
                          )}
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
                    </CardHeader>

                    <Collapse isOpen={props.methodologyToggles[schema.title]}>
                      <CardBody
                        className={`mb-0 ${schema.title ? " p-0" : ""}`}
                      >
                        {schema.RFQSchemaNA ? (
                          //TODO: use methodologyspec.RFQSchemaNA for this logic.
                          <Row>
                            <Col>
                              <Container className="justify-content-center">
                                <CardText>
                                  <FontAwesomeIcon
                                    className="mr-2"
                                    size="lg"
                                    icon={faExclamationCircle}
                                    fixedWidth
                                  />
                                  No built-in forms are available for this
                                  methodology.
                                </CardText>
                                <hr />

                                <CardText className="small">
                                  If you believe this is an error, please
                                  contact your Local Market Administrator.
                                </CardText>
                                <CardText className="small">
                                  {schema.RFQSchemaAlternative?.indexOf(
                                    "http"
                                  ) != -1 ? (
                                    <a
                                      href={schema.RFQSchemaAlternative}
                                      target="_blank"
                                    >
                                      {schema.RFQSchemaAlternative}
                                    </a>
                                  ) : (
                                    schema.RFQSchemaAlternative
                                  )}
                                </CardText>
                              </Container>
                            </Col>
                          </Row>
                        ) : props.currentCountrySpec.CountryCode &&
                          !schema.NotApplicable &&
                          schema.properties ? (
                          <Form
                            schema={schema}
                            formData={
                              props.currentCountrySpec.MethodologySpecs.find(
                                (item) => {
                                  if (item["RFQSchema"])
                                    return (
                                      item["RFQSchema"]["title"] ===
                                      schema.title
                                    );
                                }
                              ).RFQData || {}
                            }
                            uiSchema={uiSchema}
                            idPrefix={`${schema.title
                              ?.replace(/ /g, "_")
                              .replace(/\(/g, "_")
                              .replace(/\)/g, "_")
                              .replace(/./g, "_")
                              .replace(/,/g, "_")}`}
                            onChange={onChangeHandler}
                            ObjectFieldTemplate={ObjectFieldTemplate}
                            className={`${schema.title?.replace(
                              / /g,
                              "_"
                            )}_form methodology_form col-12 mb-0`}
                            showErrorList={false}
                            key={`${props.currentCountrySpec.CountryCode} ${schema.title}`}
                          >
                            <React.Fragment />
                          </Form>
                        ) : null}
                      </CardBody>
                    </Collapse>
                  </Card>
                );
              })}
            </Col>
          </Row>

          <Modal isOpen={applyModal} className="modal-sm">
            <ModalHeader>
              <h4>Warning!</h4>
            </ModalHeader>
            <ModalBody>
              <p>
                This action will overwrite all data already provided in the
                other methodology forms for this country only.
              </p>
              <p>
                <h5>
                  Are you sure to apply {currentSchemaTitle} form data to all
                  remaining methodology forms for{" "}
                  {getLabel(
                    "FieldingCountriesOptions",
                    props.currentCountrySpec.CountryCode
                  )}
                  ?
                </h5>
              </p>
            </ModalBody>
            <ModalFooter>
              <div className="d-flex justify-content-end">
                <Button
                  className="mr-2"
                  color="secondary"
                  onClick={() => setApplyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onClick={() => applyToAllForms(currentSchemaTitle)}
                >
                  Confirm
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        </Container>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    countrySpecs: state.countrySpecs,
    currentCountrySpec: state.currentCountrySpec,
    codeLabels: state.codeLabels,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectCountrySpec: (countrySpec) =>
      dispatch(currentCountryActions.selectCountrySpec(countrySpec)),
    updateCountrySpec: (countrySpec) =>
      dispatch(currentCountryActions.updateCountrySpec(countrySpec)),
    setCountrySpecs: (countrySpecs) =>
      dispatch(countryActions.setCountrySpecs(countrySpecs)),
    updateProfile: (profile) =>
      dispatch(currentCostingActions.updateProfile(profile)),
    setWaveSpecs: (wavespecs) =>
      dispatch(waveSpecsActions.setWaveSpecs(wavespecs)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Methodologies);

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Col, Container, Row, Table, Label, Tooltip } from "reactstrap";
import Select from "react-select";
import _ from "lodash";
import * as commercialTimeSchema from "./commercialTimeSchema.json";
import update from "immutability-helper";
import Selector from "../../components/Selector/Selector";
import { toastr } from "react-redux-toastr";

import * as waveSpecsActions from "../../redux/actions/waveSpecsActions";
import * as currentWaveSpecActions from "../../redux/actions/currentWaveSpecActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { calcAll } from "../../utils/calculations";
import axios from "../../axios-interceptor";
import { updateProfile } from "../../redux/actions/currentCostingActions";

const CommercialHours = (props) => {
  const dispatch = useDispatch();
  const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
  const currentWaveSpec = useSelector(({ currentWaveSpec }) => currentWaveSpec);
  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  const [commercialTooltips, setCommercialTooltips] = useState({});
  const [schema, setSchema] = useState({});
  const [finalObjectRef, setFinalObjectRef] = useState({});
  const [clientServiceCards, setClientServiceCards] = useState();
  const [clientRatesCalled, setClientRatesCalled] = useState(false);
  const [calledCurrencies, setCalledCurrencies] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState();
  // const [currencies, setCurrencies] = useState([])

  const currentProject = useSelector(
    ({ currentProject }) => currentProject.newProject
  );
  const currencies = useSelector(({ currentCosting }) =>
    currentCosting.currentCostingProfile.ProfileSetting &&
    currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
      ? currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
      : []
  );

  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  // const schema = currentCostingProfile.ProfileSetting.CommercialHoursSchema;
  const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
  const rateCards = useSelector(({ rateCards }) => rateCards);
  useEffect(() => {
    if (
      (!currencies || !currencies.length) &&
      currentCostingProfile &&
      currentCostingProfile.ProfileSetting &&
      currentCostingProfile.ProfileSetting.CurrenciesData
    ) {
      // if (!calledCurrencies && !currentCostingProfile.ProfileSetting.CurrenciesData) {
      // setCalledCurrencies(true);
      // dispatch(
      // setCurrencies(currentCostingProfile.ProfileSetting.CurrenciesData)
      // );
    }
  }, [currentCostingProfile]);
  useEffect(() => {
    if (
      schema &&
      !Object.keys(schema).length &&
      currentCostingProfile &&
      currentCostingProfile.ProfileSetting
    )
      setSchema(currentCostingProfile.ProfileSetting.CommercialHoursSchema);
  }, [currentCostingProfile]);

  useEffect(() => {
    if (
      currencies &&
      !currentCurrency &&
      currentCostingProfile.CostInputCurrency
    ) {
      let values = currentCostingProfile.CostInputCurrency.split("-");
      let currencyUnit = _.last(values);
      let countryCode = _.head(values);
      let finalCurrency = _.head(
        currencies.filter(
          (cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
        )
      );
      setCurrentCurrency(finalCurrency);
    }
  }, [currentCostingProfile, currencies]);
  useEffect(() => {
    if (schema) {
      setFinalObjectRef({
        "Executive Director": "ExecutiveDirector",
        Director: "Director",
        "Associate Director": "AssociateDirector",
        "Senior Manager": "SeniorManager",
        Manager: "Manager",
        "Senior Executive": "SeniorExecutive",
        Executive: "Executive",
        "Data Science": "DatascienceInternalComm",
      });
    }
  }, [schema]);

  useEffect(() => {
    if (
      !clientServiceCards &&
      currentProject &&
      currentProject.BusinessUnitId &&
      !clientRatesCalled &&
      currencies.length
    ) {
      setClientRatesCalled(true);
      axios
        .get(
          `marketsettings/${currentProject.BusinessUnitId}/clientservicerates/all`
        )
        .then((response) => {
          setClientServiceCards(response.data.CSRatecards);
          let defaultCard = _.head(
            response.data.CSRatecards.filter((cs) => cs.IsDefault)
          );
          if (defaultCard && defaultCard.id) {
            let currentprofile = {
              ...currentCostingProfile,
              ProfileSetting: { ...currentCostingProfile.ProfileSetting },
            };
            currentprofile.ProfileSetting = {
              ...currentprofile.ProfileSetting,
              CSRateCardUsed: { ...defaultCard },
            };
            dispatch(updateProfile(currentprofile));
          }
        })
        .catch((error) => {
          toastr.error("Error while retrieving rates", error.data.error);
        });
    }
  }, [currentCostingProfile, currencies]);
  // console.log("commercial time schema");
  // console.log(schema);
  // console.log(Object.keys(schema.properties));
  const bands = schema?.bands;

  const selectorHandler = (item) => {
    console.log("selector handler clicked");
    // do nothing if clicked item is current item
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
    let finalObject = {};
    Object.keys(currentWaveSpec.CommercialHoursData).map((ctd) => {
      finalObject[ctd] = { ...currentWaveSpec.CommercialHoursData[ctd] };
    });
    wavespecs.map((ws) => {
      if (ws.id != currentWaveSpec.id)
        ws.CommercialHoursData = { ...finalObject };
    });
    wavespecs = calcAll(
      currentProject,
      currentCostingProfile,
      countrySpecs,
      wavespecs,
      rateCards
    );
    dispatch(waveSpecsActions.setWaveSpecs(wavespecs));
    dispatch(updateProfile({ WaveSpecs: wavespecs }));
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

  const onChangeHandler = (band, field, value) => {
    console.log("on change");
    let newCommercialHoursData = {
      ...currentWaveSpec.CommercialHoursData,
    };

    newCommercialHoursData[band] = newCommercialHoursData[band] || {};
    newCommercialHoursData[band][field] = Number(value) || 0;

    bands?.forEach((band) => {
      newCommercialHoursData[band] = newCommercialHoursData[band] || {};
      let total = 0;
      Object.keys(newCommercialHoursData[band]).forEach((key) => {
        if (key !== "Total") {
          total += Number(newCommercialHoursData[band][key]);
        }
      });
      newCommercialHoursData[band]["Total"] = total;
    });

    let currentwavespec = update(currentWaveSpec, {
      CommercialHoursData: { $set: newCommercialHoursData },
    });

    let wavespecs = [...waveSpecs];
    wavespecs = wavespecs.map((ws) => {
      if (ws.id == currentwavespec.id) return { ...currentwavespec };
      else return { ...ws };
    });

    wavespecs = calcAll(
      currentProject,
      currentCostingProfile,
      countrySpecs,
      wavespecs,
      rateCards
    );

    dispatch(waveSpecsActions.setWaveSpecs(wavespecs));

    dispatch(currentWaveSpecActions.updateCurrentWaveSpec(currentwavespec));
  };
  const commercialFields = {
    "Associate Director": "CostIntCommAssociateDirector",
    "Data Science": "CostIntCommDataScience",
    Director: "CostIntCommDirector",
    "Executive Director": "CostIntCommExecDirector",
    Executive: "CostIntCommExecutive",
    Manager: "CostIntCommManager",
    "Senior Executive": "CostIntCommSeniorExecutive",
    "Senior Manager": "CostIntCommSeniorManager",
  };

  const rateCardReferences = {
    "Executive Director": "ExecutiveDirector",
    Director: "Director",
    "Associate Director": "AssociateDirector",
    "Senior Manager": "SeniorManager",
    Manager: "Manager",
    "Senior Executive": "SeniorExecutive",
    Executive: "Executive",
    "Data Science": "DatascienceInternalComm",
  };
  const CommFieldOnBlur = () => {
    let wavespecs = [...waveSpecs];
    let CSRateCardUsed = {};
    if (
      currentCostingProfile.ProfileSetting &&
      currentCostingProfile.ProfileSetting.CSRateCardUsed
    ) {
      CSRateCardUsed = currentCostingProfile.ProfileSetting.CSRateCardUsed;
    }
    // currentCostingProfile.WaveSpecs = [...newWaveSpecs]
    Object.keys(commercialFields).map((cf) => {
      wavespecs = wavespecs.map((ws) => {
        ws[commercialFields[cf]] =
          ws.CommercialHoursData && ws.CommercialHoursData[cf]
            ? ws.CommercialHoursData[cf]["Total"] *
              CSRateCardUsed[rateCardReferences[cf]]
            : 0;
        return { ...ws };
      });
    });
    let currentwavespec = _.head(
      wavespecs.filter((ws) => ws.id == currentWaveSpec.id)
    );

    dispatch(waveSpecsActions.setWaveSpecs(wavespecs));

    dispatch(currentWaveSpecActions.updateCurrentWaveSpec(currentwavespec));
  };
  const CSRateChanged = (eve) => {
    let currentprofile = {
      ...currentCostingProfile,
      ProfileSetting: { ...currentCostingProfile.ProfileSetting },
    };
    if (eve.target.value) {
      let finalRateCard = _.head(
        clientServiceCards.filter((csc) => csc.id == eve.target.value)
      );
      currentprofile.ProfileSetting = {
        ...currentprofile.ProfileSetting,
        CSRateCardUsed: { ...finalRateCard },
      };
    } else {
      currentprofile.ProfileSetting = {
        ...currentprofile.ProfileSetting,
        CSRateCardUsed: null,
      };
    }
    dispatch(updateProfile(currentprofile));
  };
  const getCurrentCurrency = (actualvalue) => {
    if (
      currencies &&
      currentCurrency &&
      currentCurrency.ConversionRateToLocal
    ) {
      if (actualvalue) {
        let finalVal = _.round(
          actualvalue * currentCurrency.ConversionRateToLocal,
          2
        );
        return `${finalVal} ${currentCurrency.CurrencyUnit}`;
      } else return `0 ${currentCurrency.CurrencyUnit}`;
    }
  };
  return (
    <>
      <Container fluid>
        <Row>
          {renderSelector()}
          <Col>
            <div className="ml-auto mb-2">
              <Row>
                <Col lg-1 md-1 xs-12>
                  <Label className="h5">Rate card in use:</Label>
                </Col>
                <Col lg-7 m-17 xs-12>
                  <select
                    className="form-control"
                    onChange={(eve) => CSRateChanged(eve)}
                    value={
                      currentCostingProfile.ProfileSetting &&
                      currentCostingProfile.ProfileSetting.CSRateCardUsed
                        ? currentCostingProfile.ProfileSetting.CSRateCardUsed.id
                        : null
                    }
                  >
                    <option value={0}>Select Rate card</option>
                    {clientServiceCards?.map((csc) => (
                      <option value={csc.id}>{csc.ProfileName}</option>
                    ))}
                  </select>
                  {/* <Input
                    type="select"
                    id="CSRateCardSelector"
                    name="CSRateCardSelector"
                  >
                    <option value="">Please select an option</option>
                    <option value="default">Default</option>
                  </Input> */}
                </Col>
              </Row>
            </div>
            <div className="d-flex">
              <Table responsive hover striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Hourly Chargeout Rate</th>
                    {bands && currencies && currentCurrency
                      ? bands.map((band) => (
                          <td>
                            {currentCostingProfile.ProfileSetting.CSRateCardUsed
                              ? getCurrentCurrency(
                                  currentCostingProfile.ProfileSetting
                                    .CSRateCardUsed[finalObjectRef[band]]
                                )
                              : getCurrentCurrency()}
                          </td>
                        ))
                      : null}
                  </tr>
                  <tr>
                    <th>Stages</th>
                    {bands?.map((band) => (
                      <th>{band}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schema && schema.properties
                    ? Object.keys(schema.properties).map((field) => {
                        // console.log("field");
                        // console.log(field);
                        return (
                          <tr>
                            <td>
                              <span id={field}>
                                {schema.properties[field].title}
                              </span>
                            </td>
                            <Tooltip
                              placement="top"
                              isOpen={
                                commercialTooltips[field] &&
                                schema.properties[field].description
                              }
                              target={field}
                              toggle={() =>
                                setCommercialTooltips({
                                  ...commercialTooltips,
                                  [field]: !commercialTooltips[field],
                                })
                              }
                            >
                              {schema.properties[field].description}
                            </Tooltip>
                            {bands?.map((band) => {
                              return (
                                <td>
                                  <Input
                                    id={`${band}-${field}`}
                                    type="number"
                                    value={
                                      currentWaveSpec.CommercialHoursData &&
                                      currentWaveSpec.CommercialHoursData[band]
                                        ? currentWaveSpec.CommercialHoursData[
                                            band
                                          ][field] || ""
                                        : ""
                                    }
                                    onChange={(e) =>
                                      onChangeHandler(
                                        band,
                                        field,
                                        e.target.value
                                      )
                                    }
                                    onBlur={CommFieldOnBlur}
                                    min={0}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    : null}
                </tbody>
                <tfoot style={{ borderTop: "2px solid #dee2e6" }}>
                  <tr>
                    <th>Band Totals</th>
                    {bands?.map((band) => {
                      return (
                        <td>
                          {currentWaveSpec.CommercialHoursData &&
                          currentWaveSpec.CommercialHoursData[band]
                            ? currentWaveSpec.CommercialHoursData[band][
                                "Total"
                              ] ?? 0
                            : 0}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <th>Total Wave Hours</th>
                    <td>
                      {currentWaveSpec.CommercialHoursData
                        ? _.sum(
                            Object.keys(
                              currentWaveSpec.CommercialHoursData
                            ).map((band) => {
                              return currentWaveSpec.CommercialHoursData[band]
                                .Total;
                            })
                          )
                        : 0}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default React.memo(CommercialHours);

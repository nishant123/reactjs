import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from "reactstrap";
import { toastr } from "react-redux-toastr";
import _ from "lodash";
import axios from "../../axios-interceptor";
import {
  saveCostingProfile,
  syncSheetData,
  updateProfile,
} from "../../redux/actions/currentCostingActions";
import { getLabel } from "../../utils/codeLabels";
import {
  pageLoadEnd,
  pageLoadStart,
  setCostingStatus,
} from "../../redux/actions/appActions";

const GlobalCostingSheet = ({ setShowSheetsCosts }) => {
  const dispatch = useDispatch();
  const [currentConversionRate, setCurrentConversionRate] = useState(1)
  const [currentCurrencyUnit, setCurrentCurrencyUnit] = useState("USD")

  const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
  const currentCostingProfile = useSelector(
    ({ currentCosting }) => currentCosting.currentCostingProfile
  );
  const GlobalCostingSheetCostsSchema = useSelector(
    ({ currentCosting }) =>
      currentCosting.currentCostingProfile?.ProfileSetting
        ?.GlobalCostingSheetCostsSchema
  );
  const GlobalCostingSheetTimingsSchema = useSelector(
    ({ currentCosting }) =>
      currentCosting.currentCostingProfile?.ProfileSetting
        ?.GlobalCostingSheetTimingsSchema
  );
  const costingStatus = useSelector(({ app }) => app.costingStatus);

  // const [syncDisbled, setSyncAbility] = useState(true)
  useEffect(() => {
    if (currentCostingProfile && currentCostingProfile.ProfileSetting
      && currentCostingProfile.ProfileSetting.CurrenciesData) {
      let cvalues = currentCostingProfile?.CostInputCurrency?.split("-");
      let currencyUnit = _.last(cvalues);
      let countryCode = _.head(cvalues);
      let conversionUnit = _.head(
        currentCostingProfile?.ProfileSetting?.CurrenciesData?.filter(
          (cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
        )
      )?.ConversionRateToLocal;
      setCurrentConversionRate(conversionUnit)
      setCurrentCurrencyUnit(currencyUnit)
    }
  }, [currentCostingProfile])
  const openSheet = () => {
    if (!currentCostingProfile.CostingsSheetId) {
      toastr.success("Costing Sheet is being created...");
      dispatch(pageLoadStart());
      axios
        .post("/utils/sheets/" + currentCostingProfile.id + "/costing")
        .then((res) => {
          dispatch(pageLoadEnd());
          dispatch(
            updateProfile({
              ...currentCostingProfile,
              CostingsSheetId: res.data.CostingsSheetId,
            })
          );
          dispatch(
            saveCostingProfile(
              {
                ...currentCostingProfile,
                CostingsSheetId: res.data.CostingsSheetId,
              },
              null,
              true
            )
          );
          toastr.success("Sheet created Successfully", res.data.message);
          window.open(
            `https://docs.google.com/spreadsheets/d/${res.data.CostingsSheetId}`,
            "_blank"
          );
        })
        .catch((err) => {
          dispatch(pageLoadEnd());
          // setSyncAbility(false)
          toastr.error("Creating Sheet Failed", err.data.message);
        });
    } else {
      window.open(
        `https://docs.google.com/spreadsheets/d/${currentCostingProfile.CostingsSheetId}`,
        "_blank"
      );
    }
  };
  return (
    <Card>
      <Row className="m-4">
        <div className="ml-auto">
          <Button
            className="mr-2"
            color="secondary"
            onClick={() =>
              dispatch(
                setCostingStatus({ ...costingStatus, showSheetsCosts: false })
              )
            }
          >
            Back
          </Button>

          <Button color="primary" onClick={openSheet}>
            Open Cost Sheet
          </Button>
          <Button
            color="primary"
            className="ml-2"
            disabled={
              !currentCostingProfile.CostingsSheetId ||
              currentCostingProfile.ProfileStatus > 5
            }
            onClick={() => dispatch(syncSheetData(currentCostingProfile))}
          >
            Sync Costs from sheet
          </Button>
        </div>
      </Row>
      <CardHeader>
        <h3>Sheets Costs Data</h3>
      </CardHeader>
      <CardBody>
        <Table>
          <tbody>
            {GlobalCostingSheetCostsSchema
              ? GlobalCostingSheetCostsSchema.map((gcsc) => {
                return (
                  <>
                    {Object.keys(gcsc.properties).filter(
                      (prp) =>
                        gcsc.properties[prp].isMultiCountry ==
                        currentCostingProfile.IsMultiCountry ||
                        gcsc.properties[prp].isMultiCountry == undefined
                    ).length ? (
                        <tr>
                          <td>
                            <h4>{gcsc.title}</h4>
                          </td>
                          {countrySpecs.map((cs) => (
                            <th>
                              {getLabel(
                                "FieldingCountriesOptions",
                                cs.CountryCode
                              )}
                            </th>
                          ))}
                        </tr>
                      ) : null}
                    {Object.keys(gcsc.properties).map((prp) => {
                      if (
                        gcsc.properties[prp].isMultiCountry ==
                        currentCostingProfile.IsMultiCountry ||
                        gcsc.properties[prp].isMultiCountry == undefined
                      ) {
                        return (
                          gcsc.properties[prp]?.title ? <tr>
                            <td>
                              <strong>{gcsc.properties[prp].title}</strong>
                            </td>
                            {countrySpecs.map((cs) => {
                              return (
                                <td>
                                  {(cs.SheetsCostsData && cs.SheetsCostsData[prp])
                                    ? `${cs.SheetsCostsData[prp] * currentConversionRate} ${currentCurrencyUnit}`
                                    : `0.00 ${currentCurrencyUnit}`}
                                </td>
                              );
                            })}
                          </tr> : null
                        );
                      }
                    })}
                  </>
                );
              })
              : null}
          </tbody>
        </Table>
      </CardBody>
      <CardHeader>
        <h3>Sheets Timings Data</h3>
      </CardHeader>
      <CardBody>
        <Table>
          <tbody>
            {GlobalCostingSheetTimingsSchema
              ? GlobalCostingSheetTimingsSchema.map((gcsc) => {
                return (
                  <>
                    {Object.keys(gcsc.properties).filter(
                      (prp) =>
                        gcsc.properties[prp].isMultiCountry ==
                        currentCostingProfile.IsMultiCountry ||
                        gcsc.properties[prp].isMultiCountry == undefined
                    ).length ? (
                        <tr>
                          <td>
                            <h4>{gcsc.title}</h4>
                          </td>
                          {countrySpecs.map((cs) => (
                            <th>{cs.Label}</th>
                          ))}
                        </tr>
                      ) : null}
                    {Object.keys(gcsc.properties).map((prp) => {
                      if (
                        gcsc.properties[prp].isMultiCountry ==
                        currentCostingProfile.IsMultiCountry ||
                        gcsc.properties[prp].isMultiCountry == undefined
                      ) {
                        return (
                          <tr>
                            <td>{gcsc.properties[prp].title}</td>
                            {countrySpecs.map((cs) => {
                              return (
                                <td>
                                  {cs.SheetsTimingsData
                                    ? `${cs.SheetsTimingsData[prp]} Days`
                                    : "0 Days"}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      }
                    })}
                  </>
                );
              })
              : null}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};
export default GlobalCostingSheet;

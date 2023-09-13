import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Container,
    CustomInput,
    Row,
    Table,
} from "reactstrap";
import _ from "lodash";
import {
    setCurrentWaveSpec,
    setWaveSpecs,
} from "../../redux/actions/waveSpecsActions";
import { selectWaveSpec } from "../../redux/actions/currentWaveSpecActions";
import Selector from "../../components/Selector/Selector";

const CostBreakDown = () => {
    const dispatch = useDispatch();
    const currentProject = useSelector(
        ({ currentProject }) => currentProject.newProject
    );

    const currentCostingProfile = useSelector(
        ({ currentCosting }) => currentCosting.currentCostingProfile
    );
    const currencies = useSelector(({ currentCosting }) =>
        currentCosting.currentCostingProfile.ProfileSetting &&
            currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
            ? currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
            : []
    );
    const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
    const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);
    const currentWaveSpec = useSelector(({ currentWaveSpec }) => currentWaveSpec);
    const app = useSelector(({ app }) => app);


    const [currentCurrency, setCurrentCurrency] = useState();
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
    }, [currentCostingProfile]);
    // useEffect(() => {
    //     if (currentWaveSpec.id != currentWaveSpec.id)
    //         setcurrentWaveSpec({ ...currentWaveSpec })
    // }, [currentWaveSpec])
    const [overRideFields, setOverrideFields] = useState({
        OverrideOpsPMCost: {
            //rfq
            Internal: "CostIntOpsPM",
            External: "",
            Label: "Project Management (Ops Only)",
        },
        OverrideSurveyProgrammingCost: {
            decisiveField: "surveyProgrammingResource",
            Internal: "CostIntOpsSurveyProgramming",
            External: "CostExtOpsSurveyProgramming",
            Label: "Survey Programming",
        },
        OverrideDataProcessingCost: {
            decisiveField: "dataProcessingResource",
            Internal: "CostIntOpsDataProcessing",
            External: "CostExtOpsDataProcessing",
            Label: "Data Processing",
        },

        OverrideChartingCost: {
            decisiveField: "chartingResource",
            Internal: "CostIntOpsCharting",
            External: "CostExtOpsCharting",
            Label: "Charting",
        },
        OverrideCodingCost: {
            decisiveField: "verbatimCodingResource",
            Internal: "CostIntOpsVerbatimCoding",
            External: "CostExtOpsVerbatimCoding",
            Label: "Verbatim Coding",
        },
        OverrideDataEntryCost: {
            decisiveField: "dataEntryResource",
            Internal: "CostIntOpsDataEntry",
            External: "CostExtOpsDataEntry",
            Label: "Data Entry",
        },

        OverrideOnlineSampleCost: {
            //rfq
            Internal: "",
            External: "CostExtOpsOnlineSample",
            Label: "Online Sample",
        },

        OverrideAdditionalOperationsSupportCost: {
            //bool
            decisiveField: "additionalOperationsSupport",
            Internal: "CostIntOpsAdditionalOperationsSupport",
            External: "",
            Label: "Additional Operations Support (PM Rates)",
            isBool: true,
        },
        OverrideOtherDataPreparationCost: {
            //bool
            decisiveField: "otherDataPreparationAssistance",
            Internal: "CostIntOpsOtherDataPreparation",
            External: "",
            Label: "Other Data Preparation",
            isBool: true,
        },
        OverrideDataScienceCost: {
            //internal-operations//bool
            decisiveField: "dataScienceRequired",
            Internal: "CostIntOpsDataScience",
            External: "",
            Label: "Data Science (Ops Only)",
            isBool: true,
        },
        OverrideTextAnalyticsCost: {
            decisiveField: "textAnalytics", //bool
            Internal: "",
            External: "CostExtOpsTextAnalytics",
            Label: "Text Analytics",
            isBool: true,
        },

        OverrideHostingCost: {
            //rfq
            Internal: "",
            External: "CostExtOpsHosting",
            Label: "Online Hosting",
        },
    });

    const getDecisiveFieldValue = (orf) => {
        if (overRideFields[orf].decisiveField && !overRideFields[orf].isBool) {
            return currentWaveSpec.OpsResourcesData
                ? currentWaveSpec.OpsResourcesData[overRideFields[orf].decisiveField]
                : null;
        } else if (
            overRideFields[orf].decisiveField &&
            overRideFields[orf].isBool
        ) {
            if (
                currentWaveSpec.OpsResourcesData &&
                currentWaveSpec.OpsResourcesData[overRideFields[orf].decisiveField]
            ) {
                if (overRideFields[orf].Internal) return "Internal";
                else return "External";
            } else return null;
        } else {
            if (overRideFields[orf].Internal) return "Internal";
            else return "External";
        }
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
    const getCurrentCurrencyValue = (actualvalue) => {
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
                return finalVal;
            } else return 0;
        }
    };
    const renderSelector = () => {
        if (!waveSpecs || (waveSpecs && waveSpecs.length === 1)) return null;
        return (
            <Col lg="2" md="2" sm="12" xs="12">{console.log(currentCostingProfile)}
                <Selector
                    heading={"Waves"}
                    records={currentCostingProfile.WaveSpecs}
                    clicked={selectorHandler}
                    interPolField={["WaveNumber", "WaveName"]}
                    selected={currentWaveSpec}
                />
            </Col>
        );
    };
    const selectorHandler = (item) => {
        if (item.id === currentWaveSpec.id) return;
        let waveSpecsToSave = [...waveSpecs];
        waveSpecsToSave = waveSpecsToSave.map((wss) => {
            return { ...wss };
        });
        dispatch(setWaveSpecs(waveSpecsToSave));

        dispatch(selectWaveSpec(item));
    };

    return (

        <Row>
            <Container fluid>
                <Card className="p-4">
                    <Row>
                        {renderSelector()}
                        <Col>
                            <Table className="override-main-table">
                                {/* <Row className="h4 mb-5"> */}
                                <thead>
                                    <th>Costing Component</th>
                                    <th>Notes</th>
                                    <th>Amount</th>
                                </thead>
                                {/* </Row> */}
                                <tbody>
                                    {Object.keys(overRideFields).map((orf) => {
                                        return getDecisiveFieldValue(orf) ? (
                                            <tr>
                                                <td>
                                                    {overRideFields[orf].Label}
                                                    {currentWaveSpec.OpsResourcesData ? (
                                                        <span className="decisive-pop-value">
                                                            {getDecisiveFieldValue(orf)}
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td>
                                                    <textarea
                                                        className="override-notes form-control"
                                                        value={
                                                            currentWaveSpec.CostOverrideNotes &&
                                                                currentWaveSpec.CostOverrideNotes[orf]
                                                                ? currentWaveSpec.CostOverrideNotes[orf]
                                                                : ""
                                                        }
                                                        disabled
                                                        id={orf}

                                                    ></textarea>
                                                </td>
                                                <td>
                                                    <span>
                                                        {getCurrentCurrency(
                                                            currentWaveSpec[
                                                            overRideFields[orf][
                                                            getDecisiveFieldValue(orf)
                                                            ]
                                                            ]
                                                        )}
                                                    </span>

                                                </td>
                                            </tr>
                                        ) : null;
                                    })}
                                    <tr>
                                        <td>Other Notes</td>
                                        <td colSpan="8">
                                            <textarea
                                                id="OtherNotes"
                                                value={
                                                    currentWaveSpec.CostOverrideNotes &&
                                                        currentWaveSpec.CostOverrideNotes["OtherNotes"]
                                                        ? currentWaveSpec.CostOverrideNotes["OtherNotes"]
                                                        : ""
                                                }
                                                disabled
                                                className="form-control other-notes-textarea"
                                            ></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                </Card>
            </Container>
        </Row>
    );
};
export default CostBreakDown;

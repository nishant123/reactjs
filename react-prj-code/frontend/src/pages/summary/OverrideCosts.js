import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import update from "immutability-helper";
import _ from "lodash";
import Selector from "../../components/Selector/Selector";
import Layout from "../../layouts/Project";
import {
	setCurrentWaveSpec,
	setWaveSpecs,
} from "../../redux/actions/waveSpecsActions";
import { selectWaveSpec } from "../../redux/actions/currentWaveSpecActions";
import { saveCostingProfile } from "../../redux/actions/currentCostingActions";
import Spinner from "../../components/Spinner";
import { getLabel } from "../../utils/codeLabels";

const OverrideCosts = () => {
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
	const [showManualCostEntry, setShowManualCostEntry] = useState(false);
	const [showSheetsCosts, setShowSheetsCosts] = useState(false);
	const [showCostMethod, setShowCostMethod] = useState(false);
	const [editableWaveSpec, setEditableWaveSpec] = useState({
		...currentWaveSpec,
	});
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
	//     if (currentWaveSpec.id != editableWaveSpec.id)
	//         setEditableWaveSpec({ ...currentWaveSpec })
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
	const onNotesHandler = (eve) => {
		let editablewavespec = { ...editableWaveSpec };
		if (!editablewavespec.CostOverrideNotes)
			editablewavespec.CostOverrideNotes = {};
		editablewavespec.CostOverrideNotes[eve.target.id] = eve.target.value;
		setEditableWaveSpec({
			...editablewavespec,
			CostOverrideNotes: { ...editablewavespec.CostOverrideNotes },
		});
	};
	const onOverrideCheckChange = (eve) => {
		let editablewavespec = { ...editableWaveSpec };
		editablewavespec[eve.target.id] = eve.target.checked;
		if (eve.target.checked) {
			//no action
		} else {
			let reqProp = overRideFields[eve.target.id];
			if (
				editablewavespec[reqProp.Internal] ==
				currentWaveSpec[reqProp.Internal] ||
				editablewavespec[reqProp.External] == currentWaveSpec[reqProp.External]
			) {
				editablewavespec[reqProp.Internal] = null;
				editablewavespec[reqProp.External] = null;
				if (editableWaveSpec.CostOverrideNotes)
					editableWaveSpec.CostOverrideNotes[eve.target.id] = null;
			} else {
				editablewavespec[reqProp.Internal] = currentWaveSpec[reqProp.Internal];
				editablewavespec[reqProp.External] = currentWaveSpec[reqProp.External];
			}
		}
		setEditableWaveSpec({ ...editablewavespec });
	};
	const submitCurrentWaveSpec = () => {
		let waveSpecsToSave = [...waveSpecs];
		let profileToSave = { ...currentCostingProfile };
		waveSpecsToSave = waveSpecsToSave.map((wss) => {
			if (wss.id == currentWaveSpec.id) {
				wss = { ...editableWaveSpec };
			}
			return wss;
		});
		dispatch(selectWaveSpec({ ...editableWaveSpec }));
		dispatch(setWaveSpecs(waveSpecsToSave));
		dispatch(
			saveCostingProfile({ ...profileToSave, WaveSpecs: waveSpecsToSave })
		);
	};
	const applyAllWaves = () => {
		let wavespecs = [...waveSpecs];
		wavespecs = wavespecs.map((ws) => {
			if (ws.id != editableWaveSpec.id) {
				//todo: copy data from currenctWave to All waves

				Object.keys(overRideFields).map((orf) => {
					ws[orf] = editableWaveSpec[orf];
					if (overRideFields[orf].Internal)
						ws[overRideFields[orf].Internal] =
							editableWaveSpec[overRideFields[orf].Internal];
					if (overRideFields[orf].External)
						ws[overRideFields[orf].External] =
							editableWaveSpec[overRideFields[orf].External];
				});
			}
			return { ...ws };
		});
		dispatch(setWaveSpecs(wavespecs));
	};

	const selectorHandler = (item) => {
		if (item.id === currentWaveSpec.id) return;
		let waveSpecsToSave = [...waveSpecs];
		waveSpecsToSave = waveSpecsToSave.map((wss) => {
			if (wss.id == currentWaveSpec.id) {
				wss = { ...editableWaveSpec };
			}
			return { ...wss };
		});
		dispatch(setWaveSpecs(waveSpecsToSave));

		// const itemIndex = waveSpecs.findIndex(
		//     (record) => record.id === currentWaveSpec.id
		// );
		// const newArr = update(waveSpecs, {
		//     [itemIndex]: { $set: currentWaveSpec },
		// });
		setEditableWaveSpec({ ...item });
		dispatch(selectWaveSpec(item));
		// dispatch(setWaveSpecs(newArr));
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
					// displayField={
					//     <>
					//         <FontAwesomeIcon
					//             size="xs"
					//             icon={faPen}
					//             className="pointer"
					//         />
					//     </>
					// }
					selected={currentWaveSpec}
				/>
			</Col>
		);
	};

	return (
		<Layout
			costMethod={currentCostingProfile.CostingType}
			setShowCostMethod={setShowCostMethod}
			showManualCostEntry={showManualCostEntry}
			setShowManualCostEntry={setShowManualCostEntry}
			showSheetsCosts={showSheetsCosts}
			setShowSheetsCosts={setShowSheetsCosts}
			profileStatusToDisplay={getLabel(
				"CostingStatusOptions",
				currentCostingProfile.ProfileStatus
			)}
			projectStatusToDisplay={getLabel(
				"ProjectStatusOptions",
				currentCostingProfile.Project?.ProjectStatus
			)}
		>
			<Row>
				<Container fluid>
					<Card className="p-4">
						<CardHeader>
							<h3>Override Auto Costs</h3>
						</CardHeader>
						<Row>
							{renderSelector()}
							<Col>
								<Table className="override-main-table">
									{/* <Row className="h4 mb-5"> */}
									<thead>
										<th>Costing Component</th>
										<th>Override Auto Calculations</th>
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
														{/* <input checked={editableWaveSpec[orf]} id={orf} onChange={onOverrideCheckChange} type="checkbox" /> */}
														<span className="d-flex">
															{" "}
															No{" "}
															<CustomInput
																type="switch"
																id={orf}
																name="customSwitch"
																// label="Tracking Project"
																className="h5 ml-2 pointer"
																checked={editableWaveSpec[orf]}
																onChange={onOverrideCheckChange}
															/>{" "}
															Yes
														</span>
													</td>
													<td>
														<textarea
															className="override-notes form-control"
															value={
																editableWaveSpec.CostOverrideNotes &&
																	editableWaveSpec.CostOverrideNotes[orf]
																	? editableWaveSpec.CostOverrideNotes[orf]
																	: ""
															}
															disabled={!editableWaveSpec[orf]}
															id={orf}
															onChange={onNotesHandler}
														></textarea>
													</td>
													<td>
														{editableWaveSpec[orf] ? (
															<div class="input-group">
																<input
																	className="form-control"
																	type="number"
																	min={0}
																	id={
																		overRideFields[orf][
																		getDecisiveFieldValue(orf)
																		]
																	}
																	step="any"
																	value={getCurrentCurrencyValue(
																		editableWaveSpec[
																		overRideFields[orf][
																		getDecisiveFieldValue(orf)
																		]
																		]
																	)}
																	onChange={(eve) => {
																		setEditableWaveSpec({
																			...editableWaveSpec,
																			[overRideFields[orf][
																				getDecisiveFieldValue(orf)
																			]]:
																				eve.target.value /
																				currentCurrency.ConversionRateToLocal,
																		});
																	}}
																/>
																<div class="input-group-append">
																	<span class="input-group-text text-sm">
																		{currentCurrency?.CurrencyUnit}
																	</span>
																</div>
															</div>
														) : (
																<span>
																	{getCurrentCurrency(
																		editableWaveSpec[
																		overRideFields[orf][
																		getDecisiveFieldValue(orf)
																		]
																		]
																	)}
																</span>
															)}
													</td>
												</tr>
											) : null;
										})}
									</tbody>
								</Table>

								<hr className="border"></hr>
								<Col>
									<Row>
										<strong>Other Notes</strong>
									</Row>
									<Row>
										<textarea
											id="OtherNotes"
											value={
												editableWaveSpec.CostOverrideNotes &&
													editableWaveSpec.CostOverrideNotes["OtherNotes"]
													? editableWaveSpec.CostOverrideNotes["OtherNotes"]
													: ""
											}
											onChange={onNotesHandler}
											className="form-control other-notes-textarea"
										></textarea>
									</Row>
								</Col>
							</Col>
						</Row>
						<Row className="justify-content-end mt-4">
							<Button
								onClick={submitCurrentWaveSpec}
								color="primary"
								disabled={app.recordloading}
							>
								Save
								{app.recordloading ? (
									<Spinner size="small" color="#495057" />
								) : null}
							</Button>
						</Row>
					</Card>
				</Container>
			</Row>
		</Layout>
	);
};
export default OverrideCosts;

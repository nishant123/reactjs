import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Button, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";

import Spinner from "../../components/Spinner";
import * as countryActions from "../../redux/actions/countrySpecsActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";

import { getLabel } from "../../utils/codeLabels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faPaste, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { setCurrentCostingProfiles } from "../../redux/actions/costingsActions";
import Select from "react-select";
import { pageLoadEnd, pageLoadStart, setCostingStatus } from "../../redux/actions/appActions";
import { toastr } from "react-redux-toastr";
import axios from "../../axios-interceptor";
import TimeEntry from "./TimeEntry";

const ManualCostEntry = ({ setShowManualCostEntry }) => {
	const dispatch = useDispatch();
	const countrySpecs = useSelector(({ countrySpecs }) => countrySpecs);
	const costingProfiles = useSelector(({ costings }) => costings.costingProfiles);
	const currentCosting = useSelector(({ currentCosting }) => currentCosting.currentCostingProfile);
	const app = useSelector(({ app }) => app);
	const costingStatus = useSelector(({ app }) => app.costingStatus);

	const [countryDetails, setCountryDetails] = useState({});
	const [isIndividualCosting, toggleIndividualCosting] = useState(false);
	const [currentCountry, setCurrentCountry] = useState({});
	const [individualCountry, updateIndividualCountry] = useState({});
	const [individualEntryError, setIndividualEntryError] = useState();
	const [currencyConversionRates, setCurrencyConversionRates] = useState({});
	const [countryBreakdownModal, setCountryBreakdownModal] = useState(false);
	const [currentClippedCountry, setCurrentClippedCountry] = useState();
	const [currentClippedRegion, setCurrentClippedRegion] = useState();
	const [calledCurrencies, setCalledCurrencies] = useState(false);
	const [resetCosts, openResetCosts] = useState(false);
	const [timeDataEntry, switchToTime] = useState(false);

	useEffect(() => {
		if (countrySpecs && countrySpecs.length && !Object.keys(countryDetails).length) {
			let countrydetails = {};
			countrySpecs.map((cs) => {
				countrydetails[cs.CountryCode] = {};
				cs.MethodologySpecs.map((ms) => {
					countrydetails[cs.CountryCode][ms.Code] = ms.CostsData;
				});
			});
			setCountryDetails(countrydetails);
		}
	}, [countrySpecs]);

	const currencies = useSelector(({ currentCosting }) =>
		currentCosting.currentCostingProfile.ProfileSetting && currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData ? currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData : []
	);
	const currentprofile = useSelector(({ currentCosting }) => currentCosting.currentCostingProfile);
	useEffect(() => {
		if (!currencies && !calledCurrencies && currentprofile && currentprofile.ProfileSetting && !currentprofile.ProfileSetting.CurrenciesData) {
			setCalledCurrencies(true);
			dispatch(currentCostingActions.setCurrencies(() => setCalledCurrencies(false)));
		}
	});
	const pasteClippedCountry = (country) => {
		let countryspecs = [...countrySpecs];
		let currentclipped = { ...currentClippedCountry };
		// if (currentClippedCountry) {
		countryspecs = countryspecs.map((cs) => {
			if (cs.id == country.id) {
				cs.CostInputCurrency = currentclipped.CostInputCurrency;
				cs.MethodologySpecs = cs.MethodologySpecs?.map((ms) => {
					let currentMeth = _.head(currentclipped.MethodologySpecs.filter((mspec) => mspec.Code == ms.Code));
					if (!currentMeth.CostsData) ms.CostsData = {};
					if (currentMeth.CostsData) ms.CostsData = { ...currentMeth.CostsData };
					if (countryDetails[currentclipped.CountryCode] && countryDetails[currentclipped.CountryCode][ms.Code])
						ms.CostsData = {
							...currentMeth.CostsData,
							...countryDetails[currentclipped.CountryCode][ms.Code],
						};

					if (!countryDetails[cs.CountryCode]) countryDetails[cs.CountryCode] = {};
					countryDetails[cs.CountryCode][ms.Code] = { ...ms.CostsData };

					return { ...ms };
				});
			}
			return { ...cs };
		});
		dispatch(countryActions.setCountrySpecs(countryspecs));
		// }
		setCurrentClippedCountry(null);
	};
	const pasteClippedRegion = (index) => {
		let indiviDet = { ...individualCountry };
		let requiredCodes = currentCountry.MethodologySpecs.map((ms) => ms.Code);
		Object.keys(indiviDet).map((idet) => {
			if (idet == currentCountry.CountryCode) {
				indiviDet[idet] = indiviDet[idet].map((ir, ind) => {
					if (ind == index) {
						ir = { ...currentClippedRegion };
						requiredCodes.map((rc) => {
							if (ir[rc]) {
								ir[rc] = { ...ir[rc], properties: { ...ir[rc].properties } };
							}
						});
					}
					return { ...ir };
				});
			}
		});
		setCurrentClippedRegion(null);
		updateIndividualCountry(indiviDet);
	};
	// useEffect(() => {
	//   if (currencyConversionRates)
	//     setCurrencyConversionRates(currencies?.map(cu => {
	//       currencyConversionRates[cu.CurrencyUnit] = cu.ConversionRateToLocal
	//     }))

	// }, [currencies])
	const validInputValue = (evnt) => {
		let charcode = evnt.charCode;

		//character codes to avoid other characters apart numbers and .
		if (charcode > 31 && (charcode < 48 || charcode > 57) && charcode != 46) {
			evnt.preventDefault();
		}
		// else if (charcode == 46) {
		//   if (evnt.target.value.indexOf(".") != -1) evnt.preventDefault();
		// }
	};

	const calcFormula = (countryspecs) => {
		// let costCalFormulas = _.head(_.head(countryspecs).MethodologySpecs).CalculationSchema;
		// let finalCostFields = [];

		let costingprofiles = costingProfiles;
		countryspecs.map((cs) => {
			// let currentCurrencyConversion = (!cs.CostInputCurrency || cs.CostInputCurrency == "USD")
			//   ? 1 : _.head(currencies.filter(c => c.CurrencyUnit == cs.CostInputCurrency)).ConversionRateToLocal

			cs.MethodologySpecs.map((ms) => {
				let costCalFormulas = ms.CalculationSchema;
				Object.keys(costCalFormulas).map((ccf) => {
					cs[ccf] = 0;
					Object.keys(costCalFormulas[ccf]).map((obj) => {
						cs[obj] = 0;
						cs.MethodologySpecs.map((mth) => {
							if (mth.CostsData) {
								cs[obj] =
									cs[obj] +
									_.sum(
										Object.keys(mth.CostsData)
											.filter((cdkey) => _.includes(costCalFormulas[ccf][obj], cdkey))
											.map((k) => {
												return mth.CostsData[k];
											})
									);
							}
						});
						cs[ccf] = cs[ccf] + cs[obj];
					});
				});

				// Object.keys(ms.CalculationSchema).map((csch) => {
				//   if (!_.includes(finalCostFields, csch)) {
				//     finalCostFields.push(csch);
				//   }
				//   Object.keys(ms.CalculationSchema[csch]).map((insch) => {
				//     if (!_.includes(finalCostFields, insch)) {
				//       finalCostFields.push(insch);
				//     }
				//   });
				// });
			});
		});
		// can fetch from currentCostingProfile in store?
		// let currentCostingProfile = _.head(
		//   costingprofiles.filter(
		//     (cp) => cp.id == _.head(countryspecs).CostingProfileId
		//   )
		// );

		// finalCostFields.map((ff) => {
		//   // if (!currentCostingProfile[ff])
		//   currentCostingProfile[ff] = 0;
		//   countrySpecs.map((cs) => {
		//     currentCostingProfile[ff] = currentCostingProfile[ff] + cs[ff];
		//   });
		// });

		let currentCostingProfile = { ...currentprofile };
		dispatch(setCurrentCostingProfiles([...costingprofiles]));
		dispatch(countryActions.setCountrySpecs([...countryspecs]));
		console.log(currentCostingProfile, "currentCostingProfile");
		let finalProfile = {
			...currentCostingProfile,
			CountrySpecs: countryspecs,
			WaveSpecs: currentCosting.WaveSpecs,
			CostingType: currentCosting.CostingType,
		};
		return finalProfile;
	};

	const updateCostEntryForm = (eve, methCode, country) => {
		let countryCode = country.CountryCode;
		let currentCurrencyConversion = !country.CostInputCurrency || country.CostInputCurrency == "US-USD" ? 1 : _.head(currencies.filter((c) => c.CurrencyUnit == _.last(country.CostInputCurrency.split("-")))).ConversionRateToLocal;
		// let currentCurrencyConversion = currencyConversionRates[country.CostInputCurrency ? country.CostInputCurrency : "USD"]
		let countryDet = { ...countryDetails };
		if (!countryDet[countryCode]) countryDet[countryCode] = {};
		else countryDet[countryCode] = { ...countryDet[countryCode] };

		if (!countryDet[countryCode][methCode]) countryDet[countryCode][methCode] = {};
		else
			countryDet[countryCode][methCode] = {
				...countryDet[countryCode][methCode],
			};

		countryDet[countryCode][methCode][eve.target.id] = eve.target.value / currentCurrencyConversion;
		setCountryDetails({ ...countryDet }); //todo: recheck needed or not?
	};
	const submitCostEntryForm = (isSubmit) => {
		let countryspecs = [...countrySpecs];
		countryspecs.map((country) => {
			country.MethodologySpecs.map((mth) => {
				if (countryDetails[country.CountryCode] && countryDetails[country.CountryCode][mth.Code]) {
					if (!mth.CostsData) mth.CostsData = {};
					mth.CostsData = {
						...mth.CostsData,
						...countryDetails[country.CountryCode][mth.Code],
					};
				}
			});
		});
		if (isSubmit) {
			const currentCostingProfile = calcFormula(countryspecs);
			dispatch(
				currentCostingActions.updateProfile({
					...currentCostingProfile,
					ProfileSetting: {
						...currentCostingProfile.ProfileSetting,
						CurrenciesData: currencies,
					},
					currencies,
				})
			);
			dispatch(
				currentCostingActions.saveCostingProfile({
					...currentCostingProfile,
					ProfileSetting: {
						...currentCostingProfile.ProfileSetting,
						CurrenciesData: currencies,
					},
					currencies,
				})
			);
		} else {
			return countryspecs;
		}
	};

	const calcFormulaOnChange = () => {
		let countryspecs = submitCostEntryForm();
		calcFormula(countryspecs);
	};
	const getDefaultCurrValue = (value, country) => {
		if (currencies) {
			// let currentCurrencyConversion = currencyConversionRates[country.CostInputCurrency ? country.CostInputCurrency : "USD"]
			let currentCurrencyConversion = !country.CostInputCurrency || country.CostInputCurrency == "US-USD" ? 1 : _.head(currencies.filter((c) => c.CurrencyUnit == _.last(country.CostInputCurrency.split("-")))).ConversionRateToLocal;
			return _.round(value * currentCurrencyConversion, 2);
		} else {
			return null;
		}
	};
	const openCountryBreakdownCaution = (country) => {
		setCurrentCountryDetails(country);
		if (country.MethodologySpecs.filter((met) => met.CountryCostBreakdown).length) {
			breakdownAccepted();
		} else {
			setCountryBreakdownModal(true);
		}
	};
	const breakdownAccepted = () => {
		submitCostEntryForm();
		toggleIndividualCosting(true);
		setCountryBreakdownModal(false);
	};
	const setCurrentCountryDetails = (country) => {
		country.MethodologySpecs.map((mth) => {
			if (mth.CountryCostBreakdown) {
				mth.CountryCostBreakdown.map((bd) => {
					if (!individualCountry[country.CountryCode]) individualCountry[country.CountryCode] = [];
					let existedBD = _.head(individualCountry[country.CountryCode].filter((cc) => cc.title == bd.title));
					if (!existedBD)
						individualCountry[country.CountryCode].push({
							title: bd.title,
							[mth.Code]: { properties: bd.properties },
						});
					else existedBD[mth.Code] = { properties: bd.properties };
				});
			}
		});
		if (!individualCountry[country.CountryCode]) {
			individualCountry[country.CountryCode] = [
				{
					title: "",
				},
			];
		}
		setCurrentCountry(country);
		// submitCostEntryForm();
		// toggleIndividualCosting(true);
	};

	const getFinalProperties = (properties) => {
		let finalProperties = [];
		if (currentCosting.IsMultiCountry) {
			// if (countrySpecs.length > 1) {
			Object.keys(properties).map((prop) => {
				if (properties[prop].isMultiCountry == true || properties[prop].isMultiCountry == undefined) {
					finalProperties.push(prop);
				}
			});
		} else {
			Object.keys(properties).map((prop) => {
				if (properties[prop].isMultiCountry == false || properties[prop].isMultiCountry == undefined) {
					finalProperties.push(prop);
				}
			});
		}

		return finalProperties;
	};
	const updateIndividualProperty = (eve, index, methCode, country) => {
		let countryCode = country.CountryCode;
		let currentCurrencyConversion = !country.CostInputCurrency || country.CostInputCurrency == "US-USD" ? 1 : _.head(currencies.filter((c) => c.CurrencyUnit == _.last(country.CostInputCurrency.split("-")))).ConversionRateToLocal;

		let indiviDet = { ...individualCountry };
		if (!indiviDet[countryCode][index][methCode]) {
			indiviDet[countryCode][index][methCode] = { properties: {} };
		}
		indiviDet[countryCode][index][methCode].properties[eve.target.id] = eve.target.value / currentCurrencyConversion;
		updateIndividualCountry(indiviDet);
	};
	const updateIndividualCountryTitle = (value, index) => {
		let indiviDet = { ...individualCountry };
		indiviDet[currentCountry.CountryCode][index].title = value;
		updateIndividualCountry(indiviDet);
	};
	const updateDataToCountry = () => {
		let countryspecs = [...countrySpecs];
		let individualcountry = { ...individualCountry };
		let updatableCountry = _.head(countryspecs.filter((cs) => cs.CountryCode == currentCountry.CountryCode));
		if (individualCountry[currentCountry.CountryCode].filter((inc) => !inc.title).length) {
			setIndividualEntryError("Please Provide Column Titles");
		} else {
			setIndividualEntryError("");
			updatableCountry.MethodologySpecs.map((mth) => {
				let reqProp = individualcountry[currentCountry.CountryCode].filter(
					(ic) =>
						Object.keys(ic)
							.filter((key) => key != "title")
							.indexOf(mth.Code.toString()) != -1
				);
				let finalProp = {};
				if (reqProp.length) {
					reqProp.map((prop) => {
						if (prop[mth.Code] && prop[mth.Code].properties) {
							Object.keys(prop[mth.Code].properties).map((intProp) => {
								if (!finalProp[intProp]) finalProp[intProp] = prop[mth.Code].properties[intProp];
								else finalProp[intProp] += prop[mth.Code].properties[intProp];
							});
						}
					});
				}

				individualcountry[currentCountry.CountryCode]?.map((ic) => {
					if (_.includes(Object.keys(ic), mth.Code)) {
						if (!mth.CountryBreakDown) mth.CountryBreakDown = [];
						let existedBD = mth.CountryBreakDown.filter((bd) => bd.title == ic.title);
						if (existedBD.length) {
							existedBD.properties = ic[mth.Code].properties;
						} else {
							mth.CountryBreakDown.push({
								title: ic.title,
								properties: ic[mth.Code].properties,
							});
						}
					}
				});

				individualcountry[currentCountry.CountryCode]?.map((ic) => {
					if (_.includes(Object.keys(ic), mth.Code)) {
						if (!mth.CountryCostBreakdown) mth.CountryCostBreakdown = [];
						let existedBD = mth.CountryCostBreakdown.filter((bd) => bd.title == ic.title);
						if (existedBD.length) {
							existedBD.properties = ic[mth.Code].properties;
						} else {
							mth.CountryCostBreakdown.push({
								title: ic.title,
								properties: ic[mth.Code].properties,
							});
						}
					}
				});

				mth.CountryCostBreakdown = mth.CountryCostBreakdown?.filter((bd) =>
					_.includes(
						individualcountry[currentCountry.CountryCode].map((ic) => ic.title),
						bd.title
					)
				);

				if (!countryDetails[currentCountry.CountryCode]) countryDetails[currentCountry.CountryCode] = {};
				if (!countryDetails[currentCountry.CountryCode][mth.Code]) countryDetails[currentCountry.CountryCode][mth.Code] = {};

				countryDetails[currentCountry.CountryCode][mth.Code] = Object.keys(finalProp).length ? finalProp : {};
				mth.CostsData = Object.keys(finalProp).length ? finalProp : null;
			});
			// }
			// })
			dispatch(countryActions.setCountrySpecs([...countryspecs]));
			calcFormula(countryspecs);
			toggleIndividualCosting(false);
		}
		// countryspecs.map(cs => {
		// if (cs.CountryCode == currentCountry.CountryCode) {
	};
	const addColumnForIndividual = () => {
		let indiviDet = { ...individualCountry };
		indiviDet[currentCountry.CountryCode].push({ title: "" });
		updateIndividualCountry(indiviDet);
	};
	const cancelIndividualCosting = () => {
		//clears the added inputs when cancel
		// let indiviDet = { ...individualCountry }
		// indiviDet[currentCountry.CountryCode] = [{
		//   title: ""
		// }]
		// updateIndividualCountry(indiviDet)
		toggleIndividualCosting(false);
	};
	const removeFromIndividual = (index) => {
		let indiviDet = { ...individualCountry };
		// let deletedValue = { ...indiviDet[currentCountry.CountryCode][index] }
		let finalArr = [];
		indiviDet[currentCountry.CountryCode].map((id, ind) => {
			if (ind != index) finalArr.push(id);
		});
		indiviDet[currentCountry.CountryCode] = finalArr;
		updateIndividualCountry(indiviDet);

		// let countryspecs = countrySpecs

		// countryspecs.map(cs => {
		//   if (cs.CountryCode == currentCountry.CountryCode) {
		//     cs.MethodologySpecs.map(meth => {
		//       meth.CountryCostBreakdown = meth.CountryCostBreakdown.filter(bd => bd.title != deletedValue.title)
		//     })
		//   }
		// })

		// dispatch(countryActions.setCountrySpecs([...countryspecs]));
	};
	const onCurrencyChange = (value, country) => {
		let countryspecs = [...countrySpecs];
		countryspecs.map((cs) => {
			if (cs.CountryCode == country.CountryCode) {
				let incomingCurrency = value;

				cs.MethodologySpecs.map((meth) => {
					if (!meth.CostsData) meth.CostsData = {};
					if (countryDetails[cs.CountryCode] && countryDetails[cs.CountryCode][meth.Code]) {
						Object.keys(countryDetails[cs.CountryCode][meth.Code]).map((mc) => {
							// countryDetails[cs.CountryCode][meth.Code][mc] = countryDetails[cs.CountryCode][meth.Code][mc]
							meth.CostsData[mc] = countryDetails[cs.CountryCode][meth.Code][mc];
						});
					}
					// else if (meth.CostsData) {
					meth.CostsData = { ...meth.CostsData };
					Object.keys(meth.CostsData)?.map((cd) => {
						if (countryDetails[cs.CountryCode] && countryDetails[cs.CountryCode][meth.Code]) {
							countryDetails[cs.CountryCode][meth.Code][cd] = meth.CostsData[cd];
						}
					});
					// }
				});

				if (incomingCurrency) cs.CostInputCurrency = incomingCurrency;
				else cs.CostInputCurrency = "US-USD";
				cs.MethodologySpecs = [...cs.MethodologySpecs];
				cs = { ...cs };
			}
		});

		dispatch(countryActions.setCountrySpecs([...countryspecs]));
	};

	const getDefaultCurrencySelection = (value) => {
		if (currencies) {
			if (!value) value = "US-USD";
			else if (value && value.value) value = value.value;
			let values = value.split("-");
			let currencyUnit = _.last(values);
			let countryCode = _.head(values);
			let finalValue = _.head(currencies.filter((cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit));
			if (finalValue)
				return {
					value: `${finalValue.Code}-${finalValue.CurrencyUnit}`,
					label: `${finalValue.Label} (1USD = ${finalValue.ConversionRateToLocal}${finalValue.CurrencyUnit})`,
				};
			else return "";
		} else return "";
	};
	const openSheet = () => {
		if (!currentprofile.CostingsSheetId) {
			toastr.success("Costing Sheet is being created...");
			dispatch(pageLoadStart());
			axios
				.post("/utils/sheets/" + currentprofile.id + "/costing")
				.then((res) => {
					dispatch(pageLoadEnd());
					dispatch(
						currentCostingActions.updateProfile({
							...currentprofile,
							CostingsSheetId: res.data.CostingsSheetId,
						})
					);
					dispatch(
						currentCostingActions.saveCostingProfile(
							{
								...currentprofile,
								CostingsSheetId: res.data.CostingsSheetId,
							},
							null,
							true
						)
					);
					toastr.success("Sheet created Successfully", res.data.message);
					window.open(`https://docs.google.com/spreadsheets/d/${res.data.CostingsSheetId}`, "_blank");
				})
				.catch((err) => {
					dispatch(pageLoadEnd());
					// setSyncAbility(false)
					toastr.error("Creating Sheet Failed", err?.data.message);
				});
		} else {
			window.open(`https://docs.google.com/spreadsheets/d/${currentprofile.CostingsSheetId}`, "_blank");
		}
	};
	return !isIndividualCosting ? (
		!timeDataEntry ? <Card className="rounded ext-costing">
			<CardHeader>
				<Row className="justify-content-between p-3">
					<h3>Cost Details</h3>
					<div>

						<Button className="mr-2" color="secondary"
							onClick={() => switchToTime(true)}
						>
							View/Edit Timings
					</Button>
						<Button
							onClick={() => {
								openResetCosts(true);
							}}
						>
							Reset Costing Type
					</Button>
					</div>
				</Row>
				<Row>
					<Col>{currentprofile.CostingType != "SHEETS" ? <h5>Please input cost for all waves combined if your project is a tracker.</h5> : null}</Col>
					<Col>
						<h5 className="float-right error">{currentprofile.CostingType != "SHEETS" ? "Reminder: Input amounts should be in currency indicated per cell." : "Manual cost entry is restricted as costing type is Sheets"}</h5>
					</Col>
				</Row>
				{currentprofile.isOldSheet ? (
					<Row className="m-0 mb-2 justify-content-end error">
						<strong>Please note: This profile is using an older version of the cost sheet. If this profile has multiple submethodologies, all costs will be combined under one submethodology.</strong>{" "}
					</Row>
				) : null}
				{currentprofile.CostingType == "SHEETS" ? (
					<Row className="m-0 justify-content-end">
						<Button color="primary" onClick={openSheet}>
							Open Cost Sheet
						</Button>
						<Button color="primary" className="ml-2" disabled={!currentprofile.CostingsSheetId || currentprofile.ProfileStatus > 5} onClick={() => dispatch(currentCostingActions.syncSheetData(currentprofile))}>
							Sync Costs from sheet
						</Button>
					</Row>
				) : null}
			</CardHeader>
			<div className="d-flex wrapper">
				{/* <FormLabels /> */}
				<Table inline hover bordered={true} size="sm">
					<thead className="border">
						<th className="h4">Breakdown by Methodology</th>
						{countrySpecs.map((country) => (
							<th className="text-center">
								<span className="d-flex align-middle text-nowrap">
									{getLabel("FieldingCountriesOptions", country.CountryCode)}
									{currentprofile.CostingType !== "SHEETS" ? (
										<FontAwesomeIcon title="Add Breakdown for Country" className="ml-2 pointer small add-indivi-icon" icon={faPlus} fixedWidth onClick={() => openCountryBreakdownCaution(country)} />
									) : null}
								</span>
								<div class="input-group mt-2">
									<div class="input-group-prepend">
										<span class="input-group-text text-sm">Currency</span>
									</div>
									<Select
										className="currency-entry custom-select-box"
										options={currencies?.map((c) => {
											return {
												value: `${c.Code}-${c.CurrencyUnit}`,
												label: `${c.Label} (1USD = ${c.ConversionRateToLocal}${c.CurrencyUnit})`,
											};
										})}
										value={getDefaultCurrencySelection(country.CostInputCurrency)}
										onChange={(select) => onCurrencyChange(select.value, country)}
									/>
								</div>
								{currentCosting.IsMultiCountry && currentprofile.CostingType !== "SHEETS" ? (
									<div className="d-flex justify-content-between mt-2">
										<FontAwesomeIcon title="Copy this country costs" icon={faClipboard} onClick={() => setCurrentClippedCountry(country)} className="ml-5 pointer" color="#04ace7" />
										<FontAwesomeIcon title="Paste copied costs to this country" icon={faPaste} onClick={() => pasteClippedCountry(country)} className={`mr-5 ${!currentClippedCountry ? "no-actions" : "pointer "}`} color="#04ace7" />
									</div>
								) : null}
							</th>
						))}
					</thead>
					<tbody>
						{
							// countrySpecs.map((country) => {
							//avoid hardcoding index
							//replace with lodash when installed
							countrySpecs && countrySpecs.length ? (
								_.head(countrySpecs).MethodologySpecs.map((ms) => {
									return (
										<>
											<tr>
												<td className="main-meth-label text-uppercase">
													<h5>{ms.Label}</h5>
												</td>
												{countrySpecs.map((cs) => (
													<td></td>
												))}
												{/* only for border styles purpose, todo: optimize */}
											</tr>

											{ms.CostsSchema.map((costsch) => {
												let finalProps = getFinalProperties(costsch.properties);
												return finalProps.length ? (
													<>
														<tr className="mt-4 h5">
															<td>
																<strong>{costsch.title}</strong>
																{/* only for border styles purpose, todo: optimize */}
															</td>
															{countrySpecs.map((cs) => (
																<td></td>
															))}
														</tr>
														{finalProps.map((prop) => {
															return costsch.properties[prop].title ? (
																<tr>
																	<td className="sub-meth-label">{costsch.properties[prop].title}</td>
																	{countrySpecs.map((cs) => {
																		let currentMeth = _.head(cs.MethodologySpecs.filter((mt) => mt.Code == ms.Code));
																		return (
																			<td>
																				<div class="input-group">
																					<input
																						placeholder={currentMeth.NotApplicable ? "Not Applicable" : null}
																						className="form-control"
																						type="number"
																						id={prop}
																						value={
																							countryDetails[cs.CountryCode] && countryDetails[cs.CountryCode][currentMeth.Code] && countryDetails[cs.CountryCode][currentMeth.Code][prop]
																								? getDefaultCurrValue(countryDetails[cs.CountryCode][currentMeth.Code][prop], cs)
																								: ""
																						} //for prepopulation
																						onKeyPress={(e) => {
																							validInputValue(e);
																						}}
																						onBlur={calcFormulaOnChange}
																						min={0}
																						step="any"
																						onChange={(eve) => updateCostEntryForm(eve, currentMeth.Code, cs)}
																						disabled={
																							currentMeth.NotApplicable ||
																							currentprofile.CostingType == "SHEETS" ||
																							(currentprofile.CostingType == "VENDOR" && currentprofile.VendorBiddingSubmethodologies && _.includes(currentprofile.VendorBiddingSubmethodologies.split(","), currentMeth.Code))
																						}
																					/>{" "}
																					<div class="input-group-append">
																						<span class="input-group-text text-sm">{cs.CostInputCurrency ? _.last(cs.CostInputCurrency.split("-")) : "USD"}</span>
																					</div>
																				</div>
																			</td>
																		);
																	})}
																</tr>
															) : null;
														})}
													</>
												) : null;
											})}
										</>
									);
								})
							) : (
									<></>
								)
							// })
						}
					</tbody>
				</Table>
			</div>
			<div className="ml-auto">
				<button className="btn btn-secondary mt-4 mr-2" onClick={() => dispatch(setCostingStatus({ ...costingStatus, showManualCostEntry: false }))}>
					Back
				</button>
				<button
					className="btn btn-primary mt-4"
					disabled={app.recordloading || currentCosting.ProfileStatus > 5 || currentprofile.CostingType == "SHEETS"}
					onClick={(e) => {
						if (app.recordloading || currentCosting.ProfileStatus > 5 || currentprofile.CostingType == "SHEETS") {
							e.preventDefault();
						} else {
							submitCostEntryForm(true);
						}
					}}
				>
					Save
					{app.recordloading ? <Spinner size="small" color="#495057" /> : null}
				</button>
			</div>
			{/*TODO: Modal also shows after closing breakdown page. Please review. :) */}
			<Modal isOpen={countryBreakdownModal} toggle={() => setCountryBreakdownModal(false)} size="sm">
				<ModalHeader toggle={() => setCountryBreakdownModal(false)}>
					<h4>Warning!</h4>
				</ModalHeader>
				<ModalBody>
					<p>You are about to edit cost breakdown by country.</p>
					<p>
						By doing this you might lose any costs already added for <strong>{getLabel("FieldingCountriesOptions", currentCountry.CountryCode)}</strong> without using breakdowns.
					</p>
					<p>If you are editing breakdowns already provided, you can safely ignore this warning.</p>
					<h5>Are you sure you want to continue?</h5>
				</ModalBody>
				<ModalFooter>
					<div className="d-flex justify-content-between">
						<Button className="form-control" color="secondary" disabled={app.recordloaded} onClick={() => setCountryBreakdownModal(false)}>
							Cancel
						</Button>
						<Button className="form-control ml-2" color="primary" disabled={app.recordloaded} onClick={() => breakdownAccepted()}>
							Confirm
						</Button>
					</div>
				</ModalFooter>
			</Modal>
			<Modal isOpen={resetCosts} toggle={() => openResetCosts(!resetCosts)}>
				<ModalHeader toggle={() => openResetCosts(!resetCosts)}>Reset Costing</ModalHeader>
				<ModalBody>This change is irreversible, you might lose costs data. Are you sure want to reset costing?</ModalBody>
				<ModalFooter>
					<Row>
						<Button
							color="secondary"
							onClick={() => {
								openResetCosts(!resetCosts);
							}}
						>
							Cancel
						</Button>
						<Button
							color="primary"
							className="ml-2"
							onClick={() => {
								let _currentprofile = { ...currentprofile };
								const additionalLabels = {
									CostTotalExternalOperations: {
										CostExtOpsMCPSubContract: "MCP/Group Company Sub-Contracting",
										CostExtOpsOtherTaxVAT: ["MCPTaxCost"
											, "MCPOtherTaxAdjustment"]
									},
								};
								_currentprofile.CountrySpecs.map((cs) => {
									cs.MethodologySpecs.map((ms) => {
										ms.CostsData = null;
										ms.TimingsData = null;
										Object.keys(ms.CalculationSchema).map((csch) => {
											cs[csch] = 0;
											Object.keys(ms.CalculationSchema[csch]).map((insch) => {
												cs[insch] = 0;
											});
											if (additionalLabels && additionalLabels[csch]) {
												Object.keys(additionalLabels[csch]).map((lab) => {
													cs[lab] = 0;
												});
											}
										});
									});
								});
								dispatch(
									currentCostingActions.saveCostingProfile({ ..._currentprofile, CostingType: null }, () => {
										dispatch(
											currentCostingActions.getCosting(currentprofile.id, () => {
												openResetCosts(!resetCosts);
												dispatch(
													setCostingStatus({
														...costingStatus,
														showManualCostEntry: false,
													})
												);
											})
										);
									})
								);
							}}
						>
							Confirm{app.recordloading ? <Spinner size="small" color="#495057" /> : null}
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</Card> : <TimeEntry switchToTime={switchToTime} />
	) : (
			<Card className="rounded ext-costing">
				<CardHeader>
					<Row>
						<Col>
							<Row>
								<Col>
									<h4>Add cost breakdown for {getLabel("FieldingCountriesOptions", currentCountry.CountryCode)}</h4>
								</Col>
							</Row>
							<Row>
								<Col>
									<h5>Columns names are required (City/Region/Vendor etc.)</h5>
								</Col>
							</Row>
						</Col>
						<Col>
							<Row>
								<Col>
									<Row>
										<Col>
											<h5 className="float-right error">Reminder: Input amounts should be in currency indicated per cell.</h5>
										</Col>
									</Row>
								</Col>
							</Row>
							<Row>
								<Col>
									<Button className="float-right" color="primary" onClick={addColumnForIndividual}>
										Add New Column +
								</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardHeader>
				<CardBody>
					<div className="wrapper">
						<Table inline hover bordered={true}>
							<thead>
								<th className="h4">Breakdown by Methodology</th>
								{individualCountry[currentCountry.CountryCode].map((countDet, index) => (
									<th key={`header_${index}`}>
										<span className="d-flex">
											<input value={countDet.title} className="form-control" placeholder="City/Region/Vendor..." onChange={(eve) => updateIndividualCountryTitle(eve.target.value, index)} />
											{individualCountry[currentCountry.CountryCode].length > 1 ? <FontAwesomeIcon className="align-middle mr-2 error pointer" icon={faTimes} fixedWidth onClick={() => removeFromIndividual(index)} /> : null}
										</span>
										{individualCountry[currentCountry.CountryCode].length > 1 && currentprofile.CostingType !== "SHEETS" ? (
											<div className="d-flex justify-content-between mt-2">
												<FontAwesomeIcon icon={faClipboard} title="Copy" onClick={() => setCurrentClippedRegion(countDet)} className="ml-5 pointer" color="#04ace7" />
												<FontAwesomeIcon icon={faPaste} title="Paste" onClick={() => pasteClippedRegion(index)} className={`mr-5 ${!currentClippedRegion ? "no-actions" : "pointer "}`} color="#04ace7" />
											</div>
										) : null}
									</th>
								))}
							</thead>
							<tbody>
								{currentCountry.MethodologySpecs.map((ms, ind) => {
									return (
										<>
											<tr>
												<td className="main-meth-label text-uppercase">
													<h4>{ms.Label}</h4>
												</td>
												{individualCountry[currentCountry.CountryCode].map((cs) => (
													<td></td>
												))}
												{/* only for border styles purpose, todo: optimize */}
											</tr>

											{ms.CostsSchema.map((costsch) => {
												let finalProps = getFinalProperties(costsch.properties);
												return finalProps.length ? (
													<>
														<tr className="mt-4">
															<td>
																<strong>{costsch.title}</strong>
																{/* only for border styles purpose, todo: optimize */}
															</td>
															{individualCountry[currentCountry.CountryCode].map((cs) => (
																<td></td>
															))}
														</tr>
														{finalProps.map((prop) => {
															return (
																<tr>
																	<td className="sub-meth-label">{costsch.properties[prop].title}</td>
																	{individualCountry[currentCountry.CountryCode].map((indivi, indIndex) => {
																		return (
																			<td>
																				<div class="input-group">
																					<input
																						className="form-control"
																						type="number"
																						value={
																							individualCountry[currentCountry.CountryCode] && individualCountry[currentCountry.CountryCode].length
																								? individualCountry[currentCountry.CountryCode][indIndex][ms.Code]
																									? getDefaultCurrValue(individualCountry[currentCountry.CountryCode][indIndex][ms.Code].properties[prop], currentCountry)
																									: null
																								: null
																						}
																						onKeyPress={(e) => {
																							validInputValue(e);
																						}}
																						min={0}
																						step="any"
																						onChange={(eve) => {
																							updateIndividualProperty(eve, indIndex, ms.Code, currentCountry);
																						}}
																						id={prop}
																						disabled={
																							ms.NotApplicable || (currentprofile.CostingType == "VENDOR" && currentprofile.VendorBiddingSubmethodologies && _.includes(currentprofile.VendorBiddingSubmethodologies.split(","), ms.Code))
																						}
																					/>{" "}
																					<div class="input-group-append">
																						<span class="input-group-text text-sm">{currentCountry.CostInputCurrency ? _.last(currentCountry.CostInputCurrency.split("-")) : "USD"}</span>
																					</div>
																				</div>
																			</td>
																		);
																	})}
																</tr>
															);
														})}
													</>
												) : null;
											})}
										</>
									);
								})}
							</tbody>
						</Table>
					</div>
					<div className="ml-auto mt-2">
						<h4 className="error float-right mb-0">{individualEntryError}</h4>
						<br></br>
						<button className="btn btn-primary mt-4 float-right" onClick={() => updateDataToCountry()}>
							Add to {getLabel("FieldingCountriesOptions", currentCountry.CountryCode)}
						</button>

						<button className="btn btn-secondary mr-2 mt-4 float-right" onClick={() => cancelIndividualCosting()}>
							Cancel
					</button>
					</div>
				</CardBody>
			</Card>
		);
};

export default ManualCostEntry;

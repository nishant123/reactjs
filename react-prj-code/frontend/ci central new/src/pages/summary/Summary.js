import React, { useState, useEffect, Suspense } from "react";

import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "react-router";
import { useParams } from "react-router-dom";

import _ from "lodash";

import * as commercialTimeSchema from "./commercialTimeSchema.json";
import { Link, useHistory } from "react-router-dom";
import * as countryActions from "../../redux/actions/countrySpecsActions";
import * as currentProjectActions from "../../redux/actions/currentProjectActions";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import Layout from "../../layouts/Project";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import update from "immutability-helper";
import RecordsSpinner from "../../components/RecordsSpinner";
import Spinner from "../../components/Spinner";
import {
	faChevronRight,
	faChevronDown,
	faChevronUp,
	faExclamationCircle,
	faHourglassHalf,
	faThumbsUp,
	faThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import { getLabel } from "../../utils/codeLabels";
import {
	Label,
	Input,
	Button,
	Row,
	Col,
	Card,
	CardBody,
	Container,
	Collapse,
	CardHeader,
	CardTitle,
	CardText,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Badge,
	Table,
	InputGroup,
	InputGroupAddon,
} from "reactstrap";
import ModalCommissioning from "./ModalCommissioning";
import ModalPostCommission from "./ModalPostCommission";
import ModalBypass from "./ModalBypass";
import ModalDecommissioning from "./ModalDecommissioning";
import Select from "react-select";
import ManualCostEntry from "../costingProfile/ManualCostEntry";
import { setCurrentCostingProfiles } from "../../redux/actions/costingsActions";
import { Square, CheckSquare, XSquare, Users } from "react-feather";
import GlobalCostingSheet from "../costingProfile/GlobalCostingSheet";
import { invalid } from "moment";
import CostBreakDown from "./CostBreakDown";
import { recordLoadEnd, recordLoadStart } from "../../redux/actions/appActions";
// import alasql from "alasql";
const alasql = window.alasql;

const getTextColor = (flag) => {
	return flag
		? "text-success font-weight-bold"
		: "text-danger font-weight-bold";
};

const Summary = () => {
	let { profileId } = useParams();
	const history = useHistory();
	const dispatch = useDispatch();
	const [rfqData, setRfqData] = useState({});
	const [opsData, setOpsData] = useState({});
	const [costFields, setCostFields] = useState({});
	const [isOpen, setIsOpen] = useState({});
	const [currentCurrency, setCurrentCurrency] = useState({});
	const [calledProfile, setProfileCalling] = useState(false);
	const [calledCurrencies, setCalledCurrencies] = useState(false);
	const [showManualCostEntry, setShowManualCostEntry] = useState(false);
	const [showSheetsCosts, setShowSheetsCosts] = useState(false);
	const [showCostMethod, setShowCostMethod] = useState(false);
	const [isCostBDOpen, openCostBreakdown] = useState(false);
	const [schema, setSchema] = useState({});
	const [bands, setBands] = useState([]);
	const [invalid, setInvalid] = useState({});
	const [downloadModal, openDownloadModal] = useState(false);
	const [selectedProperties, setSelectedProperties] = useState([]);
	const [allDownloadProps, setAllDownloadProps] = useState([
		{
			value: "projectDetails", label: "Project Details"
		},
		{
			value: "methodology", label: "Methodologies"
		},
		{
			value: "opsresources", label: "Operation Resources"
		},
		{
			value: "costbreakdown", label: "Total Cost Breakdown"
		},
		{
			value: "profitability", label: "Profitability Overview"
		},
		{
			value: "profitabilitychecks", label: "Profitability Checks"
		}
	]);
	const [downloadType, setDownloadType] = useState("SHEET")

	const userRecord = useSelector(({ user }) => user.userRecord);
	const app = useSelector(({ app }) => app);
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const profile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);
	const currencies = useSelector(({ currentCosting }) =>
		currentCosting.currentCostingProfile.ProfileSetting &&
			currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
			? currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
			: []
	);
	const downloadInSheets = () => {
		var opts = [];
		var allTabs = []
		dispatch(recordLoadStart())
		if (_.includes(selectedProperties, "projectDetails")) {
			opts.push({ sheetid: "Project Details", header: true })
			let data = []
			data.push({
				Detail: "Project Name",
				Value: profile?.Project?.ProjectName
			})
			data.push({
				Detail: "Project Number",
				Value: profile?.Project?.ProjectId
			})
			data.push({
				Detail: "Primary Nielsen Contact Email",
				Value: profile?.Project?.ProposalOwnerEmail.value
			})
			data.push({
				Detail: "Other Project Team Contacts",
				Value: profile &&
					profile.Project &&
					profile.Project.OtherProjectTeamContacts &&
					profile.Project.OtherProjectTeamContacts.length
					? profile.Project.OtherProjectTeamContacts.map(
						(item) => {
							return item.value
						}
					).join()
					: "No Contacts Available"
			})
			data.push({
				Detail: "Syndicated Project",
				Value: profile?.Project?.IsSyndicated ? "Yes" : "No"
			})
			data.push({
				Detail: "Client Details",
				Value: profile?.Project?.ContractDetails?.map((item) => {
					return `${item.AccountName} ${item.OpportunityNumber ? `- (${item.OpportunityNumber})` : ""}`
				}).join()
			})
			data.push({
				Detail: "Commissioning Office",
				Value: getLabel(
					"OfficeOptions",
					profile?.Project?.CommissioningOffice
				)
			})
			data.push({
				Detail: "Business Unit",
				Value: getLabel(
					"BusinessUnitOptions",
					profile?.Project?.BusinessUnit
				)
			})
			data.push({
				Detail: "Industry Vertical",
				Value: getLabel(
					"VerticalOptions",
					profile?.Project?.IndustryVertical
				)
			})
			data.push({
				Detail: "All Fielding Countries",
				Value: profile.FieldingCountries &&
					typeof profile.FieldingCountries == "string"
					? profile.FieldingCountries.split(",").map(
						(item) => {
							return getLabel(
								"FieldingCountriesOptions",
								item
							)
						}

					).join()
					: "-"
			})
			data.push({
				Detail: "Methodologies",
				Value: profile?.Methodology?.split(",").map((item) => {
					return getLabel("MethodologyOptions", item)
				}).join()
			})
			data.push({
				Detail: "Sub-Methodologies",
				Value: profile?.SubMethodology?.split(",").map((item) => {
					return getLabel("SubMethodologyOptions", item)
				}).join()
			})
			data.push({
				Detail: "Tracker",
				Value: profile?.IsTracker ? "Yes" : "No"
			})
			data.push({
				Detail: "Tracking Frequency",
				Value: profile?.TrackingFrequency
					? getLabel(
						"TrackingFrequencyOptions",
						profile?.TrackingFrequency
					)
					: "Not Applicable"
			})
			allTabs.push(data)
		}
		if (_.includes(selectedProperties, "methodology")) {
			opts.push({ sheetid: "Methodologies", header: true })
			let data = null
			_.head(profile.CountrySpecs)?.MethodologySpecs.map(ms => {
				var title = "";
				data = ms.RFQSchema.order.map(rfq => {
					let finalList = []
					let finalObj = {}
					let property = getProperty(ms.RFQSchema, rfq);
					if (property && property.isNewSection) {
						let titleObj = {}
						titleObj["Methodology BreakDown"] = property.sectionTitle
						profile.CountrySpecs.map(cs => {
							titleObj[getLabel(
								"FieldingCountriesOptions",
								cs.CountryCode
							)] = ""
						})
						finalList.push(titleObj)
					}
					if (property) {
						finalObj["Methodology BreakDown"] = property.title;
						profile.CountrySpecs.map(cs => {
							finalObj[getLabel(
								"FieldingCountriesOptions",
								cs.CountryCode
							)] = rfqData[cs.CountryCode] &&
								rfqData[cs.CountryCode][
								ms.Code
								]
									? Array.isArray(
										rfqData[cs.CountryCode][
										ms.Code
										][rfq]
									)
										? rfqData[cs.CountryCode][
											ms.Code
										][rfq].join()
										: typeof rfqData[
											cs.CountryCode
										][ms.Code][rfq] == "boolean"
											? rfqData[cs.CountryCode][
												ms.Code
											][rfq]
												? "Yes"
												: "No"
											: rfqData[cs.CountryCode][
												ms.Code
											][rfq]
												? rfqData[cs.CountryCode][
												ms.Code
												][rfq]
												: "-"
									: "-"

						})
						finalList.push(finalObj)
					}
					return finalList
				})
			})
			let final = []
			data?.map(t => {
				final.push(...t)
			})
			allTabs.push(final)
		}
		if (_.includes(selectedProperties, "opsresources")) {
			opts.push({ sheetid: "Operation resources", header: true })
			var title = "";
			let data = []
			_.head(profile.WaveSpecs)?.OpsResourcesSchema.order.map(ors => {
				let finalList = []
				let property = getProperty(_.head(profile.WaveSpecs).OpsResourcesSchema, ors);
				if (property && property.isNewSection) {
					let titleObj = {}
					titleObj["Operation Resources BreakDown"] = property.sectionTitle
					profile.WaveSpecs.map(cs => {
						let key = cs.WaveName ? `#${cs.WaveNumber} ${cs.WaveName}` : `#${cs.WaveNumber}`
						titleObj[key] = ""
					})
					finalList.push(titleObj)
				}
				if (property) {
					let finalObj = {}
					finalObj["Operation Resources BreakDown"] = property.title;
					profile.WaveSpecs.map(cs => {
						let key = cs.WaveName ? `#${cs.WaveNumber} ${cs.WaveName}` : `#${cs.WaveNumber}`
						finalObj[key] = opsData[cs.WaveNumber] ?
							getOpsValue(
								opsData[cs.WaveNumber][ors],
								ors
							) : "-"
					})
					finalList.push(finalObj)
				}
				data.push(finalList)
			})
			// })
			let final = []
			data.map(t => {
				final.push(...t)
			})
			allTabs.push(final)
		}
		if (_.includes(selectedProperties, "costbreakdown")) {
			opts.push({ sheetid: "Total Cost Breakdown", header: true })
			let data = [];
			Object.keys(costFields).map(cf => {
				if (alternativeLabels[cf] &&
					Object.keys(alternativeLabels[cf]).filter(
						(al) => profile.ProfileSetting[al]
					).length) {
					let finalObj = {}
					finalObj.Component = "Breakdown Not Available - Using OOP % Multiplier"
					finalObj.Total = `${profile.ProfileSetting[
						_.head(Object.values(alternativeLabels[cf]))
					] * 100}%`
					profile.CountrySpecs.map((cs) => {
						finalObj[getLabel(
							"FieldingCountriesOptions",
							cs.CountryCode
						)] = ""
					})
					data.push(finalObj)
				}
				else if (costFields[cf].length) {
					costFields[cf].map((ccf) => {
						let finalObj = {}
						finalObj.Component = costlabels[ccf]
						finalObj.Total = getCurrentCurrency(
							profile[ccf],
							profile.CostInputCurrency
						)
						profile.CountrySpecs.map((cs) => {
							finalObj[getLabel(
								"FieldingCountriesOptions",
								cs.CountryCode
							)] = getCurrentCurrency(
								cs[ccf],
								cs.CostInputCurrency
							)
						})
						data.push(finalObj)
					})
				}
				else {
					Object.keys(costIntCommLabels).map((cicl) => {
						let finalObj = {};
						finalObj.Component = costIntCommLabels[cicl]
						finalObj.Total = getCurrentCurrency(
							profile[cicl],
							profile.CostInputCurrency
						)
						profile.CountrySpecs.map((cs) => {
							finalObj[getLabel(
								"FieldingCountriesOptions",
								cs.CountryCode
							)] = ""
						})
						data.push(finalObj)
					})
				}

				if (alternativeLabels[cf] &&
					Object.keys(alternativeLabels[cf]).filter(
						(al) => profile.ProfileSetting[al]
					).length) {
					let finalObj = {};
					finalObj.Component = costlabels[cf];
					finalObj.Total = getCurrentCurrency(
						profile.CostTotalExternalOperations *
						profile.ProfileSetting[
						_.head(
							Object.values(alternativeLabels[cf])
						)
						]
					)
					profile.CountrySpecs.map((cs) => {
						finalObj[getLabel(
							"FieldingCountriesOptions",
							cs.CountryCode
						)] = ""
					})
					data.push(finalObj)
				} else {
					let finalObj = {};
					finalObj.Component = costlabels[cf];
					finalObj.Total = getCurrentCurrency(
						profile[cf],
						profile.CostInputCurrency
					)
					profile.CountrySpecs.map((cs) => {
						finalObj[getLabel(
							"FieldingCountriesOptions",
							cs.CountryCode
						)] = getCurrentCurrency(
							cs[cf],
							cs.CostInputCurrency
						)
					}
					)
					data.push(finalObj)
				}

			})
			allTabs.push(data)
		}
		if (_.includes(selectedProperties, "profitability")) {
			opts.push({ sheetid: "Profitability Overview", header: false })
			let data = []
			data.push({
				Component: "Total Internal Operations Cost",
				Cost: getCurrentCurrency(
					profile.CostTotalInternalOperations
				)
			})
			data.push({
				Component: "Total External Operations / OOP / Third Party Cost"
				, Cost: getCurrentCurrency(
					profile.CostTotalExternalOperations
				)
			})
			data.push({
				Component: "Total Internal Commercial Cost",
				Cost: getCurrentCurrency(
					profile.CostTotalInternalCommercial
				)
			})
			data.push({
				Component: "Total External Commercial Cost",
				Cost: getCurrentCurrency(
					profile.CostTotalExternalCommercial
				)
			})
			data.push({
				Component: [`Overheads ${profile.ProfileSetting?.PercentOverhead * 100}%`]
				, Cost: getCurrentCurrency(profile.Overheads)
			})
			data.push({
				Component: [`Markup to get ${profile.ProfileSetting
					? profile.ProfileSetting.UsesOOPMarkUp
						? profile.ProfileSetting.TargetPercentOOPMarkUp *
						100
						: profile.ProfileSetting
							.TargetPercentContributionMargin * 100
					: ""}% ${profile.ProfileSetting?.UsesOOPMarkUp
						? "OOP"
						: "Contribution Margin"}`], Cost: getCurrentCurrency(profile.Markup)
			})
			data.push({
				Component: "%Margin",
				Cost: `${_.round(((_.round(profile.TotalInternalCosts, 2) + _.round(profile.TotalExternalCosts, 2)) / profile.PriceToClient) * 100, 2)}%`
			})
			data.push({
				Component: "Minimum Recommended Price to Client",
				Cost: getCurrentCurrency(profile.RecommendedPrice)
			})
			data.push({
				Component: "Actual Price Given To Client",
				Cost: getCurrentCurrency(profile.PriceToClient)
			})

			allTabs.push(data)
		}
		if (_.includes(selectedProperties, "profitabilitychecks")) {
			opts.push({ sheetid: "Profitability Checks", header: false })
			let data = []
			if (profile.ApprovalDetails
				&& profile.ApprovalDetails.length
				&& profile.ProfileSetting
				&& profile.ProfileSetting.NeedsOutOfPocketCostCheck) {
				data.push({
					"Profitability Checks": "Operations Out of Pocket %",
					Target: getOOPThresholdText(),
					Current: profile.OutOfPocketCostPercent
						? `${_.round(profile.OutOfPocketCostPercent * 100, 2)}%`
						: ""
				})
			}
			if (profile.ProfileSetting?.NeedsCommercialCostCheck) {
				data.push({
					"Profitability Checks": "Commercial Cost %",
					Target: `${profile.ProfileSetting.ThresholdPercentIntCommCost * 100}% or more`,
					Current: profile.InternalCommercialCostPercent
						? `${_.round(profile.InternalCommercialCostPercent * 100, 2)}%`
						: ""
				})
			}
			if (profile.ProfileSetting?.NeedsNetRevenueCheck) {
				data.push({
					"Profitability Checks": "Net Revenue %",
					Target: `${profile.ProfileSetting.ThresholdPercentNetRevenue * 100}% or more`,
					Current: profile.NetRevenuePercent
						? `${_.round(profile.NetRevenuePercent * 100, 2)}%`
						: ""
				})

			}
			if (profile.ProfileSetting?.NeedsContributionMarginCheck) {
				data.push({
					"Profitability Checks": "Minimum Contribution Margin %",
					Target: `${profile.ProfileSetting.TargetPercentContributionMargin * 100}% or more`,
					Current: profile.ContributionMarginPercent
						? `${_.round(profile.ContributionMarginPercent * 100, 2)}%`
						: ""
				})

			}
			if (profile.ProfileSetting?.NeedsMinimumProjectValueCheck) {
				data.push({
					"Profitability Checks": "Minimum Project Value (Price to Client)",
					Target: getActualPrice(
						profile.ProfileSetting.ThresholdPriceToClient,
						true
					),
					Current: getActualPrice(profile.PriceToClient, true)
				})
			}
			allTabs.push(data)

		}
		let filename = `${profile.Project?.ProjectId}${profile.Project.ProjectName ? `_${profile.Project.ProjectName}` : ""}_${profile.ProfileNumber}${profile.ProfileName ? `_${profile.ProfileName}` : ""}_summary`
		alasql(`SELECT INTO XLSX("${removeSpaces(filename)}.xlsx",?) FROM ?`, [opts, [...allTabs]]);
		dispatch(recordLoadEnd())
	}
	const removeSpaces = (filename) => {
		return filename?.split(" ").join("_")
	}
	useEffect(() => {
		if (
			!Object.keys(schema).length &&
			profile &&
			profile.ProfileSetting &&
			profile.ProfileSetting.CommercialHoursSchema
		) {
			setSchema(profile.ProfileSetting.CommercialHoursSchema);
			setBands(profile.ProfileSetting.CommercialHoursSchema.bands);
		}
	}, [profile]);
	useEffect(() => {
		if (profileId && !calledProfile) {
			setProfileCalling(true);
			dispatch(currentCostingActions.getCosting(profileId));
		} else if (!profileId) {
			console.log("boots to dashboard");
			history.replace("/");
		}
	}, []);
	// useEffect(() => {
	//   if (!summaryCalled && profile && profile.ProfileSetting) {
	//     setSummaryCalled(true);
	//     dispatch(currentCostingActions.generateSummary());
	//   }
	// });
	useEffect(() => {
		if (
			!currencies &&
			profile &&
			profile.ProfileSetting &&
			Object.keys(profile.ProfileSetting).length
		) {
			if (!calledCurrencies && !profile.ProfileSetting.CurrenciesData) {
				setCalledCurrencies(true);
				dispatch(
					currentCostingActions.setCurrencies(() => setCalledCurrencies(false))
				);
			}
		}
	}, [profile]);
	// useEffect(() => {
	//   if (!currencies && !calledCurrencies && (profile
	//     && profile.ProfileSetting
	//     && !profile.ProfileSetting.CurrenciesData)) {
	//     setCalledCurrencies(true);
	//     dispatch(
	//       currentCostingActions.setCurrencies(() => setCalledCurrencies(false))
	//     );
	//   }
	// });

	const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);

	const getCurrentCurrency = (actualvalue, currencyvalue, onlyCurrency) => {
		// if (!currencyvalue) currencyvalue = "US-USD";
		// let currentvalue = `${currentCurrency.Code}-${currentCurrency.CurrencyUnit}`;

		// if (currencyvalue == currentvalue) {
		//   if (actualvalue) {
		//     let finalVal = _.round(actualvalue, 2)
		//     return onlyCurrency ? finalVal : `${finalVal} ${currentCurrency.CurrencyUnit}`

		//   }
		// } else {
		if (
			currencies &&
			currencies.length &&
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
		// }
	};
	const getActualPrice = (actualvalue, withCurrency) => {
		if (
			currencies &&
			currencies.length &&
			currentCurrency &&
			currentCurrency.ConversionRateToLocal
		) {
			if (actualvalue) {
				let finalVal = _.round(
					actualvalue * currentCurrency.ConversionRateToLocal,
					2
				);
				return withCurrency
					? `${finalVal} ${currentCurrency.CurrencyUnit}`
					: finalVal;
			} else return null;
		}
	};
	const getCurrencyUnit = (currencyInput) => {
		if (!currencyInput) currencyInput = "US-USD";
		let values = currencyInput.split("-");
		let currencyUnit = _.last(values);
		// let countryCode = _.head(values);
		return currencyUnit;
	};
	const getCurrentCurrencyUnit = (currencyInput) => {
		if (!currencyInput) currencyInput = "US-USD";
		let values = currencyInput.split("-");
		let currencyUnit = _.last(values);
		let countryCode = _.head(values);
		let finalCurrency = null;
		if (currencies && currencies.length) {
			finalCurrency = _.head(
				currencies.filter(
					(cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
				)
			);
			finalCurrency = {
				value: `${finalCurrency.Code}-${finalCurrency.CurrencyUnit}`,
				label: `${finalCurrency.Label} (1USD = ${finalCurrency.ConversionRateToLocal}${finalCurrency.CurrencyUnit})`,
			};
		}
		return finalCurrency;
	};

	const summaryCurrencyChange = (value) => {
		let editableprofile = {
			...profile,
			CountrySpecs: [...profile.CountrySpecs],
			CostInputCurrency: value.value,
			currencies,
		};
		let reqValue = value.value;
		let values = reqValue.split("-");
		let currencyUnit = _.last(values);
		let countryCode = _.head(values);
		let finalCoversionUnit = "";
		if (currencies && currencies.length) {
			let finalCurr = _.head(
				currencies.filter(
					(cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
				)
			);
			setCurrentCurrency({ ...finalCurr });
			finalCoversionUnit = finalCurr.ConversionRateToLocal;
		}
		// editableprofile.CountrySpecs = editableprofile.CountrySpecs.map((cs) => {
		//   // let values = cs.CostInputCurrency ? cs.CostInputCurrency.split("-") : "US-USD".split("-");
		//   // let currencyunit = _.last(values);
		//   // let countrycode = _.head(values);
		//   // let dollarrate = _.head(currencies.filter((cur) => cur.Code == countrycode && cur.CurrencyUnit == currencyunit)).ConversionRateToLocal
		//   // Object.keys(costFields).map((cf) => {
		//   //   // cs[cf] = cs[cf] / dollarrate
		//   //   cs[cf] = cs[cf] / finalCoversionUnit
		//   // })
		//   return { ...cs, CostInputCurrency: reqValue };
		// });
		dispatch(currentCostingActions.updateProfile({ ...editableprofile }));
	};
	useEffect(() => {
		let finalCostFields = {};

		_.head(profile.CountrySpecs)?.MethodologySpecs.map((ms) => {
			Object.keys(ms.CalculationSchema).map((csch) => {
				if (!finalCostFields[csch]) {
					finalCostFields[csch] = [];
				}
				Object.keys(ms.CalculationSchema[csch]).map((insch) => {
					if (!_.includes(finalCostFields[csch], insch)) {
						finalCostFields[csch].push(insch);
					}
				});
				if (additionalLabels && additionalLabels[csch]) {
					Object.keys(additionalLabels[csch]).map((lab) => {
						if (!_.includes(finalCostFields[csch], lab)) {
							finalCostFields[csch].push(lab);
						}
					});
				}
			});
		});
		setCostFields(finalCostFields);
	}, [profile]);
	useEffect(() => {
		if (profile && profile.CostInputCurrency) {
			let values = profile.CostInputCurrency.split("-");
			let currencyUnit = _.last(values);
			let countryCode = _.head(values);
			if (currencies) {
				setCurrentCurrency(
					_.head(
						currencies.filter(
							(cur) =>
								cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
						)
					)
				);
			}
		}
	}, [profile, currencies]);
	// useEffect(() => {
	//   if (profile.id) {
	//     dispatch(currentCostingActions.generateProfitability());
	//   }
	// }, []);
	const alternativeLabels = {
		CostTotalInternalCommercial: {
			UsesOopOverrideIntCommCost: "CostIntCommMultiplier",
			// Value: "CostTotalExternalOperations"
		},
		CostTotalInternalOperations: {
			UsesOopOverrideIntOpsCost: "CostIntOpsMultiplier",
			// Value: "CostTotalExternalOperations"
		},
	};
	const additionalLabels = {
		CostTotalExternalOperations: {
			CostExtOpsMCPSubContract: "MCP/Group Company Sub-Contracting",
			CostExtOpsOtherTaxVAT: "VAT and Other Tax Adjustment",
		},
	};
	const costlabels = {
		CostExtOpsMCPSubContract: "MCP/Group Company Sub-Contracting",
		CostExtOpsOtherTaxVAT: "VAT and Other Tax Adjustment",
		CostTotalExternalOperations: "Total External Operations Costs (OOP)",
		CostExtOpsInterviewers: "Interviewers - Temporaries & Subcontractors",
		CostExtOpsDCQCDPSP: "External DC/Coding/QC/DP/Programming/Scripting",
		CostExtOpsTE: "Travel, Lodging and Entertainment",
		CostExtOpsOthers: "External Others",
		CostExtOpsIncentives: "Incentives/Respondent Fees",
		CostExtOpsConsultantVendor: "External Consultant/Vendor",
		CostExtOpsPrintingStationery: "Printing/Stationery",
		CostExtOpsFreightShipping: "Freight/Shipping",
		CostExtOpsVenueHireRecruitment:
			"Venue/Hire/Recruitment and Other Misc. Externals",
		CostTotalInternalOperations: "Total Internal Operations Costs",
		CostIntOpsFieldPMQC: "Internal Time Field, Project Management & QC",
		CostIntOpsOthers: "Internal Other Ops",
		CostIntOpsProgramming: "Internal Time Programming",
		CostIntOpsDPCodingAnalysis: "Internal Time Data Processing/Coding/Analysis",
		CostTotalExternalCommercial: "Total External Commercial Costs",
		CostExtCommTE: "Travel, Lodging and Entertainment",
		CostExtCommConsultant: "External consultant/report writing",
		CostExtCommOthers: "CS Other Expenses",
		CostTotalInternalCommercial: "Total Internal Commercial Costs",
	};
	const costIntCommLabels = {
		CostIntCommExecDirector: "Executive Director",
		CostIntCommDirector: "Director",
		CostIntCommAssociateDirector: "Associate Director",
		CostIntCommSeniorManager: "Senior Manager",
		CostIntCommManager: "Manager",
		CostIntCommSeniorExecutive: "Senior Executive",
		CostIntCommExecutive: "Executive",
		CostIntCommDataScience: "Data Science",
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
	// const schema = commercialTimeSchema.default;
	// const bands = schema.bands ? schema.bands : []
	// [
	//   "Executive Director",
	//   "Director",
	//   "Associate Director",
	//   "Senior Manager",
	//   "Manager",
	//   "Senior Executive",
	//   "Executive",
	//   "Data Science",
	// ];
	const [allTabsStatus, setTabStatus] = useState({
		projectDetails: false,
		methSummary: false,
		opsResources: false,
		clientServices: false,
		costBreakdown: false,
		profOverview: false,
		approvals: false,
		overall: false,
	});
	useEffect(() => {
		if (profile && !Object.keys(rfqData).length && profile.CountrySpecs) {
			let finalData = {};
			profile.CountrySpecs.map((cs) => {
				cs.MethodologySpecs.filter((ms) => !ms.NotApplicable).map((ms) => {
					if (!finalData[cs.CountryCode]) {
						finalData[cs.CountryCode] = {};
					}
					if (!finalData[cs.CountryCode][ms.Code]) {
						finalData[cs.CountryCode][ms.Code] = {};
					}
					finalData[cs.CountryCode][ms.Code] = ms.RFQData;
				});
			});
			setRfqData(finalData);
			let opsFinal = {};
			profile.WaveSpecs.map((ws) => {
				opsFinal[ws.WaveNumber] = ws.OpsResourcesData;
			});
			setOpsData(opsFinal);
		}
	}, [profile]);
	const getProperty = (schema, prop) => {
		if (schema.properties[prop]) return schema.properties[prop];
		else {
			let reqVal = "";
			if (schema.dependencies) {
				Object.keys(schema.dependencies).map((dep) => {
					schema.dependencies[dep].oneOf.map((oo) => {
						if (oo.properties[prop] && oo.properties[prop].title) {
							reqVal = oo.properties[prop];
						}
					});
				});
			}
			return reqVal;
		}
	};

	const getOpsValue = (value, prop) => {
		if (value || value == false) {
			if (prop.toLowerCase().indexOf("complexity") != -1) {
				if (prop == "surveyProgrammingComplexity") {
					return _.head(
						codeLabels.QuestionnaireComplexityOptions.filter(
							(frq) => frq.Code == value
						)
					)?.Label;
				}
				if (prop == "dataProcessingComplexity") {
					return _.head(
						codeLabels.DataProcessingComplexityOptions.filter(
							(frq) => frq.Code == value
						)
					)?.Label;
				}
				if (prop == "chartingComplexity") {
					return _.head(
						codeLabels.ChartingComplexityOptions.filter(
							(frq) => frq.Code == value
						)
					)?.Label;
				}
			} else {
				if (Array.isArray(value)) {
					return value.join();
				} else if (typeof value == "boolean") {
					return value ? "Yes" : "No";
				} else return value;
			}
		} else {
			return "-";
		}
	};

	const getOOPThresholdText = () => {
		if (profile.ApprovalLevelNeeded === -1) {
			return `${profile.ApprovalDetails[0].ThresholdOutOfPocketPercentage * 100
				} % or less (Price To Client > ${getActualPrice(
					profile.ApprovalDetails[0].ThresholdRevenueAmount,
					true
				)})`;
		} else {
			let index = profile.ApprovalLevelNeeded;
			return `${profile.ApprovalDetails[index].ThresholdOutOfPocketPercentage * 100
				} % or less (P2C > ${getActualPrice(
					profile.ApprovalDetails[index].ThresholdRevenueAmount,
					true
				)})`;
		}
	};
	const chooseCostMethod = (method) => {
		dispatch({
			type: currentCostingActions.UPDATE_NEW_COSTING,
			currentCostingProfile: { CostingType: method },
		});
		switch (method) {
			case "VENDOR":
				console.log("VENDOR");
				setShowCostMethod(false);
				return;
			case "SHEETS":
				console.log("SHEETS");
				setShowCostMethod(false);
				return;
			case "DEFAULT":
				setShowManualCostEntry(true);
				setShowCostMethod(false);
				return;
		}
	};
	const selectCostInputModal = () => {
		return (
			<Modal
				isOpen={showCostMethod}
				toggle={() => setShowCostMethod(!showCostMethod)}
				centered={true}
				size={"lg"}
				backdrop={"static"}
			>
				<ModalHeader toggle={() => setShowCostMethod(!showCostMethod)}>
					<h4>Select Costing Method</h4>
				</ModalHeader>
				<ModalBody>
					<h5>
						Please Note: You can only select one costing method per profile.
						Some options may not be available depending on your market's default
						settings.
          </h5>
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => chooseCostMethod("VENDOR")}>
						Trigger Vendor Bidding
          </Button>{" "}
					<Button onClick={() => chooseCostMethod("SHEETS")}>
						Use Google Sheets
          </Button>{" "}
					<Button onClick={() => chooseCostMethod("DEFAULT")}>
						Input Cost Directly
          </Button>{" "}
				</ModalFooter>
			</Modal>
		);
	};

	return profile ? (
		<Layout
			costMethod={profile.CostingType}
			setShowCostMethod={setShowCostMethod}
			showManualCostEntry={showManualCostEntry}
			setShowManualCostEntry={setShowManualCostEntry}
			showSheetsCosts={showSheetsCosts}
			setShowSheetsCosts={setShowSheetsCosts}
			profileStatusToDisplay={getLabel(
				"CostingStatusOptions",
				profile.ProfileStatus
			)}
			projectStatusToDisplay={getLabel(
				"ProjectStatusOptions",
				profile.Project?.ProjectStatus
			)}
			avoidEdit={true}
		>
			{selectCostInputModal()}
			{showSheetsCosts ? (
				<>
					<GlobalCostingSheet setShowSheetsCosts={setShowSheetsCosts} />
				</>
			) : showManualCostEntry ? (
				<ManualCostEntry setShowManualCostEntry={setShowManualCostEntry} />
			) : (
						<>
							<Container fluid={profile.IsTracker}>
								<Card>
									<CardHeader>
										<Row className="d-flex justify-content-between">
											<Col xs="9" className="align-self-center">
												<Row className="d-flex justify-content-start">
													<Col className="align-self-center">
														<CardTitle className="text-uppercase mb-0">
															Costing Profile Summary
                        </CardTitle>
													</Col>
													{/* <Col className="align-self-center">
                            <Badge title="Costing Profile Status">
                              {getLabel(
                                "CostingStatusOptions",
                                profile?.ProfileStatus
                              )}
                            </Badge>
                          </Col> */}
												</Row>
											</Col>
											<Col xs="3" className="align-self-center">
												<Link
													className=" p-1 medium float-right mr-2"
													onClick={(e) =>
														setTabStatus({
															...allTabsStatus,
															overall: !allTabsStatus.overall,
															projectDetails: !allTabsStatus.overall ? true : false,
															methSummary: !allTabsStatus.overall ? true : false,
															opsResources: !allTabsStatus.overall ? true : false,
															clientServices: !allTabsStatus.overall ? true : false,
															costBreakdown: !allTabsStatus.overall ? true : false,
															profOverview: !allTabsStatus.overall ? true : false,
															approvals: !allTabsStatus.overall ? true : false,
														})
													}
												>
													<Label className="mb-0 mr-1 small">
														{!allTabsStatus.overall ? "Expand All" : "Collapse All"}
													</Label>
													<FontAwesomeIcon
														icon={
															!allTabsStatus.overall ? faChevronDown : faChevronUp
														}
														fixedWidth
														className="mb-0 mr-3 medium"
													/>
												</Link>
											</Col>
										</Row>
									</CardHeader>
								</Card>
							</Container>
							<Container fluid={profile.IsTracker}>
								{profile.ProfileStatus === "99" ? (
									<Card className="ml-2 mr-2 mb-2">
										<CardBody>
											<p style={{ color: "red" }}>{profile.DecommissionNotes}</p>
										</CardBody>
									</Card>
								) : null}
								<Card className="ml-2 mr-2 mb-2">
									<CardHeader
										onClick={(e) =>
											setTabStatus({
												...allTabsStatus,
												projectDetails: !allTabsStatus.projectDetails,
											})
										}
									>
										<Row>
											<Col xs="11">
												<CardTitle className="mb-0">Project Details</CardTitle>
											</Col>
											<Col xs="1">
												<FontAwesomeIcon
													className="align-middle mr-2"
													icon={
														!allTabsStatus.projectDetails
															? faChevronRight
															: faChevronDown
													}
													fixedWidth
												/>
											</Col>
										</Row>
									</CardHeader>
									<Collapse isOpen={allTabsStatus.projectDetails}>
										<CardBody id="projectDetails">
											<Table responsive hover striped size="sm">
												{/*conditional format color of the results to colors - success danger */}
												<tbody>
													<tr>
														<td>Project Name</td>
														<td>{profile?.Project?.ProjectName}</td>
													</tr>
													<tr>
														<td>Project Number</td>
														<td>{profile?.Project?.ProjectId}</td>
													</tr>
													<tr>
														<td>Primary Nielsen Contact Email</td>
														<td>{profile?.Project?.ProposalOwnerEmail.value}</td>
													</tr>
													<tr>
														<td>Other Project Team Contacts</td>
														<td
															style={{ display: "flex", flexDirection: "column" }}
														>
															{profile &&
																profile.Project &&
																profile.Project.OtherProjectTeamContacts &&
																profile.Project.OtherProjectTeamContacts.length
																? profile.Project.OtherProjectTeamContacts.map(
																	(item) => {
																		return <span>{item.value}</span>;
																	}
																)
																: "No Contacts Available"}
														</td>
													</tr>
													<tr>
														<td>Syndicated Project</td>
														<td>{profile?.Project?.IsSyndicated ? "Yes" : "No"}</td>
													</tr>
													<tr>
														<td>Client Details</td>
														<td>
															<ul className="m-0 p-0 summary-client-details-list">
																{profile?.Project?.ContractDetails?.map((item) => {
																	return (
																		<li>
																			{item.AccountName}{" "}
																			{item.OpportunityNumber
																				? `- (${item.OpportunityNumber})`
																				: ""}
																		</li>
																	);
																})}
															</ul>
														</td>
													</tr>
													<tr>
														<td>Commissioning Office</td>
														<td>
															{getLabel(
																"OfficeOptions",
																profile?.Project?.CommissioningOffice
															)}
														</td>
													</tr>
													<tr>
														<td>Business Unit</td>
														<td>
															{getLabel(
																"BusinessUnitOptions",
																profile?.Project?.BusinessUnit
															)}
														</td>
													</tr>
													<tr>
														<td>Industry Vertical</td>
														<td>
															{getLabel(
																"VerticalOptions",
																profile?.Project?.IndustryVertical
															)}
														</td>
													</tr>
													<tr>
														<td>All Fielding Countries</td>
														<td
															style={{ display: "flex", flexDirection: "column" }}
														>
															{profile.FieldingCountries &&
																typeof profile.FieldingCountries == "string"
																? profile.FieldingCountries.split(",").map(
																	(item) => {
																		return (
																			<span>
																				{getLabel(
																					"FieldingCountriesOptions",
																					item
																				)}
																			</span>
																		);
																	}
																)
																: null}
														</td>
													</tr>
													<tr>
														<td>Methodologies</td>
														<td
															style={{ display: "flex", flexDirection: "column" }}
														>
															{profile?.Methodology?.split(",").map((item) => {
																return (
																	<span>
																		{getLabel("MethodologyOptions", item)}
																	</span>
																);
															})}
														</td>
													</tr>
													<tr>
														<td>Sub-Methodologies</td>
														<td
															style={{ display: "flex", flexDirection: "column" }}
														>
															{profile?.SubMethodology?.split(",").map((item) => {
																return (
																	<span>
																		{getLabel("SubMethodologyOptions", item)}
																	</span>
																);
															})}
														</td>
													</tr>
													<tr>
														<td>Tracker</td>
														<td>{profile?.IsTracker ? "Yes" : "No"}</td>
													</tr>
													<tr>
														<td>Tracking Frequency</td>
														<td>
															{profile?.TrackingFrequency
																? getLabel(
																	"TrackingFrequencyOptions",
																	profile?.TrackingFrequency
																)
																: "Not Applicable"}
														</td>
													</tr>
												</tbody>
											</Table>
										</CardBody>
									</Collapse>
								</Card>
								<Card className="ml-2 mr-2 mb-2">
									<CardHeader
										onClick={(e) =>
											setTabStatus({
												...allTabsStatus,
												methSummary: !allTabsStatus.methSummary,
											})
										}
									>
										<Row>
											<Col xs="11">
												<CardTitle className="mb-0">
													Methodologies &amp; Fieldwork Breakdown{" "}
													{profile.IsMultiCountry ? "(Per Country)" : ""}
												</CardTitle>
											</Col>
											{/* <Col xs="3">
												<Button
													size="sm"
													disabled={app.recordloading}
													onClick={(e) => {
														e.stopPropagation();
														dispatch(
															currentCostingActions.downloadPdf(
																"methodologiesBreakdown",
																"Methodologies",
																"Methodologies & Fieldwork Breakdown"
															)
														);
													}}
												>
													Download{" "}
													{app.recordloading ? (
														<Spinner size="small" color="#cccccc" />
													) : null}
												</Button>
											</Col> */}
											<Col xs="1">
												<FontAwesomeIcon
													className="align-middle mr-2"
													icon={
														!allTabsStatus.methSummary
															? faChevronRight
															: faChevronDown
													}
													fixedWidth
												/>
											</Col>
										</Row>
									</CardHeader>
									<Collapse isOpen={allTabsStatus.methSummary}>
										<CardBody id="methodologiesBreakdown">
											<Table responsive hover striped bordered={true} size="sm">
												{/* <thead>
                    <th>Methodology Specifiation</th>
                    {profile.CountrySpecs?.map((country) => ({
                      <th>
                         {getLabel(
                        "FieldingCountriesOptions",
                        country.CountryCode
                      )} 
                      </th>
                    }))}
                  </thead> */}
												<tbody>
													{_.head(profile.CountrySpecs)?.MethodologySpecs?.map(
														(ms) => {
															return (
																<>
																	<tr>
																		<th>
																			<h5 class="text-uppercase mb-0">
																				{ms.Label}
																			</h5>
																		</th>
																		{profile.CountrySpecs.map((country) => (
																			<th>
																				{ms.RFQSchema && ms.RFQSchema.properties &&
																					!Object.keys(
																						ms.RFQSchema.properties
																					).filter(
																						(prop) =>
																							ms.RFQSchema.properties[prop]
																								.isNewSection
																					).length
																					? getLabel(
																						"FieldingCountriesOptions",
																						country.CountryCode
																					)
																					: null}
																			</th>
																		))}
																	</tr>
																	{!ms.RFQSchemaNA ? (
																		//todo: test using required instead of order***
																		ms.RFQSchema.order.map((rfq) => {
																			let property = getProperty(ms.RFQSchema, rfq);
																			return property ? (
																				<>
																					{property.isNewSection ? (
																						<tr>
																							<th>{property.sectionTitle}</th>
																							{profile.CountrySpecs.map(
																								(country) => (
																									<th>
																										{getLabel(
																											"FieldingCountriesOptions",
																											country.CountryCode
																										)}
																									</th>
																								)
																							)}
																						</tr>
																					) : null}
																					<tr>
																						<td>{property.title}</td>
																						{profile.CountrySpecs.map((country) => (
																							<td>
																								{rfqData[country.CountryCode] &&
																									rfqData[country.CountryCode][
																									ms.Code
																									]
																									? Array.isArray(
																										rfqData[country.CountryCode][
																										ms.Code
																										][rfq]
																									)
																										? rfqData[country.CountryCode][
																											ms.Code
																										][rfq].join()
																										: typeof rfqData[
																											country.CountryCode
																										][ms.Code][rfq] == "boolean"
																											? rfqData[country.CountryCode][
																												ms.Code
																											][rfq]
																												? "Yes"
																												: "No"
																											: rfqData[country.CountryCode][
																												ms.Code
																											][rfq]
																												? rfqData[country.CountryCode][
																												ms.Code
																												][rfq]
																												: "-"
																									: "-"}
																							</td>
																						))}
																					</tr>
																				</>
																			) : null;
																		})
																	) : (
																			<tr>
																				<td>{ms.Label}</td>
																				<td>
																					No data is available for this methodology.
                                  </td>
																			</tr>
																		)}
																</>
															);
														}
													)}
												</tbody>
											</Table>
										</CardBody>
									</Collapse>
								</Card>
								<Card className="ml-2 mr-2 mb-2">
									<CardHeader
										onClick={(e) =>
											setTabStatus({
												...allTabsStatus,
												opsResources: !allTabsStatus.opsResources,
											})
										}
									>
										<Row>
											<Col xs="11">
												<CardTitle className="mb-0">
													Operations Resources Breakdown{" "}
													{profile.IsTracker ? "(Per Wave)" : ""}
												</CardTitle>
											</Col>
											<Col xs="1">
												<FontAwesomeIcon
													className="align-middle mr-2"
													icon={
														!allTabsStatus.opsResources
															? faChevronRight
															: faChevronDown
													}
													fixedWidth
												/>
											</Col>
										</Row>
									</CardHeader>
									<Collapse isOpen={allTabsStatus.opsResources}>
										<CardBody id="operationsResourceBreakdown">
											<Table responsive hover striped bordered={true} size="sm">
												<tbody>
													{_.head(profile.WaveSpecs)?.OpsResourcesSchema?.order.map(
														(ors) => {
															let property = getProperty(
																_.head(profile.WaveSpecs).OpsResourcesSchema,
																ors
															);
															return property ? (
																<>
																	{property.isNewSection ? (
																		<tr>
																			<th>{property.sectionTitle}</th>

																			{profile.WaveSpecs?.map((ws) => {
																				return (
																					<>
																						<th>
																							{profile.IsTracker ? (
																								<span>
																									# {ws.WaveNumber} {ws.WaveName}
																								</span>
																							) : (
																									<span>Specification</span>
																								)}
																						</th>
																					</>
																				);
																			})}
																		</tr>
																	) : null}
																	<tr>
																		<td>{property.title}</td>
																		{profile.WaveSpecs?.map((wave) => (
																			<td>
																				{opsData[wave.WaveNumber]
																					? getOpsValue(
																						opsData[wave.WaveNumber][ors],
																						ors
																					)
																					: "-"}
																			</td>
																		))}
																	</tr>
																</>
															) : null;
														}
													)}
												</tbody>
											</Table>
										</CardBody>
									</Collapse>
								</Card>
								{profile.ProfileSetting &&
									!profile.ProfileSetting.UsesOopOverrideIntCommCost ? (
										<Card className="ml-2 mr-2 mb-2">
											<CardHeader
												onClick={(e) =>
													setTabStatus({
														...allTabsStatus,
														clientServices: !allTabsStatus.clientServices,
													})
												}
											>
												<Row>
													<Col xs="11">
														<CardTitle className="mb-0">
															Commercial Time Breakdown{" "}
															{profile.IsTracker ? "(Per Wave)" : ""}
														</CardTitle>
													</Col>
													<Col xs="1">
														<FontAwesomeIcon
															className="align-middle mr-2"
															icon={
																!allTabsStatus.clientServices
																	? faChevronRight
																	: faChevronDown
															}
															fixedWidth
														/>
													</Col>
												</Row>
											</CardHeader>
											<Collapse isOpen={allTabsStatus.clientServices}>
												<CardBody>
													<div className="ml-auto mb-2">
														<Row>
															<Col lg-1 md-1 xs-12>
																<Label className="h5">Ratecard applied:</Label>
															</Col>
															<Col lg-7 m-17 xs-12>
																{/* <Input
                            type="select"
                            id="CSRateCardSelector"
                            name="CSRateCardSelector"
                            disabled
                          >
                            <option value="">Selected Ratecard Name</option>
                            <option value="default">Default</option>
                          </Input> */}
																<input
																	value={
																		profile.ProfileSetting?.CSRateCardUsed
																			?.ProfileName
																	}
																	className="form-control"
																	disabled
																/>
															</Col>
														</Row>
													</div>
													<div className="d-flex">
														<Table responsive hover striped bordered={true} size="sm">
															<thead>
																<tr>
																	<th>Hourly Chargeout Rate</th>
																	{bands.map((band) => (
																		<td>
																			{profile.ProfileSetting.CSRateCardUsed
																				? getCurrentCurrency(
																					profile.ProfileSetting.CSRateCardUsed[
																					rateCardReferences[band]
																					]
																				)
																				: getCurrentCurrency(0)}
																		</td>
																	))}
																</tr>
																<tr>
																	{profile.IsTracker ? <th>Wave</th> : <th></th>}
																	{bands.map((band) => (
																		<th>{band}</th>
																	))}
																</tr>
															</thead>
															<tbody>
																{/* {profile.IsTracker
                            ? */}
																{waveSpecs.map((wave) => {
																	// console.log("field");
																	// console.log(field);
																	return (
																		<tr>
																			<td>
																				#{wave.WaveNumber} {wave.WaveName}
																			</td>
																			{bands.map((band) => {
																				return (
																					<td>
																						{/* <Input
                                id={`${band}-${wave.WaveNumber}`}
                                type="number"
                                value={
                                  wave.CommercialHoursData[band]["Total"]
                                }
                              /> */}
																						{wave.CommercialHoursData
																							? wave.CommercialHoursData[band]
																								? wave.CommercialHoursData[band][
																								"Total"
																								]
																								: "-"
																							: "-"}
																					</td>
																				);
																			})}
																		</tr>
																	);
																})}
																{/* // : null} */}
															</tbody>
															<tfoot style={{ borderTop: "2px solid #dee2e6" }}>
																<tr>
																	<th>Hours by Band</th>
																	{bands.map((band) => {
																		return (
																			<td>
																				{_.sum(
																					waveSpecs.map((ws) => {
																						if (ws.CommercialHoursData) {
																							if (ws.CommercialHoursData[band])
																								return ws.CommercialHoursData[band][
																									"Total"
																								];
																							else return 0;
																						} else return 0;
																					})
																				)}
																			</td>
																		);
																	})}
																</tr>
																{/* <tr>
                        <th>Cost by Band</th>
                        {bands.map((band) => (
                          <td>0.00 USD</td>
                        ))}
                      </tr> */}
																<tr>
																	<th>Total Hours</th>
																	<td>
																		{_.sum(
																			bands.map((band) => {
																				let sum = 0;
																				_.sum(
																					waveSpecs.map((ws) => {
																						if (ws.CommercialHoursData) {
																							if (ws.CommercialHoursData[band])
																								sum =
																									sum +
																									ws.CommercialHoursData[band][
																									"Total"
																									];
																						}
																					})
																				);
																				return sum;
																			})
																		)}
																	</td>

																	{/* <th>Total Cost</th>
                        <td>0.00 USD</td> */}
																</tr>
															</tfoot>
														</Table>
													</div>
												</CardBody>
											</Collapse>
										</Card>
									) : null}

								<Card className="ml-2 mr-2 mb-2">
									<CardHeader
										onClick={(e) =>
											setTabStatus({
												...allTabsStatus,
												costBreakdown: !allTabsStatus.costBreakdown,
											})
										}
									>
										<Row>
											<Col xs="8">
												<CardTitle className="mb-0">
													Total Cost Breakdown{" "}
													{profile.IsMultiCountry ? "(Per Country)" : ""}
												</CardTitle>
											</Col>
											<Col xs="3">
												<a
													className="cost-breakdown-link"
													onClick={(e) => {
														e.stopPropagation();
														openCostBreakdown(true);
													}}
												>
													View Cost Breakdown
                    </a>
											</Col>
											<Col xs="1">
												<FontAwesomeIcon
													className="align-middle mr-2"
													icon={
														!allTabsStatus.costBreakdown
															? faChevronRight
															: faChevronDown
													}
													fixedWidth
												/>
											</Col>
										</Row>
									</CardHeader>
									<Collapse isOpen={allTabsStatus.costBreakdown}>
										<CardBody id="totalCostbreakdown">
											<Table responsive hover striped bordered={true} size="sm">
												<thead>
													<th>Component</th>
													<th>Total</th>
													{/*for total col above, use costing profile level fields with same labels. Always show total columm, but only show country columns if multicountry */}
													{profile.IsMultiCountry
														? profile.CountrySpecs.map((cs) => (
															<th>
																{getLabel(
																	"FieldingCountriesOptions",
																	cs.CountryCode
																)}
															</th>
														))
														: null}
												</thead>

												{Object.keys(costFields)?.map((cf) => {
													return (
														<tbody>
															{/* <tr>
                          <th>
                            {costlabels[cf]
                            .toLowerCase()
                              .replace("total", "")
                              .trim()}
                          </th>
                          {profile.CountrySpecs?.map((cs) => (
                            <td></td>
                          ))}
                        </tr> */}
															{/* {alternativeLabels[cf] ? console.log(_.head(Object.values(alternativeLabels[cf]))) : ""} */}

															{alternativeLabels[cf] &&
																Object.keys(alternativeLabels[cf]).filter(
																	(al) => profile.ProfileSetting[al]
																).length ? (
																	<tr>
																		<td>
																			Breakdown Not Available - Using OOP % Multiplier
                              </td>
																		<td>
																			{profile.ProfileSetting[
																				_.head(Object.values(alternativeLabels[cf]))
																			] * 100}{" "}
                                %
                              </td>
																	</tr>
																) : costFields[cf].length ? (
																	costFields[cf]?.map((ccf) => (
																		<tr>
																			<td>{costlabels[ccf]}</td>
																			<td>
																				{getCurrentCurrency(
																					profile[ccf],
																					profile.CostInputCurrency
																				)}
																			</td>
																			{/* temp dummy col, later to get values from profile */}
																			{profile.IsMultiCountry
																				? profile.CountrySpecs.map((cs) => (
																					<td>
																						{getCurrentCurrency(
																							cs[ccf],
																							cs.CostInputCurrency
																						)}{" "}
																					</td>
																				))
																				: null}
																		</tr>
																	))
																) : (
																		<>
																			{Object.keys(costIntCommLabels).map((cicl) => (
																				<tr>
																					<td>{costIntCommLabels[cicl]}</td>
																					<td>
																						{getCurrentCurrency(
																							profile[cicl],
																							profile.CostInputCurrency
																						)}
																					</td>
																					{/* {profile.CountrySpecs &&
                                profile.CountrySpecs.length > 1
                                  ? profile.CountrySpecs.map((cs) => (
                                      <td>NA</td>
                                    ))
                                  : null} */}
																				</tr>
																			))}
																		</>
																	)}
															{alternativeLabels[cf] &&
																Object.keys(alternativeLabels[cf]).filter(
																	(al) => profile.ProfileSetting[al]
																).length ? (
																	<tr className="text-uppercase">
																		<th>{costlabels[cf]}</th>
																		<th>
																			{getCurrentCurrency(
																				profile.CostTotalExternalOperations *
																				profile.ProfileSetting[
																				_.head(
																					Object.values(alternativeLabels[cf])
																				)
																				]
																			)}
																		</th>
																	</tr>
																) : (
																	<tr className="text-uppercase">
																		<th>{costlabels[cf]}</th>
																		<th>
																			{getCurrentCurrency(
																				profile[cf],
																				profile.CostInputCurrency
																			)}
																		</th>
																		{profile.IsMultiCountry &&
																			cf != "CostTotalInternalCommercial"
																			? profile.CountrySpecs.map((cs) => (
																				<th>
																					{getCurrentCurrency(
																						cs[cf],
																						cs.CostInputCurrency
																					)}
																				</th>
																			))
																			: null}
																	</tr>
																)}
														</tbody>
													);
												})}
											</Table>
										</CardBody>
									</Collapse>
								</Card>
								<Card className="ml-2 mr-2 mb-2">
									<CardHeader
										onClick={(e) =>
											setTabStatus({
												...allTabsStatus,
												profOverview: !allTabsStatus.profOverview,
											})
										}
									>
										<Row>
											<Col xs="11">
												<CardTitle className="mb-0">
													Profitability Overview
                    </CardTitle>
											</Col>
											<Col xs="1">
												<FontAwesomeIcon
													className="align-middle mr-2"
													icon={
														!allTabsStatus.profOverview
															? faChevronRight
															: faChevronDown
													}
													fixedWidth
												/>
											</Col>
										</Row>
									</CardHeader>
									<Collapse isOpen={allTabsStatus.profOverview}>
										<CardBody>
											<div id="profitabilityBreakdown">
												<Table responsive hover striped bordered={true} size="sm">
													<tbody>
														<tr>
															<td xs="11">Total Internal Operations Cost</td>
															<td xs="1">
																{getCurrentCurrency(
																	profile.CostTotalInternalOperations
																)}
															</td>
														</tr>
														<tr>
															<td xs="11">
																Total External Operations / OOP / Third Party Cost
                        </td>
															<td xs="1">
																{getCurrentCurrency(
																	profile.CostTotalExternalOperations
																)}
															</td>
														</tr>
														<tr>
															<td xs="11">Total Internal Commercial Cost</td>
															<td xs="1">
																{getCurrentCurrency(
																	profile.CostTotalInternalCommercial
																)}
															</td>
														</tr>
														<tr>
															<td xs="11">Total External Commercial Cost</td>
															<td xs="1">
																{getCurrentCurrency(
																	profile.CostTotalExternalCommercial
																)}
															</td>
														</tr>
														<tr>
															<td xs="11">
																Overheads{" "}
																{profile.ProfileSetting?.PercentOverhead * 100}%
                        </td>
															<td xs="1">{getCurrentCurrency(profile.Overheads)}</td>
														</tr>
														<tr>
															<td xs="11">
																Markup to get{" "}
																{profile.ProfileSetting
																	? profile.ProfileSetting.UsesOOPMarkUp
																		? profile.ProfileSetting.TargetPercentOOPMarkUp *
																		100
																		: profile.ProfileSetting
																			.TargetPercentContributionMargin * 100
																	: ""}
                          %{" "}
																{profile.ProfileSetting?.UsesOOPMarkUp
																	? "OOP"
																	: "Contribution Margin"}
															</td>
															<td xs="1">{getCurrentCurrency(profile.Markup)}</td>
														</tr>
														<tr>
															<td xs="11">
																%Margin
															</td>
															<td xs="1">
																{/* = (Internal Costs+ External Costs)/Price to ClientX100 */}
																{
																	_.round(((_.round(profile.TotalInternalCosts, 2) + _.round(profile.TotalExternalCosts, 2)) / profile.PriceToClient) * 100, 2)
																}%</td>
														</tr>
													</tbody>
													<tfoot style={{ borderTop: "2px solid #dee2e6" }}>
														<th xs="11">Minimum Recommended Price to Client</th>
														<th xs="1">
															{getCurrentCurrency(profile.RecommendedPrice)}
														</th>
													</tfoot>
												</Table>
											</div>
											<div id="profitabilityChecksBreakdown">
												{profile.ProfileStatus > 1 ? (
													<Table responsive hover striped bordered={true} size="sm">
														{/*conditional format color of the results to colors - success danger */}
														<thead>
															<th>Profitability Checks</th>
															<th>Target</th>
															<th>Current</th>
														</thead>
														<tbody>
															{profile.ApprovalDetails ? (
																profile.ApprovalDetails[0] ? (
																	<>
																		{profile.ProfileSetting
																			?.NeedsOutOfPocketCostCheck && (
																				<tr>
																					<td xs="6">Operations Out of Pocket %</td>
																					<td xs="3">{getOOPThresholdText()}</td>
																					<td
																						xs="3"
																						className={getTextColor(
																							profile.CheckPassedOutOfPocket
																						)}
																					>
																						{profile.OutOfPocketCostPercent
																							? (
																								profile.OutOfPocketCostPercent * 100
																							).toFixed(2) + "%"
																							: null}
																					</td>
																				</tr>
																			)}
																	</>
																) : null
															) : null}
															{profile.ProfileSetting?.NeedsCommercialCostCheck && (
																<tr>
																	<td xs="11">Commercial Cost %</td>
																	<td xs="3">
																		{profile.ProfileSetting
																			.ThresholdPercentIntCommCost * 100}
                              % or more
                            </td>
																	<td
																		xs="3"
																		className={getTextColor(
																			profile.CheckPassedCommercialCost
																		)}
																	>
																		{profile.InternalCommercialCostPercent
																			? (
																				profile.InternalCommercialCostPercent * 100
																			).toFixed(2) + "%"
																			: "0%"}
																	</td>
																</tr>
															)}
															{profile.ProfileSetting?.NeedsNetRevenueCheck && (
																<tr>
																	<td xs="11">Net Revenue %</td>
																	<td xs="3">
																		{profile.ProfileSetting
																			.ThresholdPercentNetRevenue * 100}
                              % or more
                            </td>
																	<td
																		xs="3"
																		className={getTextColor(
																			profile.CheckPassedNetRevenue
																		)}
																	>
																		{profile.NetRevenuePercent
																			? (profile.NetRevenuePercent * 100).toFixed(2) +
																			"%"
																			: null}
																	</td>
																</tr>
															)}
															{profile.ProfileSetting
																?.NeedsContributionMarginCheck && (
																	<tr>
																		<td xs="11">Minimum Contribution Margin %</td>
																		<td xs="3">
																			{profile.ProfileSetting
																				.TargetPercentContributionMargin * 100}
                              % or more
                            </td>
																		<td
																			xs="3"
																			className={getTextColor(
																				profile.CheckPassedContributionMargin
																			)}
																		>
																			{profile.ContributionMarginPercent
																				? (
																					profile.ContributionMarginPercent * 100
																				).toFixed(2) + "%"
																				: null}
																		</td>
																	</tr>
																)}
															{profile.ProfileSetting
																?.NeedsMinimumProjectValueCheck && (
																	<tr>
																		<td xs="11">
																			Minimum Project Value (Price to Client)
                            </td>
																		<td xs="3">
																			{getActualPrice(
																				profile.ProfileSetting.ThresholdPriceToClient,
																				true
																			)}
																		</td>
																		<td
																			xs="3"
																			className={getTextColor(
																				profile.CheckPassedMinimumProjectValue
																			)}
																		>
																			{getActualPrice(profile.PriceToClient, true)}
																		</td>
																	</tr>
																)}
														</tbody>
													</Table>
												) : (
														<div className="text-right">
															<strong>Please Input Price to Client</strong>
														</div>
													)}
											</div>
										</CardBody>
									</Collapse>
								</Card>
								<Card className="ml-2 mr-2 mb-2">
									<CardHeader>
										<Row className="d-flex justify-content-between">
											<Col
												xs="12"
												lg="3"
												md="3"
												sm="12"
												className="align-self-center mt-1 mb-1"
											>
												<CardTitle className="mb-0">
													Actual Price Given To Client
                    </CardTitle>
											</Col>
											<Col
												xs="12"
												lg="9"
												md="9"
												sm="12"
												className="align-self-center"
											>
												<Row className="d-flex justify-content-end">
													<Col
														xs="12"
														lg="6"
														md="6"
														sm="12"
														className="align-self-center mt-1 mb-1"
													>
														<Select
															isDisabled={profile.ProfileStatus > 1}
															placeholder="Select a Currency..."
															options={currencies?.map((c) => {
																return {
																	value: `${c.Code}-${c.CurrencyUnit}`,
																	label: `${c.Label} (1USD = ${c.ConversionRateToLocal}${c.CurrencyUnit})`,
																};
															})}
															value={
																profile.CostInputCurrency
																	? getCurrentCurrencyUnit(
																		profile.CostInputCurrency
																	)
																	: null
															}
															onChange={summaryCurrencyChange}
														/>
													</Col>
													<Col
														xs="12"
														lg="4"
														md="4"
														sm="12"
														className="align-self-center mt-1 mb-1"
													>
														<InputGroup className="m-0">
															<Input
																disabled={profile.ProfileStatus > 1}
																type="number"
																placeholder="Enter Amount..."
																value={
																	profile.PriceToClient
																		? getActualPrice(profile.PriceToClient)
																		: null
																}
																onChange={(e) => {
																	dispatch(
																		currentCostingActions.updateProfile({
																			PriceToClient:
																				e.target.value /
																				currentCurrency.ConversionRateToLocal,
																		})
																	);
																}}
															></Input>
															<InputGroupAddon addonType="append">
																{getCurrencyUnit(profile.CostInputCurrency)}
															</InputGroupAddon>
														</InputGroup>
													</Col>

													<Col
														xs="12"
														lg="2"
														md="2"
														sm="12"
														className="align-self-center mt-1 mb-1"
													>
														<Button
															disabled={
																profile.ProfileStatus > 1 ||
																profile.IsImportedProfile
															}
															onClick={(e) => {
																if (!profile.IsImportedProfile)
																	dispatch(
																		currentCostingActions.generateProfitability(
																			profile.PriceToClient
																		)
																	);
																else e.preventDefault();
															}}
														>
															Check Profitability
                        </Button>
													</Col>
												</Row>
											</Col>
										</Row>
									</CardHeader>
								</Card>
								{profile.ApprovalLevelNeeded != -1 &&
									profile.ApprovalLevelNeeded != null ? (
										<Card className="ml-2 mr-2 mb-2">
											<CardHeader
												onClick={(e) =>
													setTabStatus({
														...allTabsStatus,
														approvals: !allTabsStatus.approvals,
													})
												}
											>
												<Row>
													<Col xs="11">
														<CardTitle className="mb-0">Approvals</CardTitle>
													</Col>
													<Col xs="1">
														<FontAwesomeIcon
															className="align-middle mr-2"
															icon={
																!allTabsStatus.approvals
																	? faChevronRight
																	: faChevronDown
															}
															fixedWidth
														/>
													</Col>
												</Row>
											</CardHeader>

											<Collapse isOpen={allTabsStatus.approvals}>
												<CardBody>
													{profile.ApprovalDetails
														? profile.ApprovalDetails.map((level) => {
															if (level.Order <= profile.ApprovalLevelNeeded) {
																return (
																	<>
																		<Row>
																			<Col>{level.Label}</Col>
																			<Col>
																				<span>
																					{profile.ApprovalLevelReached >=
																						level.Order
																						? "Approved"
																						: profile.ApprovalLevelAwaiting ===
																							level.Order
																							? "Awaiting"
																							: null}
																				</span>
																			</Col>
																		</Row>
																		<br />
																		<Col>
																			{level.ApproverContacts?.map((contact) => {
																				return (
																					<Row>
																						<Col>
																							{contact.Approved ? (
																								<FontAwesomeIcon
																									icon={faThumbsUp}
																									className="text-muted align-middle mr-2"
																									title="Appproval Granted"
																									size="sm"
																								/>
																							) : // <CheckSquare
																								// 	title="Appproval Granted"
																								// 	size={18}
																								// 	className="align-middle mr-2"
																								// />
																								contact.Denied ? (
																									// <XSquare
																									// 	title="Appproval Denied"
																									// 	size={18}
																									// 	className="align-middle mr-2"
																									//   />
																									<FontAwesomeIcon
																										icon={faThumbsDown}
																										title="Appproval Denied"
																										className="text-muted align-middle mr-2"
																										size="sm"
																									/>
																								) : (
																										<FontAwesomeIcon
																											icon={faHourglassHalf}
																											title="Appproval Awaited"
																											className="text-muted align-middle mr-2"
																											size="sm"
																										/>
																										// <Square
																										// 	title="Appproval Awaited"
																										// 	size={18}
																										// 	className="align-middle mr-2"
																										// />
																									)}
																							{contact.EmailAddress}
																							{contact.IsMandatoryApprover ? (
																								// <Users
																								// 	title="Mandatory Approver for this level."
																								// 	size={18}
																								// 	className="align-middle ml-2"
																								// />
																								<FontAwesomeIcon
																									icon={faExclamationCircle}
																									title="Mandatory Approver for this level."
																									className="text-muted align-middle ml-2"
																									size="sm"
																								/>
																							) : null}
																						</Col>
																					</Row>
																				);
																			})}
																		</Col>
																		<br />
																	</>
																);
															}
														})
														: null}
													<Row className="mb-2">
														<Col>Approval Request Justification</Col>
													</Row>
													<Row className="mb-2">
														<Col>
															<Input
																id="approvalJustification"
																type="textarea"
																className="mb-2"
																value={profile.ApprovalJustification}
																onChange={(e) => {
																	dispatch(
																		currentCostingActions.updateProfile({
																			ApprovalJustification: e.target.value,
																		})
																	);
																}}
																disabled={profile.ProfileStatus > 2}
																placeholder="Please provide a brief explanation for the approvers..."
															/>
															{invalid.ApprovalJustification ? (
																<span style={{ color: "red" }}>
																	Please enter a justification
																</span>
															) : null}
														</Col>
													</Row>
													<Row className="justify-content-end">
														<Button
															className="mr-2"
															onClick={(e) =>
																dispatch(currentCostingActions.resetApprovals())
															}
														>
															Reset Approvals
                      </Button>
														<Button
															disabled={profile.ProfileStatus > 2}
															onClick={(e) => {
																if (
																	profile.ApprovalJustification &&
																	profile.ApprovalJustification.trim().length > 0
																) {
																	setInvalid({
																		...invalid,
																		ApprovalJustification: false,
																	});
																	dispatch(currentCostingActions.sendForApproval());
																} else {
																	setInvalid({
																		...invalid,
																		ApprovalJustification: true,
																	});
																}
															}}
														>
															Send For Approval
                      </Button>
													</Row>
													{/* {profile.ProfileStatus === "3" ? ( */}
													<>
														<Row className="mb-2">
															<Col>Approver's Notes</Col>
														</Row>
														<Row className="mb-2">
															<Col>
																<Input
																	disabled={!userRecord.IsCostingApprover}
																	id="approversNotes"
																	type="textarea"
																	className="mb-2"
																	value={profile.ApprovalNotes}
																	onChange={(e) => {
																		dispatch(
																			currentCostingActions.updateProfile({
																				ApprovalNotes: e.target.value,
																			})
																		);
																	}}
																	placeholder="Please provide your comments if any..."
																/>
															</Col>
														</Row>
														{userRecord.IsCostingApprover ? (
															<Row className="justify-content-end">
																{userRecord.CanBypassApprovals ? (
																	<Button
																		// className="ml-2"
																		onClick={() => {
																			setIsOpen({
																				...isOpen,
																				ModalBypass: !isOpen.ModalBypass,
																			});
																		}}
																	>
																		Bypass Approval
																	</Button>
																) : null}

																<Button
																	className="ml-2"
																	onClick={(e) =>
																		dispatch(currentCostingActions.deny())
																	}
																>
																	Deny
                          </Button>

																<Button
																	className="ml-2"
																	onClick={(e) =>
																		dispatch(currentCostingActions.approve())
																	}
																>
																	Approve
                          </Button>
															</Row>
														) : null}
													</>
													{/* ) : null} */}
												</CardBody>
											</Collapse>
										</Card>
									) : null}
								<ModalCommissioning
									setIsOpen={setIsOpen}
									isOpen={isOpen}
									toggle={() => {
										setIsOpen({
											...isOpen,
											ModalCommissioning: !isOpen.ModalCommissioning,
										});
									}}
								/>
								<ModalPostCommission
									isOpen={isOpen}
									toggle={() => {
										setIsOpen({
											...isOpen,
											ModalPostCommission: !isOpen.ModalPostCommission,
										});
									}}
								/>
								<ModalBypass
									isOpen={isOpen}
									toggle={() => {
										setIsOpen({
											...isOpen,
											ModalBypass: !isOpen.ModalBypass,
										});
									}}
								/>
								<ModalDecommissioning
									isOpen={isOpen}
									toggle={() => {
										setIsOpen({
											...isOpen,
											ModalDecommissioning: !isOpen.ModalDecommissioning,
										});
									}}
								/>
								<Modal
									isOpen={isCostBDOpen}
									size="lg"
									toggle={() => openCostBreakdown(!isCostBDOpen)}
								>
									<ModalHeader toggle={() => openCostBreakdown(!isCostBDOpen)}>
										Cost Breakdown
              </ModalHeader>
									<ModalBody>
										<CostBreakDown />
									</ModalBody>
									<ModalFooter>
										<Row className="justify-content-end">
											<Button
												size="sm"
												color="secondary"
												onClick={() => openCostBreakdown(!isCostBDOpen)}
											>
												Close
                  </Button>
										</Row>
									</ModalFooter>
								</Modal>
								<Modal toggle={() => {
									openDownloadModal(false);
									setSelectedProperties([])
								}} isOpen={downloadModal}>
									<ModalHeader toggle={() => {
										openDownloadModal(false);
										setSelectedProperties([])
									}}>
										Select Sections to be Downloaded
                  </ModalHeader>
									<ModalBody>
										<Row className="m-0 justify-content-end">
											<a className="mr-1 select-link" onClick={() => setSelectedProperties(allDownloadProps.map(adp => adp.value))}>Select all</a>
											<a className="ml-1 select-link" onClick={() => setSelectedProperties([])}>Deselect all</a>
										</Row>
										<ul>
											{allDownloadProps.map(adp => {
												return <li><span><input type="checkbox"
													checked={_.includes(selectedProperties, adp.value)}
													id={adp.value} value={adp.value} onChange={(e) => {
														if (e.target.checked) {
															let selectedproperties = selectedProperties
															selectedproperties.push(e.target.value)
															setSelectedProperties([...selectedproperties])
														} else {
															let selectedproperties = selectedProperties.filter(val => val != e.target.value)
															setSelectedProperties([...selectedproperties])
														}
													}} /><label className="ml-2 pointer" for={adp.value}>{adp.label}</label></span></li>
											})}
										</ul>
									</ModalBody>
									<ModalFooter>
										<Row>
											<div className="d-flex text-nowrap"> <strong className="mt-1 mr-1">Format to download: </strong>
												<select className="form-control"
													defaultValue={downloadType}
													onChange={(e) => setDownloadType(e.target.value)}>
													<option value="SHEET">Sheet</option>
													<option value="PDF">PDF</option>
												</select></div>
										</Row>
										<Button
											disabled={!selectedProperties.length}
											onClick={(e) => {
												if (selectedProperties.length) {
													if (downloadType == "SHEET")
														downloadInSheets()
													else if (downloadType == "PDF")
														dispatch(currentCostingActions.downloadInPdf(selectedProperties, currentCurrency))
													// setSelectedProperties([])
												}
											}}>Download {app.recordloading ? (
												<Spinner size="small" className="ml-2" color="#cccccc" />
											) : null}</Button>
									</ModalFooter>
								</Modal>
							</Container>
							<Container className="d-flex mt-4 mr-2 justify-content-end">
								{/* <Button
                //move this functionality to actions commission button
                disabled={app.recordloading}
                onClick={() => {
                  console.log(isOpen);
                  setIsOpen({
                    ...isOpen,
                    ModalCommissioning: !isOpen.ModalCommissioning,
                  });
                }}
                className="mr-2"
              >
                Commission Costing
            </Button> */}{" "}
								{/* <Button className="mr-2" onClick={() => {
									openDownloadModal(true)
								}}>
									Download Summary
                </Button> */}
								<Button
									color="primary"
									disabled={app.recordloading || profile.IsImportedProfile}
									// onClick={submitCostingProfile}
									onClick={(e) => {
										if (!profile.IsImportedProfile)
											dispatch(
												currentCostingActions.saveCostingProfile({
													...profile,
													ProfileSetting: {
														...profile.ProfileSetting,
														CurrenciesData: currencies,
													},
												})
											);
										else e.preventDefault();
									}}
								>
									Save
            </Button>
								{app.recordloading ? (
									<Spinner size="small" color="#495057" />
								) : null}
							</Container>
							<Container className="d-flex justify-content-center">
								<Badge href="#" color="secondary">
									Back to top ↑
            </Badge>
							</Container>
						</>
					)}
		</Layout>
	) : (
			<></>
		);
};

export default Summary;

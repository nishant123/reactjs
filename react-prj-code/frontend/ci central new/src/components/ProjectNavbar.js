import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import * as userActions from "../redux/actions/userActions";
import * as currentProjectActions from "../redux/actions/currentProjectActions";
import * as currentCostingActions from "../redux/actions/currentCostingActions";
import update from "immutability-helper";
import RequestCreate from "../components/RequestCreate/RequestCreate";
import axios from "../axios-interceptor";
import { useHistory, useLocation } from "react-router-dom";
import _ from "lodash";
import {
	Collapse,
	Navbar,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Form,
	Row,
	Col,
	InputGroup,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Container,
	Button,
	UncontrolledButtonDropdown,
	Badge,
	Label,
} from "reactstrap";

import { Settings, User } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

import avatar1 from "../assets/img/avatars/nielsen-logo.png";
import { toastr } from "react-redux-toastr";
import ModalCommissioning from "../pages/summary/ModalCommissioning";
import ModalPostCommission from "../pages/summary/ModalPostCommission";
import ModalDecommissioning from "../pages/summary/ModalDecommissioning";
import {
	pageLoadEnd,
	pageLoadStart,
	recordLoadEnd,
	recordLoadStart,
	setCostingStatus,
} from "../redux/actions/appActions";
import Spinner from "../components/Spinner";
import { getLabel } from "../utils/codeLabels";
const alasql = window.alasql;

const NavbarComponent = (props) => {
	const project = useSelector(
		({ currentProject }) => currentProject.newProject
	);
	const currentCostingProfile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);

	const costingStatus = useSelector(({ app }) => app.costingStatus);
	const app = useSelector(({ app }) => app);
	const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs);

	const [editableProjectName, setEditableProjectName] = useState(false);
	const [editableCostingName, setEditableCostingName] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isCommissionOpen, setCommissionOpen] = useState({});
	const [notes, setNotes] = useState("");
	const [isOpenRequest, setIsOpenRequest] = useState(false);
	const [showCostMethod, setShowCostMethod] = useState(false);
	const [salesForceModal, openSaleForceModal] = useState(false);
	//download summary- start
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const [calledCurrencies, setCalledCurrencies] = useState(false);
	const [rfqData, setRfqData] = useState({});
	const [opsData, setOpsData] = useState({});
	const [costFields, setCostFields] = useState({});
	const [downloadModal, openDownloadModal] = useState(false);
	const [selectedProperties, setSelectedProperties] = useState([]);
	const [bands, setBands] = useState([]);
	const [schema, setSchema] = useState({});

	useEffect(() => {
		if (
			!Object.keys(schema).length &&
			currentCostingProfile &&
			currentCostingProfile.ProfileSetting &&
			currentCostingProfile.ProfileSetting.CommercialHoursSchema
		) {
			setSchema(currentCostingProfile.ProfileSetting.CommercialHoursSchema);
			setBands(
				currentCostingProfile.ProfileSetting.CommercialHoursSchema.bands
			);
		}
	}, [currentCostingProfile]);
	const [allDownloadProps, setAllDownloadProps] = useState([
		{
			value: "projectDetails",
			label: "Project Details",
		},
		{
			value: "methodology",
			label: "Methodologies",
		},
		{
			value: "opsresources",
			label: "Operation Resources",
		},
		{
			value: "commercialbreakdown",
			label: "Commercial Time Breakdown",
		},
		{
			value: "costbreakdown",
			label: "Total Cost Breakdown",
		},
		{
			value: "profitability",
			label: "Profitability Overview",
		},
		{
			value: "profitabilitychecks",
			label: "Profitability Checks",
		},
	]);
	useEffect(() => {
		let alldownloadprops = [...allDownloadProps];
		if (!(currentCostingProfile.ProfileStatus > 1)) {
			alldownloadprops = alldownloadprops.filter(
				(adp) => adp.value != "profitabilitychecks"
			);
		}
		if (
			currentCostingProfile.ProfileSetting &&
			currentCostingProfile.ProfileSetting.UsesOopOverrideIntCommCost
		) {
			alldownloadprops = alldownloadprops.filter(
				(adp) => adp.value != "commercialbreakdown"
			);
		}
		setAllDownloadProps(alldownloadprops);
	}, [currentCostingProfile]);
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
	const getOOPThresholdText = () => {
		if (currentCostingProfile.ApprovalLevelNeeded === -1) {
			return `${currentCostingProfile.ApprovalDetails[0]
				.ThresholdOutOfPocketPercentage * 100
				} % or less (Price To Client > ${getActualPrice(
					currentCostingProfile.ApprovalDetails[0].ThresholdRevenueAmount,
					true
				)})`;
		} else {
			let index = currentCostingProfile.ApprovalLevelNeeded;
			return `${currentCostingProfile.ApprovalDetails[index]
				.ThresholdOutOfPocketPercentage * 100
				} % or less (P2C > ${getActualPrice(
					currentCostingProfile.ApprovalDetails[index].ThresholdRevenueAmount,
					true
				)})`;
		}
	};
	useEffect(() => {
		let finalCostFields = {};

		_.head(currentCostingProfile.CountrySpecs)?.MethodologySpecs.map((ms) => {
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
	}, [currentCostingProfile]);
	useEffect(() => {
		if (
			currentCostingProfile &&
			rfqData &&
			!Object.keys(rfqData).length &&
			currentCostingProfile.CountrySpecs
		) {
			let finalData = {};
			currentCostingProfile.CountrySpecs.map((cs) => {
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
			currentCostingProfile.WaveSpecs.map((ws) => {
				opsFinal[ws.WaveNumber] = ws.OpsResourcesData;
			});
			setOpsData(opsFinal);
		}
	}, [currentCostingProfile]);
	const [currentCurrency, setCurrentCurrency] = useState({});
	const currencies = useSelector(({ currentCosting }) =>
		currentCosting.currentCostingProfile.ProfileSetting &&
			currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
			? currentCosting.currentCostingProfile.ProfileSetting.CurrenciesData
			: []
	);
	useEffect(() => {
		if (
			!currencies &&
			currentCostingProfile &&
			currentCostingProfile.ProfileSetting &&
			Object.keys(currentCostingProfile.ProfileSetting).length
		) {
			if (
				!calledCurrencies &&
				!currentCostingProfile.ProfileSetting.CurrenciesData
			) {
				setCalledCurrencies(true);
				dispatch(
					currentCostingActions.setCurrencies(() => setCalledCurrencies(false))
				);
			}
		}
	}, [currentCostingProfile]);
	useEffect(() => {
		if (currentCostingProfile && currentCostingProfile.CostInputCurrency) {
			let values = currentCostingProfile.CostInputCurrency.split("-");
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
	}, [currentCostingProfile, currencies]);
	const [downloadType, setDownloadType] = useState("SHEET");
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
	const getCurrentCurrency = (actualvalue, currencyvalue, onlyCurrency) => {
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
	};
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
	const downloadInSheets = () => {
		var opts = [];
		var allTabs = [];
		dispatch(recordLoadStart());
		if (_.includes(selectedProperties, "projectDetails")) {
			opts.push({ sheetid: "Project Details", header: true });
			let data = [];
			data.push({
				Detail: "Project Name",
				Value: currentCostingProfile?.Project?.ProjectName,
			});
			data.push({
				Detail: "Project Number",
				Value: currentCostingProfile?.Project?.ProjectId,
			});
			data.push({
				Detail: "Primary Nielsen Contact Email",
				Value: currentCostingProfile?.Project?.ProposalOwnerEmail.value,
			});
			data.push({
				Detail: "Other Project Team Contacts",
				Value:
					currentCostingProfile &&
						currentCostingProfile.Project &&
						currentCostingProfile.Project.OtherProjectTeamContacts &&
						currentCostingProfile.Project.OtherProjectTeamContacts.length
						? currentCostingProfile.Project.OtherProjectTeamContacts.map(
							(item) => {
								return item.value;
							}
						).join()
						: "No Contacts Available",
			});
			data.push({
				Detail: "Syndicated Project",
				Value: currentCostingProfile?.Project?.IsSyndicated ? "Yes" : "No",
			});
			data.push({
				Detail: "Client Details",
				Value: currentCostingProfile?.Project?.ContractDetails?.map((item) => {
					return `${item.AccountName} ${item.OpportunityNumber ? `- (${item.OpportunityNumber})` : ""
						}`;
				}).join(),
			});
			data.push({
				Detail: "Commissioning Office",
				Value: getLabel(
					"OfficeOptions",
					currentCostingProfile?.Project?.CommissioningOffice
				),
			});
			data.push({
				Detail: "Business Unit",
				Value: getLabel(
					"BusinessUnitOptions",
					currentCostingProfile?.Project?.BusinessUnit
				),
			});
			data.push({
				Detail: "Industry Vertical",
				Value: getLabel(
					"VerticalOptions",
					currentCostingProfile?.Project?.IndustryVertical
				),
			});
			data.push({
				Detail: "All Fielding Countries",
				Value:
					currentCostingProfile.FieldingCountries &&
						typeof currentCostingProfile.FieldingCountries == "string"
						? currentCostingProfile.FieldingCountries.split(",")
							.map((item) => {
								return getLabel("FieldingCountriesOptions", item);
							})
							.join()
						: "-",
			});
			data.push({
				Detail: "Methodologies",
				Value: currentCostingProfile?.Methodology?.split(",")
					.map((item) => {
						return getLabel("MethodologyOptions", item);
					})
					.join(),
			});
			data.push({
				Detail: "Sub-Methodologies",
				Value: currentCostingProfile?.SubMethodology?.split(",")
					.map((item) => {
						return getLabel("SubMethodologyOptions", item);
					})
					.join(),
			});
			data.push({
				Detail: "Tracker",
				Value: currentCostingProfile?.IsTracker ? "Yes" : "No",
			});
			data.push({
				Detail: "Tracking Frequency",
				Value: currentCostingProfile?.TrackingFrequency
					? getLabel(
						"TrackingFrequencyOptions",
						currentCostingProfile?.TrackingFrequency
					)
					: "Not Applicable",
			});
			allTabs.push(data);
		}
		if (_.includes(selectedProperties, "methodology")) {
			opts.push({ sheetid: "Methodologies", header: true });
			let data = null;
			_.head(currentCostingProfile.CountrySpecs)?.MethodologySpecs.map((ms) => {
				var title = "";
				data = ms.RFQSchema.order.map((rfq) => {
					let finalList = [];
					let finalObj = {};
					let property = getProperty(ms.RFQSchema, rfq);
					if (property && property.isNewSection) {
						let titleObj = {};
						titleObj["Methodology BreakDown"] = property.sectionTitle;
						currentCostingProfile.CountrySpecs.map((cs) => {
							titleObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] =
								"";
						});
						finalList.push(titleObj);
					}
					if (property) {
						finalObj["Methodology BreakDown"] = property.title;
						currentCostingProfile.CountrySpecs.map((cs) => {
							finalObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] =
								rfqData[cs.CountryCode] && rfqData[cs.CountryCode][ms.Code]
									? Array.isArray(rfqData[cs.CountryCode][ms.Code][rfq])
										? rfqData[cs.CountryCode][ms.Code][rfq].join()
										: typeof rfqData[cs.CountryCode][ms.Code][rfq] == "boolean"
											? rfqData[cs.CountryCode][ms.Code][rfq]
												? "Yes"
												: "No"
											: rfqData[cs.CountryCode][ms.Code][rfq]
												? rfqData[cs.CountryCode][ms.Code][rfq]
												: "-"
									: "-";
						});
						finalList.push(finalObj);
					}
					return finalList;
				});
			});
			let final = [];
			data?.map((t) => {
				final.push(...t);
			});
			allTabs.push(final);
		}
		if (_.includes(selectedProperties, "opsresources")) {
			opts.push({ sheetid: "Operation resources", header: true });
			var title = "";
			let data = [];
			_.head(currentCostingProfile.WaveSpecs)?.OpsResourcesSchema.order.map(
				(ors) => {
					let finalList = [];
					let property = getProperty(
						_.head(currentCostingProfile.WaveSpecs).OpsResourcesSchema,
						ors
					);
					if (property && property.isNewSection) {
						let titleObj = {};
						titleObj["Operation Resources BreakDown"] = property.sectionTitle;
						currentCostingProfile.WaveSpecs.map((cs) => {
							let key = cs.WaveName
								? `#${cs.WaveNumber} ${cs.WaveName}`
								: `#${cs.WaveNumber}`;
							titleObj[key] = "";
						});
						finalList.push(titleObj);
					}
					if (property) {
						let finalObj = {};
						finalObj["Operation Resources BreakDown"] = property.title;
						currentCostingProfile.WaveSpecs.map((cs) => {
							let key = cs.WaveName
								? `#${cs.WaveNumber} ${cs.WaveName}`
								: `#${cs.WaveNumber}`;
							finalObj[key] = opsData[cs.WaveNumber]
								? getOpsValue(opsData[cs.WaveNumber][ors], ors)
								: "-";
						});
						finalList.push(finalObj);
					}
					data.push(finalList);
				}
			);
			// })
			let final = [];
			data.map((t) => {
				final.push(...t);
			});
			allTabs.push(final);
		}

		if (_.includes(selectedProperties, "costbreakdown")) {
			opts.push({ sheetid: "Total Cost Breakdown", header: true });
			let data = [];
			Object.keys(costFields).map((cf) => {
				if (
					alternativeLabels[cf] &&
					Object.keys(alternativeLabels[cf]).filter(
						(al) => currentCostingProfile.ProfileSetting[al]
					).length
				) {
					let finalObj = {};
					finalObj.Component =
						"Breakdown Not Available - Using OOP % Multiplier";
					finalObj.Total = `${currentCostingProfile.ProfileSetting[
						_.head(Object.values(alternativeLabels[cf]))
					] * 100
						}%`;
					currentCostingProfile.CountrySpecs.map((cs) => {
						finalObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] = "";
					});
					data.push(finalObj);
				} else if (costFields[cf].length) {
					costFields[cf].map((ccf) => {
						let finalObj = {};
						finalObj.Component = costlabels[ccf];
						finalObj.Total = getCurrentCurrency(
							currentCostingProfile[ccf],
							currentCostingProfile.CostInputCurrency
						);
						currentCostingProfile.CountrySpecs.map((cs) => {
							finalObj[
								getLabel("FieldingCountriesOptions", cs.CountryCode)
							] = getCurrentCurrency(cs[ccf], cs.CostInputCurrency);
						});
						data.push(finalObj);
					});
				} else {
					Object.keys(costIntCommLabels).map((cicl) => {
						let finalObj = {};
						finalObj.Component = costIntCommLabels[cicl];
						finalObj.Total = getCurrentCurrency(
							currentCostingProfile[cicl],
							currentCostingProfile.CostInputCurrency
						);
						currentCostingProfile.CountrySpecs.map((cs) => {
							finalObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] =
								"";
						});
						data.push(finalObj);
					});
				}

				if (
					alternativeLabels[cf] &&
					Object.keys(alternativeLabels[cf]).filter(
						(al) => currentCostingProfile.ProfileSetting[al]
					).length
				) {
					let finalObj = {};
					finalObj.Component = costlabels[cf];
					finalObj.Total = getCurrentCurrency(
						currentCostingProfile.CostTotalExternalOperations *
						currentCostingProfile.ProfileSetting[
						_.head(Object.values(alternativeLabels[cf]))
						]
					);
					currentCostingProfile.CountrySpecs.map((cs) => {
						finalObj[getLabel("FieldingCountriesOptions", cs.CountryCode)] = "";
					});
					data.push(finalObj);
				} else {
					let finalObj = {};
					finalObj.Component = costlabels[cf];
					finalObj.Total = getCurrentCurrency(
						currentCostingProfile[cf],
						currentCostingProfile.CostInputCurrency
					);
					currentCostingProfile.CountrySpecs.map((cs) => {
						finalObj[
							getLabel("FieldingCountriesOptions", cs.CountryCode)
						] = getCurrentCurrency(cs[cf], cs.CostInputCurrency);
					});
					data.push(finalObj);
				}
			});

			if (!data.length)
				data.push({
					Component: "",
					Total: "",
				});

			allTabs.push(data);
		}
		if (_.includes(selectedProperties, "commercialbreakdown")) {
			opts.push({ sheetid: "Commercial Time Breakdown", header: true });
			let data = [];

			bands.map((band) => {
				let finalObj = {};
				finalObj.Band = band;
				finalObj["Hourly Chargeout Rate"] = currentCostingProfile.ProfileSetting
					.CSRateCardUsed
					? getCurrentCurrency(
						currentCostingProfile.ProfileSetting.CSRateCardUsed[
						rateCardReferences[band]
						]
					)
					: getCurrentCurrency(0);
				waveSpecs.map((wave) => {
					finalObj[
						`#${wave.WaveNumber}${wave.WaveName ? ` ${wave.WaveName}` : ""}`
					] = wave.CommercialHoursData
							? wave.CommercialHoursData[band]
								? wave.CommercialHoursData[band]["Total"]
								: "-"
							: "-";
				});
				data.push(finalObj);
			});
			allTabs.push(data);
		}
		if (_.includes(selectedProperties, "profitability")) {
			opts.push({ sheetid: "Profitability Overview", header: false });
			let data = [];
			data.push({
				Component: "Total Internal Operations Cost",
				Cost: getCurrentCurrency(
					currentCostingProfile.CostTotalInternalOperations
				),
			});
			data.push({
				Component: "Total External Operations / OOP / Third Party Cost",
				Cost: getCurrentCurrency(
					currentCostingProfile.CostTotalExternalOperations
				),
			});
			data.push({
				Component: "Total Internal Commercial Cost",
				Cost: getCurrentCurrency(
					currentCostingProfile.CostTotalInternalCommercial
				),
			});
			data.push({
				Component: "Total External Commercial Cost",
				Cost: getCurrentCurrency(
					currentCostingProfile.CostTotalExternalCommercial
				),
			});
			data.push({
				Component: [
					`Overheads ${currentCostingProfile.ProfileSetting?.PercentOverhead * 100
					}%`,
				],
				Cost: getCurrentCurrency(currentCostingProfile.Overheads),
			});
			data.push({
				Component: [
					`Markup to get ${currentCostingProfile.ProfileSetting
						? currentCostingProfile.ProfileSetting.UsesOOPMarkUp
							? currentCostingProfile.ProfileSetting.TargetPercentOOPMarkUp *
							100
							: currentCostingProfile.ProfileSetting
								.TargetPercentContributionMargin * 100
						: ""
					}% ${currentCostingProfile.ProfileSetting?.UsesOOPMarkUp
						? "OOP"
						: "Contribution Margin"
					}`,
				],
				Cost: getCurrentCurrency(currentCostingProfile.Markup),
			});
			data.push({
				Component: "%Margin",
				Cost: currentCostingProfile.PriceToClient
					? `${_.round(
						((_.round(currentCostingProfile.TotalInternalCosts, 2) +
							_.round(currentCostingProfile.TotalExternalCosts, 2)) /
							currentCostingProfile.PriceToClient) *
						100,
						2
					)}%`
					: "0%",
			});
			data.push({
				Component: "Minimum Recommended Price to Client",
				Cost: getCurrentCurrency(currentCostingProfile.RecommendedPrice),
			});
			data.push({
				Component: "Actual Price Given To Client",
				Cost: getCurrentCurrency(currentCostingProfile.PriceToClient),
			});
			if (!data.length)
				data.push({
					Component: "",
					Cost: "",
				});
			allTabs.push(data);
		}
		if (_.includes(selectedProperties, "profitabilitychecks")) {
			opts.push({ sheetid: "Profitability Checks", header: false });
			let data = [];
			if (
				currentCostingProfile.ApprovalDetails &&
				currentCostingProfile.ApprovalDetails.length &&
				currentCostingProfile.ProfileSetting &&
				currentCostingProfile.ProfileSetting.NeedsOutOfPocketCostCheck
			) {
				data.push({
					"Profitability Checks": "Operations Out of Pocket %",
					Target: getOOPThresholdText(),
					Current: currentCostingProfile.OutOfPocketCostPercent
						? `${_.round(
							currentCostingProfile.OutOfPocketCostPercent * 100,
							2
						)}%`
						: "",
				});
			}
			if (currentCostingProfile.ProfileSetting?.NeedsCommercialCostCheck) {
				data.push({
					"Profitability Checks": "Commercial Cost %",
					Target: `${currentCostingProfile.ProfileSetting.ThresholdPercentIntCommCost *
						100
						}% or more`,
					Current: currentCostingProfile.InternalCommercialCostPercent
						? `${_.round(
							currentCostingProfile.InternalCommercialCostPercent * 100,
							2
						)}%`
						: "",
				});
			}
			if (currentCostingProfile.ProfileSetting?.NeedsNetRevenueCheck) {
				data.push({
					"Profitability Checks": "Net Revenue %",
					Target: `${currentCostingProfile.ProfileSetting.ThresholdPercentNetRevenue *
						100
						}% or more`,
					Current: currentCostingProfile.NetRevenuePercent
						? `${_.round(currentCostingProfile.NetRevenuePercent * 100, 2)}%`
						: "",
				});
			}
			if (currentCostingProfile.ProfileSetting?.NeedsContributionMarginCheck) {
				data.push({
					"Profitability Checks": "Minimum Contribution Margin %",
					Target: `${currentCostingProfile.ProfileSetting
						.TargetPercentContributionMargin * 100
						}% or more`,
					Current: currentCostingProfile.ContributionMarginPercent
						? `${_.round(
							currentCostingProfile.ContributionMarginPercent * 100,
							2
						)}%`
						: "",
				});
			}
			if (currentCostingProfile.ProfileSetting?.NeedsMinimumProjectValueCheck) {
				data.push({
					"Profitability Checks": "Minimum Project Value (Price to Client)",
					Target: getActualPrice(
						currentCostingProfile.ProfileSetting.ThresholdPriceToClient,
						true
					),
					Current: getActualPrice(currentCostingProfile.PriceToClient, true),
				});
			}
			if (!data.length)
				data.push({
					"Profitability Checks": "",
					Target: "",
					Current: "",
				});
			allTabs.push(data);
		}
		let filename = `${currentCostingProfile.Project?.ProjectId}${currentCostingProfile.Project.ProjectName
			? `_${currentCostingProfile.Project.ProjectName}`
			: ""
			}_${currentCostingProfile.ProfileNumber}${currentCostingProfile.ProfileName
				? `_${currentCostingProfile.ProfileName}`
				: ""
			}_summary`;
		alasql(`SELECT INTO XLSX("${filename}.xlsx",?) FROM ?`, [
			opts,
			[...allTabs],
		]);
		dispatch(recordLoadEnd());
	};
	const removeSpaces = (filename) => {
		return filename?.split(" ").join("_");
	};
	//download summary- end

	let location = useLocation();

	const history = useHistory();
	const dispatch = useDispatch();
	const handleLogOut = () => {
		props.onLogOut();
		history.push("/auth/login");
	};

	const [methodologySelection, openMethodologySelection] = useState(false);
	const [selectedMethodologies, setSelectedMethodologies] = useState([]);

	const chooseCostMethod = (method) => {
		if (!currentCostingProfile.CostingType && method != "VENDOR") {
			dispatch(currentCostingActions.saveCostingProfile({ ...currentCostingProfile, CostingType: method }
				, null
				, true));
			dispatch(
				currentCostingActions.updateProfile({
					...currentCostingProfile,
					CostingType: method,
				})
			);
		}
		let actualPath = _.head(location.pathname?.replace("/", "").split("/"));

		// dispatch({
		//   type: currentCostingActions.UPDATE_NEW_COSTING,
		//   currentCostingProfile: { CostingType: method },
		// });
		switch (method) {
			case "VENDOR":
				console.log("VENDOR");
				if (!currentCostingProfile.VendorBiddingSubmethodologies) {
					openMethodologySelection(true);
				}
				else {
					setTimeout(() => {
						dispatch(
							setCostingStatus(
								{
									...costingStatus,
									showSheetsCosts: false,
									showManualCostEntry: true,
								},
								actualPath == "costing" ? null : history
							)
						);
						setShowCostMethod(false);
					});
				}
				return;

			case "SHEETS":
				console.log("SHEETS");
				let currentcostingprofile = { ...currentCostingProfile };
				currentcostingprofile.CountrySpecs = currentcostingprofile.CountrySpecs.map((cs) => {
					cs.MethodologySpecs = cs.MethodologySpecs.map((ms) => {
						ms.TimingsSchema = currentcostingprofile.ProfileSetting.GlobalCostingSheetTimingsSchema;
						ms.CostsSchema = currentcostingprofile.ProfileSetting.GlobalCostingSheetCostsSchema;
						return { ...ms };
					});
					return { ...cs };
				});
				dispatch(currentCostingActions.updateProfile(currentcostingprofile));
				setTimeout(() => {
					dispatch(
						setCostingStatus(
							{
								...costingStatus,
								showSheetsCosts: false,
								showManualCostEntry: true,
							},
							actualPath == "costing" ? null : history
						)
					);
					setShowCostMethod(false);
				});
				return;

			case "DEFAULT":
				setTimeout(() => {
					dispatch(
						setCostingStatus(
							{
								...costingStatus,
								showSheetsCosts: false,
								showManualCostEntry: true,
							},
							actualPath == "costing" ? null : history
						)
					);
					setShowCostMethod(false);
				});
				return;

		}
	};


	const getFinalCostFields = () => {
		let finalFields = [];
		_.head(currentCostingProfile.CountrySpecs)?.MethodologySpecs.map((ms) => {
			finalFields.push({ value: ms.Code, label: `${ms.Label} (${getLabel("MethodologyOptions", ms.ParentMethodologyCode)})` });
			// if (ms.CostsSchema) {
			//   ms.CostsSchema.map(cs => {
			//     if (!_.includes(finalFields, cs.title))
			//       finalFields.push(cs.title)
			//   })
			// }
		});
		return finalFields;
	};
	const showScheduleSummary = () => {
		// let reqProjectStatus = [1, 3, 4, 5, 98]
		// if (currentCostingProfile.Project
		//   && (_.includes(reqProjectStatus, parseInt(currentCostingProfile.Project.ProjectStatus)))) {
		//   return true
		// } else return false
		let path = location.pathname.split("/");
		const pages = ["costing", "summary", "overridecosts"];
		return pages.indexOf(path[1]) !== -1;
	};
	const setCommisionModalStatus = () => {
		console.log(currentCostingProfile);
		if (
			currentCostingProfile &&
			currentCostingProfile.ProfileSetting &&
			currentCostingProfile.ProfileSetting.NeedsSFStatusCheck &&
			!currentCostingProfile.Project.IsSyndicated
		) {
			let reqProjectClients = currentCostingProfile.Project?.ContractDetails;
			let sfClients = reqProjectClients.filter((rpc) => rpc.isSF);
			if (
				sfClients.filter(
					(sc) =>
						sc.Probability >=
						currentCostingProfile.ProfileSetting.MinimumSFProbability
				).length
			) {
				setCommissionOpen({
					...isCommissionOpen,
					ModalCommissioning: !isCommissionOpen.ModalCommissioning,
				});
			} else {
				openSaleForceModal(true);
			}
		} else {
			setCommissionOpen({
				...isCommissionOpen,
				ModalCommissioning: !isCommissionOpen.ModalCommissioning,
			});
		}
	};
	return (
		<Navbar color="white" light expand fixed="top" sticky="top">
			<span
				className="sidebar-toggle d-flex mr-2"
				onClick={() => {
					props.onToggleSideBar();
				}}
			>
				<i className="hamburger align-self-center" />
			</span>
			<Col>
				<Row>
					<InputGroup>
						{editableProjectName ? (
							<Input
								placeholder="Enter project name..."
								value={props.project.ProjectName}
								onChange={(e) =>
									props.updateProject({ ProjectName: e.target.value })
								}
								onBlur={(e) => setEditableProjectName(false)}
								onKeyPress={(e) => {
									if (e.key === "Enter") {
										props.updateProject({ ProjectName: e.target.value });
										setEditableProjectName(false);
									}
								}}
							/>
						) : (
								<h4>
									{props.project.ProjectName &&
										props.project.ProjectName != "New Project..."
										? props.project.ProjectName.length > 0
											? props.project.ProjectName
											: "Enter project name..."
										: props.costingProfile &&
											props.costingProfile.Project &&
											props.costingProfile.Project.ProjectName
											? props.costingProfile.Project.ProjectName
											: null}
								</h4>
							)}
						{!props.avoidEdit ? (
							<FontAwesomeIcon
								title="Edit Project Name"
								className="align-middle mr-2"
								icon={faPencilAlt}
								fixedWidth
								onClick={(e) => setEditableProjectName(!editableProjectName)}
								style={{ cursor: "pointer" }}
							/>
						) : null}
					</InputGroup>
				</Row>
				<Row>
					<h5>
						{props.project.ProjectId
							? props.project.ProjectId
							: props.costingProfile && props.costingProfile.Project
								? props.costingProfile.Project.ProjectId
								: null}
					</h5>
				</Row>
				{props.costingProfile.id && !props.hideProfileName ? (
					<Row>
						<InputGroup>
							{editableCostingName ? (
								<Input
									placeholder="Enter profile name..."
									value={props.costingProfile.ProfileName}
									onChange={(e) =>
										props.updateCosting({ ProfileName: e.target.value })
									}
									onBlur={(e) => setEditableCostingName(false)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											props.updateCosting({ ProfileName: e.target.value });
											setEditableCostingName(false);
										}
									}}
								/>
							) : (
									<h5>
										{props.costingProfile.ProfileName &&
											props.costingProfile.ProfileName.length > 0
											? props.costingProfile.ProfileName
											: "Enter profile name..."}
									</h5>
								)}
							{!props.avoidEdit ? (
								<FontAwesomeIcon
									title="Edit Costing Profile Name"
									className="align-middle mr-2"
									icon={faPencilAlt}
									fixedWidth
									onClick={(e) => setEditableCostingName(!editableCostingName)}
									style={{ cursor: "pointer" }}
								/>
							) : null}
						</InputGroup>
					</Row>
				) : null}
			</Col>

			<Collapse navbar>
				<Nav className="ml-auto" navbar>
					{/* {props.costingProfile.id ? (
            <Button
              className="mr-2"
              onClick={() => {
                setIsOpenRequest(true);
              }}
            >
              Create Request
            </Button>
          ) : null} */}
					{/* {props.costingProfile.id ? (
            <Button
              onClick={() => {
                handleCostInput();
              }}
              className="mr-2"
            >
              Input Costs
            </Button>
          ) : null} */}

					<Col className="hidden-xs">
						{props.profileStatusToDisplay ? (
							<Col>
								<Badge
									className="m-0 h5"
									color="primary"
									title="Costing Profile Status"
								>
									Profile Status: {props.profileStatusToDisplay}
								</Badge>
							</Col>
						) : null}
						{props.projectStatusToDisplay ? (
							<Col className={!props.profileStatusToDisplay ? "mt-2" : ""}>
								<Badge
									className="m-0 h5"
									color="primary"
									title="Project Status"
								>
									Project Status: {props.projectStatusToDisplay}
								</Badge>
							</Col>
						) : null}
					</Col>
					{props.costingProfile.id && !props.hideActions ? (
						<div className="mr-1 mb-1 btn-group">
							<Button
								onClick={() => {
									setIsOpen(!isOpen);
									setNotes(props.costingProfile.CostingNotes ?? "");
								}}
								className="mr-2"
							>
								Notepad
              </Button>
						</div>
					) : null}
					{props.costingProfile.id && !props.hideActions ? (
						<UncontrolledButtonDropdown key={"actions"} className="mr-1 mb-1">
							<DropdownToggle caret color={"secondary"}>
								Actions
              </DropdownToggle>
							<DropdownMenu className="actions-dropdown-menu">
								<DropdownItem
									onClick={() => {
										setIsOpenRequest(true);
									}}
								>
									Create New Request
                </DropdownItem>
								<DropdownItem divider />
								{/* {currentCostingProfile.ProfileStatus > 5 ? null : ( */}
								<DropdownItem
									onClick={() => {
										//todo: if not costing don't trigger below code
										if (!currentCostingProfile.CostingType) setShowCostMethod(true);
										else chooseCostMethod(currentCostingProfile.CostingType);
									}}
									className="mr-2"
								>
									Input Costs
								</DropdownItem>
								{/* )} */}
								{currentCostingProfile.ProfileStatus > 5 ? null : props
									.userRecord.IsOpsProjectManager ? (
										<DropdownItem
											onClick={() => {
												// dispatch(
												//   currentCostingActions.getCosting(
												//     currentCostingProfile.id,
												//     () => {
												dispatch(pageLoadStart());
												dispatch(
													currentCostingActions.saveCostingProfile(
														currentCostingProfile,
														() => {
															history.push(`/overridecosts`);
															dispatch(pageLoadEnd());
															// dispatch(currentCostingActions.generateSummary());
														}
													)
												);

												// }
												//   )
												// );
											}}
										>
											Override Auto-Costs
										</DropdownItem>
									) : null}
								<DropdownItem divider />
								<DropdownItem
									onClick={() => {
										if (currentCostingProfile.AdditionalSheetId) {
											window.open(
												"https://docs.google.com/spreadsheets/d/" +
												currentCostingProfile.AdditionalSheetId
											);
										} else {
											axios
												.post(
													"/utils/sheets/" +
													currentCostingProfile.id +
													"/additional"
												)
												.then((res) => {
													dispatch({
														type: currentCostingActions.UPDATE_NEW_COSTING,
														currentCostingProfile: {
															AdditionalSheetId: res.data.AdditionalSheetId,
														},
													});
													window.open(
														"https://docs.google.com/spreadsheets/d/" +
														res.data.AdditionalSheetId
													);
													toastr.success(res.data.message);
												})
												.catch((err) => {
													toastr.error("Additional Sheet creation failed");
												});
										}
									}}
								>
									{currentCostingProfile.AdditionalSheetId
										? "Open "
										: "Create "}
                  Additional Sheet
                </DropdownItem>
								{/* {currentCostingProfile.CostingsSheetId ? (
                  <DropdownItem
                    onClick={() => {
                      window.open(
                        "https://docs.google.com/spreadsheets/d/" +
                        currentCostingProfile.CostingsSheetId
                      );
                    }}
                  >
                    Open Costing Sheet
                  </DropdownItem>
                ) : null} */}
								<DropdownItem
									onClick={() => {
										window.open(
											"https://drive.google.com/drive/folders/" +
											project.ProjectResourcesFolderId
										);
									}}
								>
									Open Project Folder
                </DropdownItem>
								<DropdownItem
									onClick={() => {
										window.open(
											"https://drive.google.com/drive/folders/" +
											project.CostingsFolderId
										);
									}}
								>
									Open Costings Folder
                </DropdownItem>
								<DropdownItem divider />

								<DropdownItem
									onClick={() => {
										dispatch(
											currentProjectActions.getProject(
												props.project.ProjectId
													? props.project.ProjectId
													: currentCostingProfile.Project.ProjectId,
												() => history.push("/proposal")
											)
										);
										// currentCostingActions.getCosting(currentCostingProfile.id)
									}}
								>
									Edit Project Details
                </DropdownItem>
								{currentCostingProfile.ProfileStatus > 5 ||
									currentCostingProfile.IsImportedProfile ? null : (
										<DropdownItem
											onClick={() => {
												dispatch(
													setCostingStatus({
														...costingStatus,
														showSheetsCosts: false,
														showManualCostEntry: false,
													})
												);
												dispatch(
													currentProjectActions.getProject(
														props.project.ProjectId
															? props.project.ProjectId
															: currentCostingProfile.Project.ProjectId,
														() => history.push("/costing")
													)
												);
											}}
										>
											Edit Costing Profile
										</DropdownItem>
									)}
								{showScheduleSummary() ? (
									<>
										{["6", "99"].indexOf(
											currentCostingProfile.ProfileStatus
										) !== -1 ? (
												<DropdownItem
													onClick={() => {
														dispatch(
															currentCostingActions.getCosting(
																currentCostingProfile.id,
																() => history.push("/schedule")
															)
														);
													}}
												>
													Edit Project Schedule
												</DropdownItem>
											) : null}
										<DropdownItem
											onClick={() => {
												// dispatch(
												//   currentCostingActions.getCosting(
												//     currentCostingProfile.id,
												//     () => {
												dispatch(pageLoadStart());
												dispatch(
													currentCostingActions.saveCostingProfile(
														currentCostingProfile,
														() => {
															history.push(
																`/summary/${currentCostingProfile.id}`
															);
															dispatch(pageLoadEnd());
														}
													)
												);
												// dispatch(currentCostingActions.generateSummary());
												//     }
												//   )
												// );
											}}
										>
											View Cost Summary
                    </DropdownItem>

										{/* <DropdownItem>Open Project Review</DropdownItem> */}
									</>
								) : null}

								{parseInt(currentCostingProfile.ProfileStatus) == 5 ||
									(currentCostingProfile.ProfileStatus > 1 &&
										currentCostingProfile.ProfileStatus < 6) ||
									parseInt(currentCostingProfile.ProfileStatus) == 6 ? (
										<DropdownItem divider />
									) : null}
								{parseInt(currentCostingProfile.ProfileStatus) == 5 ? (
									<DropdownItem onClick={() => setCommisionModalStatus()}>
										Commission Costing
									</DropdownItem>
								) : null}
								{currentCostingProfile.ProfileStatus > 1 &&
									currentCostingProfile.ProfileStatus < 6 ? (
										<DropdownItem
											onClick={() => {
												dispatch(currentCostingActions.unlockPriceToClient());
											}}
										>
											Unlock Price to Client
										</DropdownItem>
									) : null}
								{/* todo: avoid hardcoding status and label- move to a  reliable object - all action menu items*/}
								{parseInt(currentCostingProfile.ProfileStatus) == 6 ? (
									<DropdownItem
										onClick={() =>
											setCommissionOpen({
												...isCommissionOpen,
												ModalDecommissioning: !isCommissionOpen.ModalDecommissioning,
											})
										}
									>
										Edit Commissioned Costing
									</DropdownItem>
								) : null}

								{location.pathname.indexOf("summary") != -1 ? (
									<>
										<DropdownItem divider />
										<DropdownItem onClick={() => openDownloadModal(true)}>
											Download Summary
                    </DropdownItem>
									</>
								) : null}
							</DropdownMenu>
						</UncontrolledButtonDropdown>
					) : null}
					<UncontrolledDropdown nav inNavbar>
						<span className="d-inline-block d-sm-none">
							<DropdownToggle nav caret>
								<Settings size={18} className="align-middle" />
							</DropdownToggle>
						</span>
						<span className="d-none d-sm-inline-block">
							<DropdownToggle nav caret>
								<img
									src={avatar1}
									className="avatar img-fluid rounded-circle mr-1"
									alt="User Profile Picture"
								/>
								<span className="text-dark">
									{props.userRecord.FirstName} {props.userRecord.LastName}
								</span>
							</DropdownToggle>
						</span>
						<DropdownMenu right>
							<DropdownItem>
								<User size={18} className="align-middle mr-2" />
                Profile
              </DropdownItem>

							<DropdownItem divider />
							<DropdownItem
								onClick={(e) => {
									handleLogOut();
								}}
							>
								Sign out
              </DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
				<Row className="visible-xs mt-3">
					{props.profileStatusToDisplay ? (
						<Col>
							<Badge
								className="m-0 h5"
								color="primary"
								title="Costing Profile Status"
							>
								Profile Status: {props.profileStatusToDisplay}
							</Badge>
						</Col>
					) : null}
					{props.projectStatusToDisplay ? (
						<Col className={!props.profileStatusToDisplay ? "mt-2" : ""}>
							<Badge className="m-0 h5" color="primary" title="Project Status">
								Project Status: {props.projectStatusToDisplay}
							</Badge>
						</Col>
					) : null}
				</Row>
			</Collapse>

			{props.costingProfile.id ? (
				<RequestCreate
					isOpen={isOpenRequest}
					toggle={() => setIsOpenRequest(!isOpenRequest)}
				/>
			) : null}
			<Modal
				isOpen={isOpen}
				toggle={() => setIsOpen(!isOpen)}
				centered={true}
				size="lg"
			>
				<ModalHeader toggle={() => setIsOpen(!isOpen)}>
					<h3>Costing Notepad</h3>
				</ModalHeader>
				<ModalBody>
					<Container>
						<ReactQuill
							placeholder="You can use this notepad to save any notes related to this costing currentCostingProfile. These notes can later be accessed directly from the dashboard and costing currentCostingProfile..."
							value={notes}
							onChange={(e) => {
								console.log(e);
								setNotes(e);
							}}
						/>
					</Container>
				</ModalBody>
				<ModalFooter>
					<Button
						color="secondary"
						disabled={props.app.recordloading}
						onClick={() => setIsOpen(!isOpen)}
					>
						Cancel
          </Button>{" "}
					<Button
						color="primary"
						onClick={() => {
							setIsOpen(!isOpen);
							props.updateCosting({ CostingNotes: notes });

							const updatedCosting = update(props.costingProfile, {
								["CountrySpecs"]: { $set: props.countrySpecs },
							});
							const updatedCosting2 = update(updatedCosting, {
								["Project"]: { $set: props.project },
							});
							const updatedCosting3 = update(updatedCosting2, {
								["CostingNotes"]: { $set: notes },
							});
							console.log("updated costing here");
							console.log(updatedCosting3);

							props.saveCostingProfile(updatedCosting3);
						}}
						disabled={props.app.recordloading}
					>
						Save
          </Button>
				</ModalFooter>
			</Modal>
			<ModalCommissioning
				setIsOpen={setCommissionOpen}
				isOpen={isCommissionOpen}
				toggle={() => {
					setCommissionOpen({
						...isCommissionOpen,
						ModalCommissioning: !isCommissionOpen.ModalCommissioning,
					});
				}}
			/>
			<ModalPostCommission
				isOpen={isCommissionOpen}
				toggle={() => {
					setCommissionOpen({
						...isCommissionOpen,
						ModalPostCommission: !isCommissionOpen.ModalPostCommission,
					});
				}}
			/>
			<ModalDecommissioning
				isOpen={isCommissionOpen}
				toggle={() => {
					setCommissionOpen({
						...isCommissionOpen,
						ModalDecommissioning: !isCommissionOpen.ModalDecommissioning,
					});
				}}
			/>
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
						Please Note: You can only select one costing method per
						currentCostingProfile. Some options may not be available depending
						on your market's default settings.
          </h5>
				</ModalBody>
				<ModalFooter>
					{!currentCostingProfile.IsMultiCountry ? <Button
						disabled={app.recordloading}
						onClick={() => chooseCostMethod("VENDOR")}
					>
						Trigger Vendor Bidding{(app.recordloading && currentCostingProfile.CostingType == "VENDOR") ? (
							<>
								<Spinner size="small" color="#cccccc" />
							</>
						) : null}
					</Button> : null}{" "}
					<Button
						disabled={app.recordloading}
						onClick={() => chooseCostMethod("SHEETS")}>
						Use Google Sheets
					</Button>{" "}
					{!currentCostingProfile.IsMultiCountry ? <Button
						disabled={app.recordloading}
						onClick={() => chooseCostMethod("DEFAULT")}>
						Input Cost Directly
					</Button> : null}{" "}
					{(app.recordloading && currentCostingProfile.CostingType !== "VENDOR") ? (
						<>
							<Spinner size="small" color="#cccccc" />
						</>
					) : null}
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={salesForceModal}
				toggle={() => openSaleForceModal(!salesForceModal)}
			>
				<ModalHeader toggle={() => openSaleForceModal(!salesForceModal)}>
					Update Client Details
        </ModalHeader>
				<ModalBody>
					Please update client details to proceed
          {currentCostingProfile.Project &&
						currentCostingProfile.Project.ContractDetails
						? currentCostingProfile.Project.ContractDetails.map((cd, index) => (
							<>
								<Row className="mb-2">
									<Col>
										<Label className="small font-weight-bold mb-0">
											Opportunity Details #{index + 1}
										</Label>
									</Col>
									{cd.isSF ? (
										<Col>
											<a
												className="update-client-details"
												onClick={() =>
													dispatch(
														currentProjectActions.syncContactDetails(
															currentCostingProfile.Project.id,
															cd,
															true,
															() => {
																openSaleForceModal(false);
																setCommissionOpen({
																	...isCommissionOpen,
																	ModalCommissioning: !isCommissionOpen.ModalCommissioning,
																});
															}
														)
													)
												}
											>
												Update Client Details
                          {props.app.recordloading ? (
													<>
														<Spinner size="small" color="#cccccc" />
													</>
												) : null}
											</a>
										</Col>
									) : null}
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Name
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.OpportunityName}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Account
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.AccountName}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Industry
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.Industry}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										OP Number
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.OpportunityNumber}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Stage
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.Stage} ({cd.Probability}
										{"%"})
                    </Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Amount
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.Amount} {cd.AmountCurrency}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Start of Delivery
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.StartofDelivery
											? cd.StartofDelivery.split("T")[0]
											: "Not available"}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										End of Delivery
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.EndofDelivery
											? cd.EndofDelivery.split("T")[0]
											: "Not available"}
									</Col>
								</Row>
								<Row className="mb-2">
									<Col xs="4" className="pr-0">
										Close Date
                    </Col>
									<Col xs="8" className="pl-1">
										{cd.CloseDate
											? cd.CloseDate?.split("T")[0]
											: "Not available"}
									</Col>
								</Row>
								<hr
									className="mb-0 mt-0"
									style={{ borderStyle: "dotted" }}
								></hr>
							</>
						))
						: "No Contract Details Found"}
				</ModalBody>
			</Modal>
			<Modal
				toggle={() => {
					openDownloadModal(false);
					setSelectedProperties([]);
				}}
				isOpen={downloadModal}
			>
				<ModalHeader
					toggle={() => {
						openDownloadModal(false);
						setSelectedProperties([]);
					}}
				>
					Select Sections to be Downloaded
        </ModalHeader>
				<ModalBody>
					<Row className="m-0 justify-content-end">
						<a
							className="mr-1 select-link"
							onClick={() =>
								setSelectedProperties(allDownloadProps.map((adp) => adp.value))
							}
						>
							Select all
            </a>
						<a
							className="ml-1 select-link"
							onClick={() => setSelectedProperties([])}
						>
							Deselect all
            </a>
					</Row>
					<ul>
						{allDownloadProps.map((adp) => {
							return (
								<li>
									<span>
										<input
											type="checkbox"
											checked={_.includes(selectedProperties, adp.value)}
											id={adp.value}
											value={adp.value}
											onChange={(e) => {
												if (e.target.checked) {
													let selectedproperties = selectedProperties;
													selectedproperties.push(e.target.value);
													setSelectedProperties([...selectedproperties]);
												} else {
													let selectedproperties = selectedProperties.filter(
														(val) => val != e.target.value
													);
													setSelectedProperties([...selectedproperties]);
												}
											}}
										/>
										<label className="ml-2 pointer" for={adp.value}>
											{adp.label}
										</label>
									</span>
								</li>
							);
						})}
					</ul>
				</ModalBody>
				<ModalFooter>
					<Row>
						<div className="d-flex text-nowrap">
							{" "}
							<strong className="mt-1 mr-1">Format to download: </strong>
							<select
								className="form-control"
								defaultValue={downloadType}
								onChange={(e) => setDownloadType(e.target.value)}
							>
								<option value="SHEET">Sheet</option>
								<option value="PDF">PDF</option>
							</select>
						</div>
					</Row>
					<Button
						disabled={!selectedProperties.length}
						onClick={(e) => {
							if (selectedProperties.length) {
								if (downloadType == "SHEET") downloadInSheets();
								else if (downloadType == "PDF")
									dispatch(
										currentCostingActions.downloadInPdf(
											selectedProperties,
											currentCurrency
										)
									);
								// setSelectedProperties([])
							}
						}}
					>
						Download{" "}
						{app.recordloading ? (
							<Spinner size="small" className="ml-2" color="#cccccc" />
						) : null}
					</Button>
				</ModalFooter>
			</Modal>
			{/* Selecting Methodologies to be disabled in manual cost entry */}
			<Modal isOpen={methodologySelection} toggle={() => openMethodologySelection(!methodologySelection)}>
				<ModalHeader toggle={() => openMethodologySelection(!methodologySelection)}>Select Sub-Methodologies</ModalHeader>
				<ModalBody>
					<Row className="m-0 justify-content-end">
						<a
							className="select-link mr-1"
							onClick={() => {
								setSelectedMethodologies([...getFinalCostFields().map((gfc) => gfc.value)]);
							}}
						>
							Select all
						</a>
						<a
							className="select-link ml-1"
							onClick={() => {
								setSelectedMethodologies([]);
							}}
						>
							Deselect all
						</a>
					</Row>
					<ul>
						{getFinalCostFields().map((cf, index) => (
							<li>
								<input
									type="checkbox"
									id={`cf_${index}`}
									checked={_.includes(selectedMethodologies, cf.value)}
									onClick={(e) => {
										if (e.target.checked) {
											let selectedmethodologies = [...selectedMethodologies];
											selectedmethodologies.push(cf.value);
											setSelectedMethodologies([...selectedmethodologies]);
										} else {
											let selectedmethodologies = [...selectedMethodologies.filter((sm) => sm != cf.value)];
											setSelectedMethodologies([...selectedmethodologies]);
										}
									}}
								/>
								<label className="ml-2 pointer" for={`cf_${index}`}>
									{cf.label}
								</label>
							</li>
						))}
					</ul>
				</ModalBody>
				<ModalFooter>
					<Row>
						<Button
							color="secondary"
							size="small"
							onClick={() => {
								openMethodologySelection(false);
								setSelectedMethodologies([]);

								dispatch(currentCostingActions.updateProfile({ ...currentCostingProfile, CostingType: null }));
								// dispatch(
								//   currentCostingActions.saveCostingProfile(
								//     { ...currentCostingProfile, CostingType: null },
								//     () => {
								//     },
								//     true
								//   )
								// );
							}}
						>
							Cancel
						</Button>
						<Button
							color="primary"
							className="ml-2"
							size="small"
							disabled={!selectedMethodologies.length}
							onClick={() => {
								let actualPath = _.head(location.pathname?.replace("/", "").split("/"));
								dispatch(
									currentCostingActions.saveCostingProfile(
										{ ...currentCostingProfile, CostingType: "VENDOR", VendorBiddingSubmethodologies: selectedMethodologies.join() },
										() => {
											setSelectedMethodologies([]);
											openMethodologySelection(false);
											window.open(`https://vendormanagement.edashboard.in/#/pages/vendor-bidding/${currentCostingProfile.Project.ProjectId}/${currentCostingProfile.id}`, "_blank");
											dispatch(
												setCostingStatus(
													{
														...costingStatus,
														showManualCostEntry: true,
													},
													actualPath == "costing" ? null : history
												)
											);
											setShowCostMethod(false);
										},
										true
									)
								);
							}}
						>
							Confirm{app.recordloading ? <Spinner size="small" className="ml-2" color="#cccccc" /> : null}
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</Navbar>
	);
};

const mapStateToProps = (state) => ({
	app: state.app,
	userRecord: state.user.userRecord,
	countrySpecs: state.countrySpecs,
	project: state.currentProject.newProject,
	costingProfile: state.currentCosting.currentCostingProfile,
});

const mapDispatchToProps = (dispatch) => {
	return {
		onLogOut: () => {
			dispatch(userActions.logout());
		},
		onToggleSideBar: () => {
			dispatch(toggleSidebar());
		},
		updateProject: (newProject) =>
			dispatch({
				type: currentProjectActions.UPDATE_NEW_PROJECT,
				newProject: newProject,
			}),
		updateCosting: (newCosting) => {
			dispatch({
				type: currentCostingActions.UPDATE_NEW_COSTING,
				currentCostingProfile: newCosting,
			});
		},
		saveCostingProfile: (costingProfile) =>
			dispatch(currentCostingActions.saveCostingProfile(costingProfile)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);

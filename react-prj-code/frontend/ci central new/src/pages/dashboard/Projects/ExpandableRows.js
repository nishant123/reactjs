import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as currentProjectActions from "../../../redux/actions/currentProjectActions";

import { getLabel } from "../../../utils/codeLabels";
import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Row,
	Col,
	Label,
	Modal,
	ModalBody,
	ModalHeader,
} from "reactstrap";
import { Link } from "react-router-dom";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { MinusCircle, PlusCircle } from "react-feather";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPen,
	faCommentDollar,
	faAddressCard,
	faUserPlus,
	faFilePdf,
	faTrash,
	faCopy,
	faCalendarAlt,
	faArchive,
	faFileInvoiceDollar,
	faCommentDots,
	faComment,
	faFolder,
	faInfoCircle,
	faRedoAlt,
	faThumbsUp,
	faThumbsDown,
	faHourglassHalf,
	faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { faFolder as faFolderO } from "@fortawesome/free-regular-svg-icons";
import _ from "lodash";
import moment from "moment";
import Spinner from "../../../components/Spinner";
import {
	recordLoadEnd,
	recordLoadStart,
} from "../../../redux/actions/appActions";
import { toastr } from "react-redux-toastr";
import { getCosting } from "../../../redux/actions/currentCostingActions";

const SchedulesData = (props) => {
	const [allWaves] = useState(props.wavespecs);
	const [current, setcurrent] = useState(_.head(props.wavespecs));
	const changeWave = (id) => {
		setcurrent(_.head(allWaves.filter((aw) => aw.id == id)));
	};

	const [isEwnNotesModal, setEwnModal] = useState(false);
	const [currentEwn, setCurrentEwn] = useState({});
	const NotesFields = [
		{
			label: "Notes for Project Manager",
			value: "NotesPM",
		},
		{
			label: "Notes for Programming",
			value: "NotesFinalQuestionnaire",
		},
		{
			label: "Notes for Translations",
			value: "NotesTranslations",
		},
		{
			label: "Notes for Field work",
			value: "NotesFieldwork",
		},
		{
			label: "Notes for Verbatim Coding",
			value: "NotesVerbatimCoding",
		},
		{
			label: "Notes for Data Processing",
			value: "NotesDataProcessing",
		},
		{
			label: "Notes for Charting",
			value: "NotesCharts",
		},
		{
			label: "Notes for Dashboarding",
			value: "NotesDashboards",
		},
		{
			label: "Notes for Final Report",
			value: "NotesFinalReport",
		},
		{
			label: "Other notes",
			value: "NotesOther",
		},
	];
	return (
		<div>
			<Row>
				<Col>
					<h5>Timeline</h5>
				</Col>
			</Row>

			{current ? (
				<>
					<Row className="mb-2">
						<Col>Wave</Col>
						<Col>
							<select
								className="form-control"
								defaultValue={current?.id}
								onChange={(e) => changeWave(e.target.value)}
							>
								{allWaves?.map((ws) => (
									<option value={ws.id}>
										#{ws.WaveNumber} {ws.WaveName}
									</option>
								))}
							</select>
						</Col>
					</Row>{" "}
					<Row>
						{current.ProjectBoxId ? (
							<Col>
								<a
									href={`https://docs.google.com/spreadsheets/d/${current.ProjectBoxId}`}
									target="_blank"
									className="small ewn-links"
								>
									Open Project Box
								</a>
							</Col>
						) : null}
						<Col>
							<a
								className="small ewn-link"
								onClick={() => {
									setEwnModal(true);
									setCurrentEwn(current);
								}}
							>
								View EWN Notes
							</a>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Commissioned Date</Col>
						<Col>
							{current.DateWaveCommissioned
								? moment(current.DateWaveCommissioned).format("YYYY-MM-DD")
								: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Final Questionnaire Due</Col>
						<Col>
							{current.DateFinalQuestionnaire
								? moment(current.DateFinalQuestionnaire).format("YYYY-MM-DD")
								: current.DateFinalQuestionnaireNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Translations Due</Col>
						<Col>
							{current.DateTranslations
								? moment(current.DateTranslations).format("YYYY-MM-DD")
								: current.DateTranslationsNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Field Start</Col>
						<Col>
							{current.DateFieldStart
								? moment(current.DateFieldStart).format("YYYY-MM-DD")
								: current.DateFieldworkNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Field End</Col>
						<Col>
							{current.DateFieldEnd
								? moment(current.DateFieldEnd).format("YYYY-MM-DD")
								: current.DateFieldworkNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Data Processing Due</Col>
						<Col>
							{current.DateDataProcessing
								? moment(current.DateDataProcessing).format("YYYY-MM-DD")
								: current.DateDataProcessingNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Charting Due</Col>
						<Col>
							{current.DateCharts
								? moment(current.DateCharts).format("YYYY-MM-DD")
								: current.DateChartsNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Dashboard Due</Col>
						<Col>
							{current.DateDashboards
								? moment(current.DateDashboards).format("YYYY-MM-DD")
								: current.DateDashboardsNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Final Reports Due</Col>
						<Col>
							{current.DateFinalReport
								? moment(current.DateFinalReport).format("YYYY-MM-DD")
								: current.DateFinalReportNA
									? "Not Required"
									: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Programmer Assigned</Col>{" "}
						<Col>
							{current.DeliverySpec && current.DeliverySpec.ProgrammerAssigned
								? current.DeliverySpec.ProgrammerAssigned
								: "-"}
						</Col>
					</Row>
					<Row className="mb-2">
						<Col>Unique Wave Number</Col>{" "}
						<Col>
							{current.DeliverySpec &&
								current.DeliverySpec.ProjectDeliveryNumber
								? current.DeliverySpec.ProjectDeliveryNumber
								: "-"}
						</Col>
					</Row>
					<Modal
						isOpen={isEwnNotesModal}
						toggle={() => setEwnModal(false)}
						className="modal-sm"
					>
						<ModalHeader toggle={() => setEwnModal(false)}>
							<Row>
								<Col>
									<h4>EWN Notes</h4>
								</Col>
							</Row>
						</ModalHeader>
						<ModalBody>
							<div>
								{NotesFields.map((nf) => (
									<div>
										<label>{nf.label}</label>
										<br></br>
										<textarea
											id={nf.value}
											className="form-control"
											defaultValue={currentEwn[nf.value]}
											disabled={true}
										></textarea>
									</div>
								))}
							</div>
						</ModalBody>
					</Modal>
				</>
			) : null}
		</div>
	);
};

const ExpandableRowsTable = ({ tableData, tableColumns }) => {
	const dispatch = useDispatch();
	const app = useSelector(({ app }) => app);
	const currentContactLoading = useSelector(({ currentProject }) => currentProject.currentContactLoading);
	const projectDetails = (row) => {
		let finalProfile = null;
		const validStatus = ["3", "4", "5", "98"];
		if (_.includes(validStatus, row.ProjectStatus))
			finalProfile = _.head(
				row.CostingProfiles.filter((cp) => cp.ProfileStatus == "6")
			);
		return (
			<Col lg="3" md="3" sm="12" xs="12" className="border-right">
				<Row className="mb-2">
					<Col>
						<h5>Project Details</h5>
					</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Office</Col>
					<Col>{getLabel("OfficeOptions", row.CommissioningOffice)}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Business Unit</Col>
					<Col xs="5">{getLabel("BusinessUnitOptions", row.BusinessUnit)}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Vertical</Col>
					<Col>{getLabel("VerticalOptions", row.IndustryVertical)}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Syndicated Project</Col>
					<Col>{row.IsSyndicated ? "Yes" : "No"}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Tracker</Col>
					<Col>{finalProfile?.IsTracker ? "Yes" : "No"}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Total Waves</Col>
					<Col>{finalProfile ? finalProfile.NumberOfWaves : "-"}</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Tracking Frequency</Col>
					<Col>
						{finalProfile && finalProfile.TrackingFrequency
							? getLabel(
								"TrackingFrequencyOptions",
								finalProfile.TrackingFrequency
							)
							: "-"}
					</Col>
				</Row>
				<Row className="mb-2">
					<Col xs="7">Fielding Countries</Col>
					<Col>
						{finalProfile && finalProfile.FieldingCountries
							? getLabel(
								"FieldingCountriesOptions",
								finalProfile.FieldingCountries
							)
							: "-"}
					</Col>
				</Row>
				<Row>
					<Col xs="7">Methodologies</Col>
					<Col xs="5">
						<ul style={{ paddingInlineStart: "0" }}>
							{finalProfile && finalProfile.Methodology
								? finalProfile.Methodology.split(",").map((method, index) => {
									return (
										<li key={index} style={{ listStyle: "none" }}>
											{getLabel("MethodologyOptions", method)}
										</li>
									);
								})
								: null}
						</ul>
					</Col>
				</Row>
				<Row>
					<Col xs="7">Sub-Methodologies</Col>
					<Col xs="5">
						<ul style={{ paddingInlineStart: "0" }}>
							{finalProfile && finalProfile.SubMethodology
								? finalProfile.SubMethodology.split(",").map(
									(method, index) => {
										return (
											<li key={index} style={{ listStyle: "none" }}>
												{getLabel("SubMethodologyOptions", method)}
											</li>
										);
									}
								)
								: "-"}
						</ul>
					</Col>
				</Row>
				<Row>
					<Col xs="7">Other Project Team Contacts</Col>
					<Col xs="5">
						{row.OtherProjectTeamContacts && row.OtherProjectTeamContacts.length
							? row.OtherProjectTeamContacts.map((opt, index) => (
								<li className="no-list-style" key={index}>
									{opt.value
										.toLowerCase()
										.split("@")[0]
										.split(".")
										.map((word) => {
											return word.replace(word[0], word[0].toUpperCase());
										})
										.join(" ")}
								</li>
							))
							: "Not Available"}
					</Col>
				</Row>
			</Col>
		);
	};

	const salesforceColumn = (row) => {

		const syncClientDetails = (contactDetail) => {
			if (contactDetail.updateAt) {
				let lastUpdated = ((new Date(moment().format("YYYY-MM-DD hh:mm:ss")).getTime() - new Date(contactDetail.updateAt).getTime()) / (1000) / 60)
				if (lastUpdated < 1)
					toastr.info("Already Updated", "Contact details are already updated")
				else dispatch(currentProjectActions.syncContactDetails(row.id, contactDetail));
			} else {
				dispatch(currentProjectActions.syncContactDetails(row.id, contactDetail));
			}
		};

		return (
			<Col lg="3" md="3" sm="12" xs="12" className="border-right">
				<Row>
					<Col>
						<h5>Salesforce / Client Details</h5>
					</Col>
				</Row>
				{row.ContractDetails
					? row.ContractDetails.map((cd, index) =>
						(app.recordloading && currentContactLoading?.id == cd.id) ? (
							<Row className="justify-content-center mt-5">
								<Spinner size="small" color="#495057" />
							</Row>
						) : (
								<>
									<Row className="mb-2">
										<Col>
											<Label className="small font-weight-bold mb-0">
												Opportunity Details #{index + 1}
											</Label>
										</Col>
										{cd.isSF ? (
											<Col className="text-right">
												<a
													className="update-client-details small"
													onClick={() => syncClientDetails(cd)}
												>
													Refresh SF Opportunity
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
									{cd.opportunityLineItemDetails
										? cd.opportunityLineItemDetails.map((opl, pi) => (
											<>
												<Row>
													<Col>
														<Label className="small font-weight-bold mb-0">
															Product Details #{pi + 1}
														</Label>
													</Col>
												</Row>
												<Row className="small">
													<Col xs="4" className="pr-0">
														WBS Number
														</Col>
													<Col xs="8" className="pl-1">
														{opl.WBSNumber ? opl.WBSNumber : "Not Available"}
													</Col>
												</Row>
												<Row className="small">
													<Col xs="4" className="pr-0">
														Material ID
														</Col>
													<Col xs="8" className="pl-1">
														{opl.MaterialID
															? opl.MaterialID
															: "Not Available"}
													</Col>
												</Row>
												<Row className="small">
													<Col xs="4" className="pr-0">
														Product Description
														</Col>
													<Col xs="8" className="pl-1">
														{opl.ProductDescription
															? opl.ProductDescription
															: "Not Available"}
													</Col>
												</Row>
												<Row className="small">
													<Col xs="4" className="pr-0">
														Sub Brand
														</Col>
													<Col xs="8" className="pl-1">
														{opl.SubBrand ? opl.SubBrand : "Not Available"}
													</Col>
												</Row>
												<Row className="small">
													<Col xs="4" className="pr-0">
														Practice Area
														</Col>
													<Col xs="8" className="pl-1">
														{opl.PracticeArea
															? opl.PracticeArea
															: "Not Available"}
													</Col>
												</Row>
											</>
										))
										: "No Products Found"}
									<hr
										className="mt-0 mb-0"
										style={{ borderStyle: "dashed" }}
									></hr>
								</>
							)
					)
					: "No Contract Details Found"}
			</Col>
		);
	};

	const costingOverview = (row) => {
		let finalProfile = null;
		const validStatus = ["3", "4", "5", "98"];
		if (_.includes(validStatus, row.ProjectStatus))
			finalProfile = _.head(
				row.CostingProfiles.filter((cp) => cp.ProfileStatus == "6")
			);
		let cvalues = finalProfile?.CostInputCurrency?.split("-");
		let currencyUnit = _.last(cvalues);
		let countryCode = _.head(cvalues);
		let conversionUnit = _.head(
			finalProfile?.ProfileSetting?.CurrenciesData?.filter(
				(cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
			)
		)?.ConversionRateToLocal;
		if (!conversionUnit) conversionUnit = 1;
		if (!currencyUnit) currencyUnit = "USD";

		return (
			<Col lg="3" md="3" sm="12" xs="12" className="border-right">
				{!finalProfile ? (
					<>
						<Row>
							<Col>
								<h5>Costing Overview</h5>
							</Col>
						</Row>
						<Row>
							<Col className="p-3">
								<Row className="justify-content-center text-center">
									<FontAwesomeIcon
										icon={faInfoCircle}
										className="text-muted mb-1"
										size="lg"
									/>
								</Row>
								<Row className="justify-content-center text-center">
									<h5>Final Summary Not Available</h5>
								</Row>
								<Row className="justify-content-center text-center">
									Waiting for the project to be Commissioned
								</Row>
							</Col>
						</Row>
					</>
				) : (
						<>
							<Row>
								<Col>
									<h5>Costing Overview</h5>
								</Col>
								{!finalProfile.IsImportedProfile ? (
									<Col>
										<Link className="small" to={`/summary/${finalProfile.id}`}>
											View Details
									</Link>
									</Col>
								) : null}
							</Row>
							<Row className="mb-2">
								<Col>Profile #{finalProfile.ProfileNumber}</Col>
								<Col>{finalProfile.ProfileName}</Col>
							</Row>
							<Row className="mb-2">
								<Col>Total Project Value</Col>
								<Col>{`${_.round(
									finalProfile.PriceToClient * conversionUnit,
									2
								)} ${currencyUnit}`}</Col>
							</Row>
							<Row className="mb-2">
								<Col>Total Internal Cost</Col>
								<Col>{`${_.round(
									finalProfile.TotalInternalCosts * conversionUnit,
									2
								)} ${currencyUnit}`}</Col>
							</Row>
							<Row className="mb-2">
								<Col>Total Third Party Cost</Col>
								<Col>{`${_.round(
									finalProfile.TotalExternalCosts * conversionUnit,
									2
								)} ${currencyUnit}`}</Col>
							</Row>
							<Row className="mb-2">
								<Col>Net Revenue</Col>
								<Col>{_.round(finalProfile.NetRevenuePercent * 100, 2)}%</Col>
							</Row>
							<Row className="mb-2">
								<Col>Out of Pocket</Col>
								<Col>
									{_.round(finalProfile.OutOfPocketCostPercent * 100, 2)}%
							</Col>
							</Row>
							<Row className="mb-2">
								<Col>Contribution Margin</Col>
								<Col>
									{_.round(finalProfile.ContributionMarginPercent * 100, 2)}%
							</Col>
							</Row>
							{finalProfile.ApprovalDetails &&
								finalProfile.ApprovalDetails.length &&
								finalProfile.ApprovalDetails
									.filter(ad => ad.Order <= finalProfile.ApprovalLevelNeeded).length ? (
									<>
										<Row>
											<Col>
												<strong>Approvals needed</strong>
											</Col>
										</Row>
										{finalProfile.ApprovalDetails.map((ad) => (
											<>
												<Row className="ml-1 mt-2"><strong>{ad.Label}</strong></Row>
												{ad.ApproverContacts?.map(contact =>
													contact.Order <= finalProfile.ApprovalLevelNeeded ? <Row>{console.log(contact, ad)}
														<Col>
															{contact.Approved ? (
																<FontAwesomeIcon
																	icon={faThumbsUp}
																	className="text-muted align-middle mr-2"
																	title="Appproval Granted"
																	size="sm"
																/>
															) :
																contact.Denied ? (

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

																	)}
															{contact.EmailAddress}
															{contact.IsMandatoryApprover ? (

																<FontAwesomeIcon
																	icon={faExclamationCircle}
																	title="Mandatory Approver for this level."
																	className="text-muted align-middle ml-2"
																	size="sm"
																/>
															) : null}
														</Col>
													</Row> : null)}
											</>
										))}
									</>
								) : (
									<div className="mt-2">
										<strong>No Approvals were required for this Costing</strong>
									</div>
								)}
						</>
					)}
			</Col>
		);
	};

	const timeline = (row) => {
		let finalProfile = null;
		const validStatus = ["3", "4", "5", "98"];
		if (_.includes(validStatus, row.ProjectStatus))
			finalProfile = _.head(
				row.CostingProfiles.filter((cp) => cp.ProfileStatus == "6")
			);
		let waveSpecs = finalProfile?.WaveSpecs;
		var currentwave = _.head(waveSpecs);
		const waveChanged = (val) => {
			currentwave = _.head(waveSpecs.filter((ws) => ws.id == val));
		};
		return (
			<Col lg="2" md="2" sm="12" xs="12" className="border-right">
				{waveSpecs && waveSpecs.length ? (
					<SchedulesData wavespecs={waveSpecs} />
				) : (
						<>
							<Row>
								<Col>
									<h5>Timeline</h5>
								</Col>
							</Row>
							<Col className="p-3">
								<Row className="justify-content-center text-center">
									<FontAwesomeIcon
										icon={faInfoCircle}
										className="text-muted mb-1"
										size="lg"
									/>
								</Row>
								<Row className="justify-content-center text-center">
									<h5>Schedule Not Available</h5>
								</Row>
								<Row className="justify-content-center text-center">
									Waiting for the project to be Commissioned
							</Row>
							</Col>
						</>
					)}
			</Col>
		);
	};
	const actions = (row) => {
		let finalProfile = null;
		const validStatus = ["3", "4", "5", "98"];
		if (_.includes(validStatus, row.ProjectStatus))
			finalProfile = _.head(
				row.CostingProfiles.filter((cp) => cp.ProfileStatus == "6")
			);
		return (
			<Col lg="1" md="1" sm="12" xs="12">
				<Row>
					<Col>
						<h5>Actions</h5>
					</Col>
				</Row>
				<Row>
					<Col xs="1">
						<Link
							to="/proposal"
							onClick={(e) =>
								dispatch(currentProjectActions.getProject(row.ProjectId))
							}
						>
							<FontAwesomeIcon icon={faPen} fixedWidth title="Edit Proposal" />
						</Link>

						{/* <FontAwesomeIcon icon={faCommentDollar} fixedWidth />
            <FontAwesomeIcon icon={faAddressCard} fixedWidth />
            <FontAwesomeIcon icon={faUserPlus} fixedWidth />
            <FontAwesomeIcon icon={faFilePdf} fixedWidth /> */}
						<Link>
							<FontAwesomeIcon
								icon={faFolder}
								fixedWidth
								title="Open Project Resources Folder"
								onClick={() => {
									window.open(
										"https://drive.google.com/drive/folders/" +
										row.ProjectResourcesFolderId
									);
								}}
							/>
						</Link>
						<Link>
							<FontAwesomeIcon
								icon={faFolderO}
								fixedWidth
								title="Open Costings Folder"
								onClick={() => {
									window.open(
										"https://drive.google.com/drive/folders/" +
										row.CostingsFolderId
									);
								}}
							/>
						</Link>
						{finalProfile ? <Link
							to="/schedule"
							title="Project Schedule"
							onClick={(e) => {
								dispatch(currentProjectActions.getProject(row.ProjectId));
								dispatch(getCosting(finalProfile.id))
							}
							}>
							<FontAwesomeIcon
								icon={faCalendarAlt}
								fixedWidth
							/>
						</Link> : null}
					</Col>

					{/* <Col xs="1">
						<FontAwesomeIcon icon={faTrash} fixedWidth />
						<FontAwesomeIcon icon={faCopy} fixedWidth />
						<FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
						<FontAwesomeIcon icon={faArchive} fixedWidth />
						<FontAwesomeIcon icon={faFileInvoiceDollar} fixedWidth />
						<FontAwesomeIcon icon={faCommentDots} fixedWidth />
						<FontAwesomeIcon icon={faComment} fixedWidth />
					</Col> */}
				</Row>
			</Col>
		);
	};
	const expandRow = {
		renderer: (row) =>
			app.recordloading && !row.isCostingOverviewLoaded ? (
				<Row className="justify-content-center details-section-loading">
					<Spinner size="small" color="#495057" />
				</Row>
			) : (
					<div>
						<Row>
							{projectDetails(row)}
							{salesforceColumn(row)}
							{costingOverview(row)}
							{timeline(row)}
							{actions(row)}
						</Row>
					</div>
				),
		showExpandColumn: true,
		expandHeaderColumnRenderer: ({ isAnyExpands }) =>
			isAnyExpands ? (
				<MinusCircle width={16} height={16} />
			) : (
					<PlusCircle width={16} height={16} />
				),
		expandColumnRenderer: ({ expanded }) =>
			expanded ? (
				<MinusCircle width={16} height={16} />
			) : (
					<PlusCircle width={16} height={16} />
				),
		onExpand: (row, isExpand, rowIndex, e) => {
			let commProfile = null;
			const validStatus = ["3", "4", "5", "98"];
			if (_.includes(validStatus, row.ProjectStatus))
				commProfile = _.head(
					row.CostingProfiles?.filter((cp) => cp.ProfileStatus == "6")
				);
			if (commProfile && !row.isCostingOverviewLoaded) {
				setTimeout(() => {
					dispatch(
						currentProjectActions.getIndividualProject(row.ProjectId, row.id)
					);
				});
			} else if (!commProfile) {
				setTimeout(() => {
					dispatch(currentProjectActions.setOverviewStatus(row));
				});
			}
		},
	};

	return (
		<Card>
			<CardBody className="p-4">
				<BootstrapTable
					hover
					striped
					bordered={false}
					responsive
					defaultSorted={[{ dataField: "createdAt", order: "desc" }]}
					bootstrap4
					keyField="id"
					data={tableData}
					columns={tableColumns}
					expandRow={expandRow}
				// pagination={paginationFactory({
				//   sizePerPage: 10,
				//   sizePerPageList: [5, 10, 25, 50],
				// })}
				/>
			</CardBody>
		</Card>
	);
};

const Tables = (props) => {
	return (
		<Container fluid className="p-0">
			<ExpandableRowsTable {...props} />
		</Container>
	);
};

export default Tables;

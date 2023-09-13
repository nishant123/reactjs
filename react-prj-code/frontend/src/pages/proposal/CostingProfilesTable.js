import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as currentCostingActions from "../../redux/actions/currentCostingActions";
import { Link, useHistory } from "react-router-dom";

import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Button,
	Row,
	Col,
	Badge,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { MinusCircle, PlusCircle } from "react-feather";
import { getLabel } from "../../utils/codeLabels";
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
	faExclamationTriangle,
	faInfoCircle,
	faFileExcel,
	faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { getProject } from "../../redux/actions/currentProjectActions";

const ExpandableRowsTable = ({ tableData, tableColumns, getCosting }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const currentCostingProfile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);
	const [deleteProfileModal, setDeleteProfileModal] = useState(false);
	const [deletableProfile, setDeletableProfile] = useState({});

	const profileSpecs = (row) => {
		return (
			<Col lg="4" md="4" sm="12" xs="12" className="border-right">
				<Row>
					<Col>
						<h5>Profile Specification</h5>
					</Col>
				</Row>
				<Row>
					<Col>Multi-Country</Col>
					<Col>{row.IsMultiCountry ? "Yes" : "No"}</Col>
				</Row>
				<Row>
					<Col>Fielding Countries</Col>
					<Col>
						{row.FieldingCountries?.split(",").map((item) => {
							return <Row>{getLabel("FieldingCountriesOptions", item)}</Row>;
						})}
					</Col>
				</Row>
				<Row>
					<Col>Methodology</Col>
					<Col>
						{row.Methodology?.split(",").map((item) => {
							return <Row>{getLabel("MethodologyOptions", item)}</Row>;
						})}
					</Col>
				</Row>
				<Row>
					<Col>Sub-Methodology</Col>
					<Col>
						{row.SubMethodology?.split(",").map((item) => {
							return <Row>{getLabel("SubMethodologyOptions", item)}</Row>;
						})}
					</Col>
				</Row>
				<Row>
					<Col>Study Type</Col>
					<Col>
						{row.StudyType?.split(",").map((item) => {
							return <Row>{getLabel("StudyTypeOptions", item)}</Row>;
						})}
					</Col>
				</Row>
				<Row>
					<Col>Tracker</Col>
					<Col>{row.IsTracker ? "Yes" : "No"}</Col>
				</Row>
				{row.IsTracker ? (
					<>
						<Row>
							<Col>Number of Waves</Col>
							<Col>{row.NumberOfWaves}</Col>
						</Row>
						<Row>
							<Col>Tracking Frequency</Col>
							<Col>
								{getLabel("TrackingFrequencyOptions", row.TrackingFrequency)}
							</Col>
						</Row>
					</>
				) : null}
				<Row>
					<Col>Costing Type</Col>
					<Col>{row.CostingType ? row.CostingType : "Not Selected"}</Col>
				</Row>
			</Col>
		);
	};
	const profitabilityChecks = (row) => {
		let cvalues = row?.CostInputCurrency?.split("-");
		let currencyUnit = _.last(cvalues);
		let countryCode = _.head(cvalues);
		let conversionUnit = _.head(
			row?.ProfileSetting?.CurrenciesData?.filter(
				(cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
			)
		)?.ConversionRateToLocal;
		if (!conversionUnit) conversionUnit = 1;
		if (!currencyUnit) currencyUnit = "USD";
		return (
			<Col lg="3" md="3" sm="12" xs="12" className="border-right">
				<Row>
					<Col>
						<h5>Profitability Checks</h5>
					</Col>
				</Row>
				<Row>
					<Col>
						<strong>Actual Price Given To Client</strong>
					</Col>
					<Col>
						<strong>{`${_.round(
							row.PriceToClient * conversionUnit,
							2
						)} ${currencyUnit}`}</strong>
					</Col>
				</Row>
				<Row className="mb-2">
					<Col>
						<strong>Minimum Recommended</strong>
					</Col>
					<Col>
						<strong>{`${_.round(
							row.RecommendedPrice * conversionUnit,
							2
						)} ${currencyUnit}`}</strong>
					</Col>
				</Row>
				<Row className="mb-2">
					<Col>Contribution Margin %</Col>
					<Col>{_.round(row.ContributionMarginPercent * 100, 2)}%</Col>
				</Row>
				<Row className="mb-2">
					<Col>Out of Pocket %</Col>
					<Col>{_.round(row.OutOfPocketCostPercent * 100, 2)}%</Col>
				</Row>
				<Row className="mb-2">
					<Col>Net Revenue %</Col>
					<Col>{_.round(row.NetRevenuePercent * 100, 2)}%</Col>
				</Row>
				<Row className="mb-2">
					<Col>Commercial Internal %</Col>
					<Col>{_.round(row.InternalCommercialCostPercent * 100, 2)}%</Col>
				</Row>
			</Col>
		);
	};
	const quickSummary = (row) => {
		let cvalues = row?.CostInputCurrency?.split("-");
		let currencyUnit = _.last(cvalues);
		let countryCode = _.head(cvalues);
		let conversionUnit = _.head(
			row?.ProfileSetting?.CurrenciesData?.filter(
				(cur) => cur.Code == countryCode && cur.CurrencyUnit == currencyUnit
			)
		)?.ConversionRateToLocal;
		if (!conversionUnit) conversionUnit = 1;
		if (!currencyUnit) currencyUnit = "USD";
		return (
			<Col lg="4" md="4" sm="12" xs="12" className="border-right">
				<Row>
					<Col>
						<h5>Quick Summary</h5>
					</Col>
					{/* {!row.IsImportedProfile ? (
						<Col>
							<Link className="small" to={`/summary/${row.id}`}>
								View Cost Breakdown
							</Link>
						</Col>
					) : null} */}
				</Row>
				<Row className="mb-2">
					<Col>
						<strong>Total Third Party Costs</strong>
					</Col>
					<Col>
						<strong>{`${_.round(
							row.TotalExternalCosts * conversionUnit,
							2
						)} ${currencyUnit}`}</strong>
					</Col>
				</Row>
				<Row className="mb-2">
					<Col>External Operations Costs</Col>
					<Col>{`${_.round(
						row.CostTotalExternalOperations * conversionUnit,
						2
					)} ${currencyUnit}`}</Col>
				</Row>
				<Row className="mb-2">
					<Col>External Commercial Costs</Col>
					<Col>{`${_.round(
						row.CostTotalExternalCommercial * conversionUnit,
						2
					)} ${currencyUnit}`}</Col>
				</Row>
				<Row className="mb-2">
					<Col>Internal Operations Costs</Col>
					<Col>{`${_.round(
						row.CostTotalInternalOperations * conversionUnit,
						2
					)} ${currencyUnit}`}</Col>
				</Row>
				<Row className="mb-2">
					<Col>Internal Commercial Costs</Col>
					<Col>{`${_.round(
						row.CostTotalInternalCommercial * conversionUnit,
						2
					)} ${currencyUnit}`}</Col>
				</Row>
				<Row className="mb-2">
					<Col>Overheads 16%</Col>
					<Col>{_.round(row.Overheads, 2)}</Col>
				</Row>
			</Col>
		);
	};
	const actions = (row) => {
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
							className={`${getLabel(
								"CostingStatusOptions",
								row.ProfileStatus
							).toLowerCase() == "in progress" && !row.IsImportedProfile
								? "pointer"
								: "no-actions"
								}`}
						>
							<FontAwesomeIcon
								icon={faPen}
								fixedWidth
								title="Edit Costing Profile"
								onClick={() => {
									if (
										getLabel(
											"CostingStatusOptions",
											row.ProfileStatus
										).toLowerCase() == "in progress" &&
										!row.IsImportedProfile
									)
										dispatch(
											currentCostingActions.getCosting(row.id, () =>
												history.push("/costing")
											)
										);
								}}
							/>
						</Link>
						<Link
							className={`${(row.CostingsSheetId && row.CostingType == "SHEETS") ? "pointer" : "no-actions"}`}
						>
							<FontAwesomeIcon
								icon={faFileExcel}
								title="Open Costings Sheet"
								fixedWidth
								onClick={() => {
									if (row.CostingType == "SHEETS")
										window.open(
											"https://docs.google.com/spreadsheets/d/" +
											row.CostingsSheetId
										);
								}}
							/>
						</Link>
						<Link
							className={`${row.AdditionalSheet ? "pointer" : "no-actions"}`}
						>
							<FontAwesomeIcon
								icon={faFileAlt}
								title="Open Additional Sheet"
								fixedWidth
								onClick={() => {
									window.open(
										"https://docs.google.com/spreadsheets/d/" +
										row.AdditionalSheet
									);
								}}
							/>
						</Link>

						{/* <FontAwesomeIcon icon={faCommentDollar} fixedWidth />
            <FontAwesomeIcon icon={faAddressCard} fixedWidth />
            <FontAwesomeIcon icon={faUserPlus} fixedWidth />
             */}

						{/* <Link className={row.IsImportedProfile ? "no-actions" : "pointer"}> */}
						<Link
							className={
								["6", "99"].indexOf(row.ProfileStatus) === -1
									? "pointer"
									: "no-actions"
							}
						>
							<FontAwesomeIcon
								icon={faTrash}
								fixedWidth
								title="Delete Costing Profile"
								onClick={(e) => {
									// if (!row.IsImportedProfile) {
									setDeleteProfileModal(true);
									setDeletableProfile(row);
									// }
								}}
							/>
						</Link>
						<Link
							className={
								["6", "99"].indexOf(row.ProfileStatus) === -1 &&
									!row.IsImportedProfile
									? "pointer"
									: "no-actions"
							}
						>
							<FontAwesomeIcon
								icon={faCopy}
								fixedWidth
								title="Create Duplicate Costing Profile"
								onClick={() => {
									dispatch(currentCostingActions.copyCosting(row.id));
								}}
							/>
						</Link>
						<Link
							className={
								getLabel(
									"CostingStatusOptions",
									row.ProfileStatus
								).toLowerCase() == "commissioned"
									? "pointer"
									: "no-actions"
							}
						>
							<FontAwesomeIcon
								title="View/Edit Project Schedule"
								icon={faCalendarAlt}
								fixedWidth
								onClick={() => {
									if (
										getLabel(
											"CostingStatusOptions",
											row.ProfileStatus
										).toLowerCase() == "commissioned"
									)
										dispatch(
											currentCostingActions.getCosting(row.id, () =>
												history.push("/schedule")
											)
										);
								}}
							/>
						</Link>
						<Link className={!row.IsImportedProfile ? "pointer" : "no-actions"}>
							<FontAwesomeIcon
								icon={faFileInvoiceDollar}
								fixedWidth
								title="View Costing Profile Summary"
								onClick={() => {
									dispatch(
										currentCostingActions.getCosting(
											row.id,
											() => {
												history.push(`/summary/${row.id}`);
											},
											true
										)
									);
								}}
							/>
						</Link>

						{/* <FontAwesomeIcon icon={faComment} fixedWidth /> */}
					</Col>
				</Row>
			</Col>
		);
	};

	const expandRow = {
		renderer: (row) => (
			<div>
				<Row>
					{profileSpecs(row)}
					{profitabilityChecks(row)}
					{quickSummary(row)}
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
	};

	return (
		<>
			<Card>
				<CardBody className="p-0">
					<BootstrapTable
						bootstrap4
						striped
						hover
						condensed
						bordered={false}
						className="m-1 mb-0"
						keyField="ProfileNumber"
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
			<Modal
				size="sm"
				isOpen={deleteProfileModal}
				toggle={() => setDeleteProfileModal(!deleteProfileModal)}
			>
				<ModalHeader toggle={() => setDeleteProfileModal(!deleteProfileModal)}>
					Delete Profile
				</ModalHeader>
				<ModalBody>
					<strong>
						This Change is Irreversible. Are you sure want to delete Profile-
						<i>{deletableProfile?.ProfileName}</i>
					</strong>
				</ModalBody>
				<ModalFooter>
					<Row className="justify-content-end">
						<Button
							color="secondary"
							size="sm"
							onClick={() => setDeleteProfileModal(!deleteProfileModal)}
						>
							Cancel
						</Button>
						<Button
							color="primary"
							className="ml-2"
							size="sm"
							onClick={() => {
								dispatch(
									currentCostingActions.deleteCosting(
										deletableProfile.id,
										() => {
											setDeletableProfile(null);
											setDeleteProfileModal(false);
										}
									)
								);
							}}
						>
							Confirm
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</>
	);
};

const CostingProfilesTables = (props) => {
	const dispatch = useDispatch();
	const currentCostingProfile = useSelector(
		({ currentCosting }) => currentCosting.currentCostingProfile
	);
	const costingProfiles = useSelector(
		({ costings }) => costings.costingProfiles
	);
	const updateCosting = (currentCostingProfile) =>
		dispatch({
			type: "UPDATE_NEW_COSTING",
			currentCostingProfile: currentCostingProfile,
		});

	const getCosting = (profile) =>
		dispatch(currentCostingActions.getCosting(profile));

	const [modal, setModal] = useState(false);

	const toggle = () => {
		// console.log("CALLED TOGGLE TO", !prevState);
		setModal(!modal);
	};
	const data = {
		tableColumns: [
			{ dataField: "ProfileNumber", text: "Profile Number", sort: true },
			{
				dataField: "ProfileName",
				text: "Profile Name",
				sort: true,
				formatter: (cell, row) => {
					return (
						<span>
							{cell}{" "}
							{row.IsImportedProfile ? (
								<FontAwesomeIcon
									className="warning pointer"
									icon={faExclamationTriangle}
									title="Profile Migrated from v1. Some features may not be available."
								/>
							) : null}
						</span>
					);
				},
			},
			{
				dataField: "ProfileEditNameButton",
				text: "",
				formatter: (cell, row) => {
					return (
						<FontAwesomeIcon
							icon={faPen}
							fixedWidth
							title="Edit Costing Profile"
							className={row.IsImportedProfile ? "no-actions" : "pointer"}
							style={{ cursor: "pointer" }}
							onClick={(e) => {
								if (row.IsImportedProfile) {
									e.preventDefault();
								} else {
									console.log("ROW HAS BEEN CLICKED");
									e.stopPropagation();
									dispatch(currentCostingActions.selectCosting(row));
									toggle();
								}
							}}
						/>
					);
				},
			},
			{
				dataField: "ProfileStatus",
				text: "Profile Status",
				sort: true,
				formatter: (cell, row) => {
					const label = getLabel("CostingStatusOptions", cell);
					return (
						<div className="text-center btn p-0" key={cell.id}>
							<Badge key={cell.id} color="secondary">
								{label}
							</Badge>
						</div>
					);
				},
			},
			{
				dataField: "CreatedBy",
				text: "Created By",
				sort: true,
				formatter: (cell) => {
					if (cell) {
						return cell
							.toLowerCase()
							.split("@")[0]
							.split(".")
							.map((word) => {
								return word.replace(word[0], word[0].toUpperCase());
							})
							.join(" ");
					} else {
						return "";
					}
				},
			},
			{
				dataField: "createdAt",
				text: "Created Date",
				sort: true,
				formatter: (cell) => {
					return cell.split("T")[0];
				},
			},
		],
		tableData: costingProfiles,
	};

	return (
		<>
			<Container fluid className="p-0">
				<ExpandableRowsTable {...data} getCosting={getCosting} />
			</Container>

			<Modal isOpen={modal} toggle={toggle} centered>
				<ModalHeader toggle={toggle}>Edit Costing Profile Name</ModalHeader>
				<ModalBody>
					<Input
						value={currentCostingProfile.ProfileName}
						onChange={(e) => updateCosting({ ProfileName: e.target.value })}
						placeholder="Enter Profile Name..."
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						color="primary"
						onClick={(e) => {
							toggle();
							dispatch(
								currentCostingActions.updateCostingProfiles(
									costingProfiles,
									currentCostingProfile
								)
							);
						}}
					>
						Rename
					</Button>
					<Button color="secondary" onClick={toggle}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default CostingProfilesTables;

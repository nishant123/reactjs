import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import {
	Button,
	Card,
	CardBody,
	CardTitle,
	CardHeader,
	Collapse,
	Modal,
	ModalBody,
	ModalHeader,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
	Col,
	ModalFooter,
} from "reactstrap";
import {
	createVertical,
	deleteVertical,
	saveVertical,
} from "../../../redux/actions/marketDefaultsActions";
import { useDispatch, useSelector } from "react-redux";
import { getLabel } from "../../../utils/codeLabels";
import ApprovalSettings from "./ApprovalSettings";
import Spinner from "../../../components/Spinner";

const Verticals = (props) => {
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(
		_.head(props.businessUnit.Verticals)?.Code
	);
	const [addVerticalModal, openAddVerticalModal] = useState(false);
	const [currentVertical, setCurrentVertical] = useState({});
	const [selectedVertical, setSelectedVertical] = useState({});
	const [openedApprovals, setOpenedApprovals] = useState({});
	const [verticalError, setVerticalError] = useState();
	const [currentDeletingVertical, setCurrentDeletingVertical] = useState({});
	const [verticalDeleteModal, openVerticalDeleteModal] = useState(false);
	const app = useSelector(({ app }) => app);

	const [fields, setFields] = useState({
		Info: {
			title: "Vertical/Business Unit Info",
			properties: {
				IsExternal: {
					label: "This is an external business unit/vertical",
					isCheckbox: true,
				},
			},
		},
		SFProbability: {
			title: "Salesforce Requirements",
			properties: {
				NeedsSFOpportunityNumber: {
					label: "Require SF Opportunity For New Proposals",
					isCheckbox: true,
				},
				NeedsSFStatusCheck: {
					label: "Check SF Opportunity Updates For Commmissioning",
					isCheckbox: true,
				},
				MinimumSFProbability: {
					label: "Minimum SF Probability Required",
					isRequired: true,
				},
			},
		},

		Templates: {
			title: "Project Templates",
			properties: {
				ProjectBoxTemplateId: {
					label: "ProjectBoxTemplateId",
					isRequired: true,
				},
				ProjectResourcesFolderId: {
					label: "ProjectResourcesFolderId",
					isRequired: true,
				},
				ProjectResourcesFolderTemplateId: {
					label: "ProjectResourcesFolderTemplateId",
					isRequired: true,
				},
				CostingsFolderId: {
					label: "CostingsFolderIds",
					isRequired: true,
				},
				ArchiveFolderId: {
					label: "ArchiveFolderId",
					isRequired: true,
				},
				GlobalCostingSheetTemplateId: {
					label: "GlobalCostingSheetTemplateId",
					isRequired: true,
				},
				AdditionalSheetTemplateId: {
					label: "AdditionalSheetTemplateId",
				},
				FolderOwnerEmail: {
					label: "Folders Owner Email (for transfer of ownership)",
				},
				NeedsGlobalCostingSheet: {
					label: "Allow Costing via Sheets",
					isCheckbox: true,
				},
			},
		},
		AutoCalcs: {
			title: "Auto Calculations",
			properties: {
				CalcCostOnlineExternalSample: {
					label: "Online External Sample (needs rate cards) (by wave)",

					isCheckbox: true,
				},
				CalcCostProgramming: {
					label: "TCS programming cost (by wave)",

					isCheckbox: true,
				},
				CalcCostDataProcessing: {
					label: "TCS DP cost (by wave)",

					isCheckbox: true,
				},
				CalcCostCharting: {
					label: "TCS charting cost (by wave)",

					isCheckbox: true,
				},
				CalcCostDataScience: {
					label: "Data science cost (by wave)",

					isCheckbox: true,
				},
				CalcCostCoding: {
					label: "Verbatim coding cost (by wave)",

					isCheckbox: true,
				},
				CalcCostOtherDataPrep: {
					label: "Other data prep cost (by wave)",

					isCheckbox: true,
				},
				CalcCostAdditionalOps: {
					label: "Additional ops cost (by wave)",

					isCheckbox: true,
				},
				CalcCostDataEntry: {
					label: "Data entry cost (by wave)",

					isCheckbox: true,
				},
				CalcCostOpsPM: {
					label: "Operations PM cost (by wave)",

					isCheckbox: true,
				},
				CalcCostCommercialTime: {
					label: "Commercial time cost (by wave)",

					isCheckbox: true,
				},
				CalcCostTextAnalytics: {
					label: "Text analytics cost (by wave)",

					isCheckbox: true,
				},
				CalcCostHosting: {
					label: "Online platform hosting cost (by wave)",

					isCheckbox: true,
				},
				UsesOOPMarkUp: {
					label: "Use OOP% instead of CM% to calculate markup",
					isCheckbox: true,
				},
				UsesOopOverrideIntCommCost: {
					label: "Calculate CS time cost using OOP%",
					isCheckbox: true,
				},
				UsesOopOverrideIntOpsCost: {
					label: "Calculate Internal Ops Time Cost using OOP%",
					isCheckbox: true,
				},
			},
		},
		ProfChecks: {
			title: "Profitability Checks",
			properties: {
				NeedsApprovalAlways: {
					label: "Always Require Approval For Commissioning",
					isCheckbox: true,
				},
				NeedsCommercialCostCheck: {
					label: "Check Minimum Commercial Cost %",
					isCheckbox: true,
				},
				NeedsContributionMarginCheck: {
					label: "Check Contribution Margin %",
					isCheckbox: true,
				},

				NeedsMinimumProjectValueCheck: {
					label: "Check Minimum Price To Client",
					isCheckbox: true,
				},
				NeedsNetRevenueCheck: {
					label: "Check Minimum Net Revenue %",
					isCheckbox: true,
				},
				NeedsOutOfPocketCostCheck: {
					label: "Check Out of Pocket %",
					isCheckbox: true,
				},
				NeedsNoPriceToClient: {
					label: "Skip Price To Client Input (only allowed for non-CI)",
					isCheckbox: true,
				},
			},
		},
		Rates: {
			title: "Rates and Thresholds",
			properties: {
				RateOpsPM: {
					label: "Ops PM hourly rate (USD)",
				},
				RateOpsDataPrep: {
					label: "Ops data prep/entry hourly rate (USD)",
				},
				PercentOverhead: {
					label: "Overhead % to apply to summary costs",
				},
				RateHosting: {
					label: "Online costing charge (per response collected) (USD)",
				},
				RateCodingFull: {
					label: "Verbatim coding charge per response (Full OE) (USD)",
				},
				RateCodingSemi: {
					label:
						"Verbatim coding charge per response (Semi-OE/ other specify) (USD)",
				},
				RateTextAnalytics: {
					label: "Text Analytics fixed unit charge (USD)",
				},
				TargetPercentContributionMargin: {
					label: "CM % for markup (and CM profitability check)",
				},
				TargetPercentOOPMarkUp: {
					label: "OOP % for markup",
				},
				ThresholdPercentIntCommCost: {
					label: "Commercial Time Cost % (for profitability check)",
				},

				ThresholdPercentNetRevenue: {
					label: "Net Revenue % (for profitability check)",
				},
				ThresholdPriceToClient: {
					label: "Minimum price to client (USD) (for profitability check)",
				},
				CostIntOpsMultiplier: {
					label: "Internal Ops Cost % Multiplier",
				},
				CostIntCommMultiplier: {
					label: "Internal Commercial Cost % Multiplier",
				},
			},
		},
	});
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	useEffect(() => {
		if (
			props.businessUnit.Verticals &&
			props.businessUnit.Verticals.length &&
			!activeTab
		) {
			setActiveTab(_.head(props.businessUnit.Verticals).Code);
		}
	});
	useEffect(() => {
		if (props.businessUnit.Verticals && activeTab) {
			let vertical = _.head(
				props.businessUnit.Verticals.filter((v) => v.Code == activeTab)
			);
			// console.log(vertical, "-----vertical-----");
			setCurrentVertical({ ...vertical });
		}
	}, [activeTab]);

	const changeHandler = (eve) => {
		let currentvertical = { ...currentVertical };
		currentvertical[eve.target.id] = eve.target.value;
		setCurrentVertical(currentvertical);
	};
	const addVertical = () => {
		if (selectedVertical.Code && selectedVertical.Label) {
			setVerticalError(null);
			dispatch(
				createVertical(
					props.businessUnit.id,
					selectedVertical,
					() => {
						setSelectedVertical({});
						openAddVerticalModal(false);
					},
					props.currentCountry.id
				)
			);
		} else {
			if (!selectedVertical.Code && !selectedVertical.Label) {
				setVerticalError("Please provide Code and Label");
			} else if (!selectedVertical.Code) {
				setVerticalError("Please provide Code");
			} else if (!selectedVertical.Label) {
				setVerticalError("Please provide Label");
			}
		}
	};
	const saveCurrentVertical = () => {
		let invalid = false;
		let updatedFields = { ...fields };
		props.setLocalPageload(true);
		Object.keys(updatedFields).map((field) => {
			Object.keys(updatedFields[field].properties).map((prp) => {
				if (
					!currentVertical[prp] &&
					updatedFields[field].properties[prp].isRequired
				) {
					updatedFields[field].properties[prp].isInvalid = true;
					invalid = true;
				} else {
					updatedFields[field].properties[prp].isInvalid = false;
				}
			});
			updatedFields[field] = {
				...updatedFields[field],
				properties: { ...updatedFields[field].properties },
			};
		});
		setFields(updatedFields);
		if (!invalid) {
			dispatch(
				saveVertical(currentVertical, props.currentCountry.id, () => {
					props.setLocalPageload(false);
				})
			);
		} else
			props.setLocalPageload(false);
	};
	const getVerticals = () => {
		let verticals = [];
		props.businessUnit.Verticals.map((v) => {
			verticals.push({ ...v, ApprovalSettings: [...v.ApprovalSettings] });
		});
		return verticals;
	};
	return (
		<Row
			className="m-0 font-sm business-verticals width-100"
			style={{ fontSize: "0.7rem" }}
		>
			<CardBody>
				{/* <Row className="m-0 font-sm"> */}
				<div>
					<Row className="float-right">
						<Button onClick={() => openAddVerticalModal(true)}>
							Add Vertical
						</Button>
					</Row>
					<Nav tabs>
						{props.businessUnit.Verticals?.map((vertical) => (
							<NavItem>
								<NavLink
									className={`${vertical.Code == activeTab ? "active-navlink" : ""
										}`}
									onClick={() => {
										setActiveTab(vertical.Code);
									}}
								>
									<h5>
										#{vertical.id}-{vertical.Label}
									</h5>
								</NavLink>
							</NavItem>
						))}
					</Nav>

					<TabContent activeTab={activeTab}>
						{props.businessUnit.Verticals
							? getVerticals().map((vertical) => (
								<TabPane tabId={vertical.Code}>
									<Row className="m-0 justify-content-end">
										<Button
											color="danger"
											size="sm"
											onClick={() => {
												setCurrentDeletingVertical(vertical);
												openVerticalDeleteModal(true);
											}}
										>
											Delete Vertical {vertical.Label}
										</Button>
									</Row>
									<Row className="mt-2 mb-2 justify-content-between">
										<Col>
											<h5>{vertical.Label}</h5>
										</Col>
										<Col className="float-right"></Col>
									</Row>
									<Row className="mt-4">
										{Object.keys(fields).map((field) => {
											return (
												<Card className="p-1 width-100">
													{/* {console.log(field, "field")} */}
													<Row className="m-2">
														<strong>{fields[field].title}</strong>
													</Row>
													<Row className="m-0">
														{Object.keys(fields[field].properties).map(
															(prp) => {
																if (
																	fields[field].properties[prp].isMultiselect
																) {
																	return (
																		<Col
																			lg="4"
																			md="4"
																			sm="6"
																			xs="12"
																			className="mb-2"
																		>
																			<label
																				className={`mb-0 ${fields[field].properties[prp]
																						.isInvalid
																						? "error"
																						: ""
																					}`}
																			>
																				{fields[field].properties[prp].label}{" "}
																				{fields[field].properties[prp]
																					.isRequired ? (
																						<sup>*</sup>
																					) : null}
																			</label>
																			<CreatableSelect
																				isMulti
																				value={currentVertical[prp]
																					?.split(",")
																					.map((val) => {
																						return { label: val, value: val };
																					})}
																				onChange={(val) => {
																					changeHandler({
																						target: {
																							id: prp,
																							value: val
																								? val
																									.map((v) => v.value)
																									.join()
																								: null,
																						},
																					});
																				}}
																				// todo:add options
																				options={currentVertical[prp]
																					?.split(",")
																					.map((val) => {
																						return { label: val, value: val };
																					})}
																			/>
																		</Col>
																	);
																} else if (
																	fields[field].properties[prp].isCheckbox
																)
																	return (
																		<Col
																			lg="4"
																			md="4"
																			sm="6"
																			xs="12"
																			className="mb-2"
																		>
																			<span>
																				<label
																					className={`mb-0 ${fields[field].properties[prp]
																							.isInvalid
																							? "error"
																							: ""
																						}`}
																					for={prp}
																				>
																					<input
																						type="checkbox"
																						id={prp}
																						className="mr-2"
																						onChange={(e) =>
																							changeHandler({
																								target: {
																									id: prp,
																									value: e.target.checked,
																								},
																							})
																						}
																						required={
																							fields[field].properties[prp]
																								.isRequired
																						}
																						checked={currentVertical[prp]}
																					/>
																					{
																						fields[field].properties[prp]
																							.label
																					}{" "}
																					{fields[field].properties[prp]
																						.isRequired ? (
																							<sup>*</sup>
																						) : null}
																				</label>
																			</span>
																		</Col>
																	);
																else
																	return (
																		<Col
																			lg="4"
																			md="4"
																			sm="6"
																			xs="12"
																			className="mb-2"
																		>
																			<span>
																				<label
																					className={`mb-0 ${fields[field].properties[prp]
																							.isInvalid
																							? "error"
																							: ""
																						}`}
																				>
																					{
																						fields[field].properties[prp]
																							.label
																					}{" "}
																					{fields[field].properties[prp]
																						.isRequired ? (
																							<sup>*</sup>
																						) : null}
																				</label>
																				<input
																					className="form-control"
																					id={prp}
																					onChange={changeHandler}
																					required={
																						fields[field].properties[prp]
																							.isRequired
																					}
																					value={
																						currentVertical[prp]
																							? currentVertical[prp]
																							: ""
																					}
																				/>
																			</span>
																		</Col>
																	);
															}
														)}
													</Row>
												</Card>
											);
										})}
									</Row>

									<Row className="float-right">
										<Button onClick={saveCurrentVertical} color="primary">
											Save Vertical
											</Button>
									</Row>
									<Row className="m-0">
										<Card className="mt-5 m-0 width-100">
											<CardHeader
												className="pointer"
												onClick={() =>
													setOpenedApprovals({
														...openedApprovals,
														[`${props.Code}-${currentVertical.Code}`]: !openedApprovals[
															`${props.Code}-${currentVertical.Code}`
														],
													})
												}
											>
												<CardTitle className="mb-0">
													Approval Settings - {currentVertical.Label} Vertical
													</CardTitle>
											</CardHeader>
											<Collapse
												isOpen={
													openedApprovals[
													`${props.Code}-${currentVertical.Code}`
													]
												}
											>
												<ApprovalSettings
													vertical={vertical}
													businessUnit={props.businessUnit}
													currentCountry={props.currentCountry}
													setLocalPageload={props.setLocalPageload}
												/>
											</Collapse>
										</Card>
									</Row>
								</TabPane>
							))
							: null}
					</TabContent>
				</div>
				{/* </Row> */}
			</CardBody>
			<Modal
				isOpen={addVerticalModal}
				toggle={() => openAddVerticalModal(!addVerticalModal)}
				size="sm"
			>
				<ModalHeader toggle={() => openAddVerticalModal(!addVerticalModal)}>
					<h4>Add Vertical</h4>
				</ModalHeader>
				<ModalBody>
					<Row className="ml-1 mb-2">
						<strong>
							Commissioning Country: <i>{props.currentCountry.Label}</i>
						</strong>
					</Row>
					<Row className="ml-1 mb-2">
						<strong>
							Business Unit: <i>{props.businessUnit.Label}</i>
						</strong>
					</Row>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							addVertical();
						}}
					>
						<Row className="mb-2">
							<Col>
								Code <sup>*</sup>
							</Col>
							<Col>
								<input
									className="form-control"
									required
									onChange={(e) =>
										setSelectedVertical({
											...selectedVertical,
											Code: e.target.value,
										})
									}
									id="Code"
								/>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col>
								Label <sup>*</sup>
							</Col>
							<Col>
								<input
									className="form-control"
									required
									onChange={(e) =>
										setSelectedVertical({
											...selectedVertical,
											Label: e.target.value,
										})
									}
									id="Label"
								/>
							</Col>
						</Row>
						<Row className="mr-4 mt-2 justify-content-end">
							<Button
								color="secondary"
								onClick={() => {
									openAddVerticalModal(!addVerticalModal);
									setSelectedVertical({});
								}}
							>
								Cancel
							</Button>
							<Button color="primary" type="submit" className="ml-2">
								Add
								{app.recordloading ? (
									<Spinner size="small" color="#495057" />
								) : null}
							</Button>
						</Row>
					</form>
				</ModalBody>
				{/* <ModalFooter>
				<Row>
					{verticalError ? <p className="error">{verticalError}</p> : null}
				</Row>
				
			</ModalFooter> */}
			</Modal>

			<Modal
				isOpen={verticalDeleteModal}
				size="sm"
				toggle={() => openVerticalDeleteModal(!verticalDeleteModal)}
			>
				<ModalHeader
					toggle={() => openVerticalDeleteModal(!verticalDeleteModal)}
				>
					Delete Vertical
				</ModalHeader>
				<ModalBody>
					<strong>
						This Change is irreversible. Are you sure want to delete{" "}
						<i>{currentDeletingVertical?.Label}</i>
					</strong>
				</ModalBody>
				<ModalFooter>
					<Row className="justify-content-end mt-2 mr-4">
						<Button
							size="sm"
							color="secondary"
							onClick={() => {
								openVerticalDeleteModal(false);
								setCurrentDeletingVertical(null);
							}}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							color="primary"
							className="ml-2"
							onClick={() => {
								props.setLocalPageload(true);
								dispatch(
									deleteVertical(
										currentDeletingVertical,
										() => {
											openVerticalDeleteModal(false);
											setActiveTab(null);
											setCurrentDeletingVertical(null);
											props.setLocalPageload(false);
										},
										props.currentCountry.id
									)
								);
							}}
						>
							Confirm
							{app.recordloading ? (
								<Spinner size="small" color="#495057" />
							) : null}
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</Row>
	);
};

export default Verticals;

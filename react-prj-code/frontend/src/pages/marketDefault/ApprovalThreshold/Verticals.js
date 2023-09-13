import React, { useEffect, useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import _ from "lodash";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
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
import { createVertical } from "../../../redux/actions/marketDefaultsActions";
import { useDispatch, useSelector } from "react-redux";
import { getLabel } from "../../../utils/codeLabels";

const Verticals = (props) => {
	console.log(props, "props for verticals");
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(
		_.head(props.businessUnit.Verticals).Code
	);
	const [addVerticalModal, openAddVerticalModal] = useState(false);
	const [currentVertical, setCurrentVertical] = useState({});
	const [selectedVertical, setSelectedVertical] = useState();
	const [openedApprovals, setOpenedApprovals] = useState({});
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);

	useEffect(() => {
		if (props.businessUnit.Verticals && activeTab) {
			setCurrentVertical(
				_.head(props.businessUnit.Verticals.filter((v) => v.Code == activeTab))
			);
		}
	}, [activeTab]);
	let fields = {
		External: {
			title: "External",
			properties: {
				IsExternal: { label: "IsExternal", isRequired: true, isCheckbox: true },
			},
		},
		SFProbability: {
			title: "SF Probability",
			properties: {
				MinimumSFProbability: {
					label: "MinimumSFProbability",
					isRequired: true,
				},
				NeedsSFOpportunityNumber: {
					label: "NeedsSFOpportunityNumber",
					isRequired: true,
				},
				NeedsSFStatusCheck: { label: "NeedsSFStatusCheck", isRequired: true },
			},
		},
		Other: {
			title: "Required fields",
			properties: {
				NeedsApprovalAlways: { label: "NeedsApprovalAlways", isRequired: true },
				NeedsCommercialCostCheck: {
					label: "NeedsCommercialCostCheck",
					isRequired: true,
				},
				NeedsContributionMarginCheck: {
					label: "NeedsContributionMarginCheck",
					isRequired: true,
				},
				NeedsGlobalCostingSheet: {
					label: "NeedsGlobalCostingSheet",
					isRequired: true,
				},
				NeedsMinimumProjectValueCheck: {
					label: "NeedsMinimumProjectValueCheck",
					isRequired: true,
				},
				NeedsNetRevenueCheck: {
					label: "NeedsNetRevenueCheck",
					isRequired: true,
				},
				NeedsOutOfPocketCostCheck: {
					label: "NeedsOutOfPocketCostCheck",
					isRequired: true,
				},
				NeedsNoPriceToClient: {
					label: "NeedsNoPriceToClient",
					isRequired: true,
				},
			},
		},
		Project: {
			title: "Project",
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
			},
		},
	};
	const changeHandler = (eve) => {
		let currentvertical = { ...currentVertical };
		currentvertical[eve.target.id] = eve.target.value;
		setCurrentVertical(currentvertical);
	};
	return (
		<Row className="m-0 font-sm" style={{ fontSize: "0.7rem" }}>
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
									className={`${
										vertical.Code == activeTab ? "active-navlink" : ""
									}`}
									onClick={() => {
										setActiveTab(vertical.Code);
									}}
								>
									<h4>
										{props.businessUnit.Label}-{vertical.Label}
									</h4>
								</NavLink>
							</NavItem>
						))}
					</Nav>

					<TabContent activeTab={activeTab}>
						{props.businessUnit.Verticals?.map((vertical) => (
							<TabPane tabId={vertical.Code}>
								<Row className="mt-4">
									{Object.keys(fields).map((field) => {
										return (
											<Card className="p-2 width-100">
												{console.log(field, "field")}
												<Row className="m-2">
													<strong>{fields[field].title}</strong>
												</Row>
												<Row className="m-0">
													{Object.keys(fields[field].properties).map((prp) => {
														if (fields[field].properties[prp].isMultiselect) {
															return (
																<Col
																	lg="4"
																	md="4"
																	sm="6"
																	xs="12"
																	className="mb-2"
																>
																	<label className="mb-0">
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
																						? val.map((v) => v.value).join()
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
														} else if (fields[field].properties[prp].isCheckbox)
															return (
																<Col
																	lg="4"
																	md="4"
																	sm="6"
																	xs="12"
																	className="mb-2"
																>
																	<span>
																		<label className="mb-0" for={prp}>
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
																				defaultChecked={currentVertical[prp]}
																			/>
																			{fields[field].properties[prp].label}{" "}
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
																		<label className="mb-0">
																			{fields[field].properties[prp].label}{" "}
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
																				fields[field].properties[prp].isRequired
																			}
																			value={currentVertical[prp]}
																		/>
																	</span>
																</Col>
															);
													})}
												</Row>
											</Card>
										);
									})}
								</Row>

								<Row className="float-right">
									<Button className="btn-success">Save</Button>
								</Row>

								<Card className="m-0">
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
										<CardTitle>Approvals</CardTitle>
									</CardHeader>
									<Collapse
										isOpen={
											openedApprovals[`${props.Code}-${currentVertical.Code}`]
										}
									>
										This are Approvals
									</Collapse>
								</Card>
							</TabPane>
						))}
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
					Business Unit: {getLabel("BusinessUnitOptions", props.Code)}
					<select
						className="form-control"
						onChange={(eve) =>
							setSelectedVertical(
								codeLabels.VerticalOptions.map(
									(vertical) => vertical.Code == eve.target.value
								)
							)
						}
					>
						{codeLabels.VerticalOptions.map((vertical) => (
							<option value={vertical.Code}>{vertical.Label}</option>
						))}
					</select>
				</ModalBody>
				<ModalFooter>
					<Button
						className="btn-warning"
						onClick={() => openAddVerticalModal(!addVerticalModal)}
					>
						Cancel
					</Button>
					<Button
						className="btn-success"
						onClick={() =>
							dispatch(createVertical(props.businessUnit.id, selectedVertical))
						}
					>
						Add
					</Button>{" "}
				</ModalFooter>
			</Modal>
		</Row>
	);
};

export default Verticals;

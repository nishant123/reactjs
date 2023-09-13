import React, { useEffect, useState } from "react";
import {
	Container,
	Card,
	CardHeader,
	CardBody,
	CardText,
	CardTitle,
	Col,
	Row,
	Label,
	Input,
	Nav,
	NavItem,
	NavLink,
	TabPane,
	TabContent,
	Button,
	ModalFooter,
	Modal,
	ModalHeader,
	ModalBody,
	Collapse,
} from "reactstrap";
import _ from "lodash";
import Form from "react-bootstrap/Form";
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

import {
	createBusinessUnit,
	createCustomLayouts,
	deleteBusinessUnit,
	saveBusinessUnit,
} from "../../../redux/actions/marketDefaultsActions";
import { getLabel } from "../../../utils/codeLabels";
import { useDispatch, useSelector } from "react-redux";
import Verticals from "./Verticals";
import ClientServiceRates from "./ClientServiceRates";
import Spinner from "../../../components/Spinner";

const ApprovalThreshold = (props) => {
	const dispatch = useDispatch();
	const [showMiniOppor, setShowMiniOppor] = useState(false);
	const [businessUnitModal, openBusinessUnitModal] = useState(false);
	const [addableBusinessUnit, setAddableBusinessUnit] = useState({});
	const [businessError, setBusinessError] = useState();

	const [activeTab, setActiveTab] = useState(
		_.head(props.currentCountry.BusinessUnits)?.Code
	);
	const [currentBusinessUnit, setCurrentBusinessUnit] = useState({});
	const [selectedBusinessUnit, setSelectedBusinessUnit] = useState();
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const [openedVerticals, setOpenedVerticals] = useState({});

	const [deleteBUModal, openDeleteBUModal] = useState(false);
	const [deletingBusinessUnit, setDeletingBusinessUnit] = useState({});
	const app = useSelector(({ app }) => app);

	const [businessCollapse, setBusinessCollapse] = useState({});
	const [fields, setFields] = useState({
		//need to cater for sections both here in BU as well as vertical - e.g. section title (Internal EWN Recepients /Ext EWN Recepients)
		InternalEwnRecipients: {
			title: "NielsenIQ Internal Teams EWN Recipients",
			properties: {
				EwnInternalOpsPM: {
					label: "Primary Internal Operations Contact",

					isMultiselect: true,
				},
				EwnInternalCharts: {
					label: "Charting",

					isMultiselect: true,
				},
				EwnInternalDashboards: {
					label: "Dashboarding",

					isMultiselect: true,
				},
				EwnInternalDataProcessing: {
					label: "Data Processing",

					isMultiselect: true,
				},
				EwnInternalDataScience: {
					label: "Data Science",

					isMultiselect: true,
				},
				EwnInternalFieldwork: {
					label: "Fieldwork",

					isMultiselect: true,
				},

				EwnInternalProgramming: {
					label: "Programming",

					isMultiselect: true,
				},
				EwnInternalTranslations: {
					label: "Translations",

					isMultiselect: true,
				},
				EwnInternalVerbatimCoding: {
					label: "Verbatim Coding",

					isMultiselect: true,
				},
				EwnInternalFinance: {
					label: "Finance",

					isMultiselect: true,
				},
				EwnInternalBCC: {
					label: "BCC All Internal EWNs",

					isMultiselect: true,
				},
			},
		},
		ExternalEwnRecipients: {
			title: "External EWN Recipients",
			properties: {
				EwnExternalOpsPM: {
					label: "Primary External Operations Contact",
					isMultiselect: true,
				},
				EwnExternalCharts: {
					label: "Charting",

					isMultiselect: true,
				},
				EwnExternalDashboards: {
					label: "Dashboarding",

					isMultiselect: true,
				},
				EwnExternalDataProcessing: {
					label: "Data Processing",

					isMultiselect: true,
				},
				EwnExternalDataScience: {
					label: "Data Science",

					isMultiselect: true,
				},
				EwnExternalFieldwork: {
					label: "Fieldwork",

					isMultiselect: true,
				},

				EwnExternalProgramming: {
					label: "Programming",

					isMultiselect: true,
				},
				EwnExternalTranslations: {
					label: "Translations",

					isMultiselect: true,
				},
				EwnExternalVerbatimCoding: {
					label: "Verbatim Coding",

					isMultiselect: true,
				},
			},
		},

		// Other: {
		// 	title: "Custom Form layouts",
		// 	properties: {
		// 		UsesCustomFormLayouts: {
		// 			label: "Uses Custom Layouts",
		// 			isCheckbox: true,
		// 		},
		// 	},
		// },
	});
	useEffect(() => {
		if (
			props.currentCountry.BusinessUnits &&
			props.currentCountry.BusinessUnits.length &&
			!activeTab
		) {
			setActiveTab(_.head(props.currentCountry.BusinessUnits).Code);
		}
	});
	useEffect(() => {
		if (props.currentCountry.BusinessUnits && activeTab) {
			setCurrentBusinessUnit(
				_.head(
					props.currentCountry.BusinessUnits.filter(
						(bu) => bu.Code == activeTab
					)
				)
			);
		}
	}, [activeTab]);
	const addBusinessUnit = () => {
		if (addableBusinessUnit.Code && addableBusinessUnit.Label) {
			setBusinessError(null);
			dispatch(
				createBusinessUnit(props.currentCountry.id, addableBusinessUnit, () => {
					setAddableBusinessUnit({});
					openBusinessUnitModal(false);
				})
			);
		} else {
			if (!addableBusinessUnit.Code && !addableBusinessUnit.Label) {
				setBusinessError("Please provide Code and Label");
			} else if (!addableBusinessUnit.Code) {
				setBusinessError("Please provide Code");
			} else if (!addableBusinessUnit.Label) {
				setBusinessError("Please provide Label");
			}
		}
	};
	const changeHandler = (eve) => {
		let currentbusinessunit = { ...currentBusinessUnit };
		currentbusinessunit[eve.target.id] = eve.target.value;
		setCurrentBusinessUnit(currentbusinessunit);
	};
	const saveBusinessCurrentUnit = () => {
		let invalid = false;
		let updatedFields = { ...fields };
		props.setLocalPageload(true)
		Object.keys(updatedFields).map((field) => {
			Object.keys(updatedFields[field].properties).map((prp) => {
				if (
					!currentBusinessUnit[prp] &&
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
		if (!invalid) dispatch(saveBusinessUnit(currentBusinessUnit, () => props.setLocalPageload(false)));
	};
	return (
		<>
			<Row className="float-right">
				<Button onClick={() => openBusinessUnitModal(true)}>
					Add Business Unit
				</Button>
			</Row>
			<Nav tabs>
				{props.currentCountry.BusinessUnits?.map((bu) => (
					<NavItem>
						<NavLink
							className={`${bu.Code == activeTab ? "active-navlink" : ""}`}
							onClick={() => {
								setActiveTab(bu.Code);
							}}
						>
							<CardTitle>
								{"#"}
								{bu.id} {bu.Label}
								{" - "}
								{props.currentCountry.Code}
							</CardTitle>
						</NavLink>
					</NavItem>
				))}
			</Nav>

			<TabContent activeTab={activeTab} className="pt-1">
				{props.currentCountry.BusinessUnits?.map((bu) => (
					<TabPane tabId={bu.Code}>
						<Row className="justify-content-end mb-2">
							<Button
								color="danger"
								size="sm"
								onClick={() => {
									openDeleteBUModal(true);
									setDeletingBusinessUnit(bu);
								}}
							>
								Delete Business Unit
							</Button>
						</Row>
						<Card className="">
							<CardHeader
								className="pointer"
								onClick={() =>
									setBusinessCollapse({
										...businessCollapse,
										[currentBusinessUnit.Code]: {
											...businessCollapse[currentBusinessUnit.Code],
											Settings: !businessCollapse[currentBusinessUnit.Code]
												?.Settings,
										},
									})
								}
							>
								<CardTitle className="mb-0">
									{bu.Label}
									{" - "}
									{props.currentCountry.Code} Settings
								</CardTitle>
							</CardHeader>
							<Collapse
								isOpen={businessCollapse[currentBusinessUnit.Code]?.Settings}
							>
								{/* <Col> */}
								<Row
									className="m-0 font-sm business-verticals"
									style={{ fontSize: "0.7rem" }}
								>
									{Object.keys(fields).map((field) => {
										return (
											<Card className="p-0 width-100">
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
																	<label
																		className={`mb-0 ${fields[field].properties[prp].isInvalid
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
																		value={currentBusinessUnit[prp]
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
																		options={currentBusinessUnit[prp]
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
																		<label
																			className={`mb-0 ${fields[field].properties[prp].isInvalid
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
																				defaultChecked={
																					currentBusinessUnit[prp]
																				}
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
																		<label
																			className={`mb-0 ${fields[field].properties[prp].isInvalid
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
																		<input
																			className="form-control"
																			id={prp}
																			onChange={changeHandler}
																			required={
																				fields[field].properties[prp].isRequired
																			}
																			value={currentBusinessUnit[prp]}
																		/>
																	</span>
																</Col>
															);
													})}
												</Row>
											</Card>
										);
									})}

									<Card className="width-100">
										<Row className="m-2">
											<strong>Form Templates Setup</strong>
										</Row>
										<Row className="m-2">
											<Col>
												<label for="UsesCustomFormLayouts">
													<input
														type="checkbox"
														id="UsesCustomFormLayouts"
														disabled={true}
														checked={currentBusinessUnit.UsesCustomFormLayouts}
													// onChange={(e) => {
													// 	changeHandler({
													// 		target: {
													// 			id: "UsesCustomFormLayouts",
													// 			value: e.target.checked,
													// 		},
													// 	});
													// }}
													/>{" "}
													This Business Unit uses custom form layouts For
													methodologies{" "}
												</label>
											</Col>
											<Col>
												<Button
													disabled={true} // always disabling for now as userinstructions have not been given. {currentBusinessUnit.UsesCustomFormLayouts}
													onClick={() => {
														props.setLocalPageload(true)
														dispatch(
															createCustomLayouts(currentBusinessUnit, () => {
																setCurrentBusinessUnit({
																	...currentBusinessUnit,
																	UsesCustomFormLayouts: true,
																});
																props.setLocalPageload(false)
															}
															)
														)
													}
													}
												>
													Create Custom Layouts
													
												</Button>
											</Col>
										</Row>
									</Card>
								</Row>
								<Row className="float-right mb-2">
									<Col>
										<Button color="primary" onClick={saveBusinessCurrentUnit}>
											Save Business Unit
											
										</Button>
									</Col>
								</Row>
								{/* </Col> */}
							</Collapse>
						</Card>

						<Card>
							<CardHeader
								className="pointer"
								onClick={() =>
									setBusinessCollapse({
										...businessCollapse,
										[currentBusinessUnit.Code]: {
											...businessCollapse[currentBusinessUnit.Code],
											ServiceRates: !businessCollapse[currentBusinessUnit.Code]
												?.ServiceRates,
										},
									})
								}
							>
								<CardTitle className="mb-0">
									{bu.Label}
									{" - "}
									{props.currentCountry.Code} Client Service Rates
								</CardTitle>
							</CardHeader>
							<Collapse
								isOpen={
									businessCollapse[currentBusinessUnit.Code]?.ServiceRates
								}
							>
								<ClientServiceRates
									businessUnit={bu}
									currentCountry={props.currentCountry}
								/>
							</Collapse>
						</Card>

						<Card>
							<CardHeader
								className="pointer"
								onClick={() =>
									setBusinessCollapse({
										...businessCollapse,
										[currentBusinessUnit.Code]: {
											...businessCollapse[currentBusinessUnit.Code],
											Verticals: !businessCollapse[currentBusinessUnit.Code]
												?.Verticals,
										},
									})
								}
							>
								<CardTitle className="mb-0">
									{bu.Label}
									{" - "}
									{props.currentCountry.Code} Verticals
								</CardTitle>
							</CardHeader>
							<Collapse
								isOpen={businessCollapse[currentBusinessUnit.Code]?.Verticals}
							>
								<Verticals
									businessUnit={bu}
									currentCountry={props.currentCountry}
									setLocalPageload={props.setLocalPageload}
								/>
							</Collapse>
						</Card>
					</TabPane>
				))}
			</TabContent>
			<Modal
				isOpen={deleteBUModal}
				size="sm"
				toggle={() => openDeleteBUModal(false)}
			>
				<ModalHeader toggle={() => openDeleteBUModal(false)}>
					Delete Business Unit
				</ModalHeader>
				<ModalBody>
					<strong>
						This change is irreversible, are you sure to delete{" "}
						<i>{deletingBusinessUnit.Label}</i> Business Unit?
					</strong>
				</ModalBody>
				<ModalFooter>
					<Row>
						<Button
							color="secondary"
							size="sm"
							onClick={() => openDeleteBUModal(false)}
						>
							Cancel
						</Button>
						<Button
							color="warning"
							size="sm"
							className="ml-2"
							onClick={() => {
								// setLocalPageload(true)
								dispatch(
									deleteBusinessUnit(deletingBusinessUnit.id, () => {
										// setLocalPageload(false)
										openDeleteBUModal(false);
										setActiveTab(null);
									}, deletingBusinessUnit.CountryId)
								);
							}}
						>
							Ok
							{app.recordloading && deleteBUModal ? (
								<Spinner size="small" color="#495057" />
							) : null}
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
			<Modal
				isOpen={businessUnitModal}
				toggle={() => openBusinessUnitModal(!businessUnitModal)}
				size="sm"
			>
				<ModalHeader toggle={() => openBusinessUnitModal(!businessUnitModal)}>
					<CardTitle>Add Business Unit</CardTitle>
				</ModalHeader>
				<ModalBody>
					<Row className="ml-1 mb-2">
						<strong>
							Commissioning Country: <i>{props.currentCountry.Label}</i>
						</strong>
					</Row>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							addBusinessUnit();
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
										setAddableBusinessUnit({
											...addableBusinessUnit,
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
										setAddableBusinessUnit({
											...addableBusinessUnit,
											Label: e.target.value,
										})
									}
									id="Label"
								/>
							</Col>
						</Row>
						<Row className=" mr-4 mt-2 justify-content-end">
							<Button
								color="secondary"
								onClick={() => {
									setAddableBusinessUnit({});
									openBusinessUnitModal(false);
								}}
							>
								Cancel
							</Button>
							<Button color="primary" className="ml-2" type="submit">
								Add{" "}
								{app.recordloading ? (
									<Spinner size="small" color="#495057" />
								) : null}
							</Button>
						</Row>
					</form>
					{/* {getLabel("FieldingCountriesOptions", props.CountryCode)} */}
				</ModalBody>
				{/* <ModalFooter>
					<Row>
						{businessError ? <p className="error">{businessError}</p> : null}
					</Row>
					
				</ModalFooter> */}
			</Modal>
		</>
	);
};

export default ApprovalThreshold;

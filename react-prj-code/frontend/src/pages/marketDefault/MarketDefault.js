import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/Dashboard";
import Navbar from "../../components/NavbarMarketDefaults";
import MarketRates from "./MarketRates/MarketRates";
import { Tabs, Tab, Nav } from "react-bootstrap";
import {
	Container,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	CardText,
	CardTitle,
	Col,
	Row,
	Label,
	Button,
	Table,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
} from "reactstrap";
import Select from "react-select";
import * as actions from "../../redux/actions/marketDefaultsActions";
import { useDispatch, useSelector } from "react-redux";
import BusinessUnits from "./BusinessUnits/BusinessUnits";
import ApproverContacts from "./ApproverContacts/ApproverContacts";
import GoogleDriveFolderIds from "./GoogleDriveFolderIds/GoogleDriveFolderIds";
import NotificationRecipients from "./NotificationRecipients/NotificationRecipients";
import BootstrapTable from "react-bootstrap-table-next";
import Form from "react-bootstrap/Form";
import Spinner from "../../components/Spinner";
import CreatableSelect from "react-select/creatable";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import { recordLoadEnd } from "../../redux/actions/appActions";

const MarketDefault = (props) => {
	const dispatch = useDispatch();
	const markets = useSelector(({ marketdefaults }) => marketdefaults.items);
	const [isAddOfficeModal, openAddOfficeModal] = useState(false);
	const [addableOffice, setAddableOffice] = useState({});
	const [officeError, setOfficeError] = useState();
	const globallocalPageload = useSelector(({ app }) => app.localPageload)
	const [requestModal, setRequestModal] = useState(false);
	const [currentRequest, setCurrentRequest] = useState({});
	const [requestTypeDeleteModal, openRequestTypeDeleteModal] = useState(false);

	const [currentOffice, setCurrentOffice] = useState({});
	const [officeDeleteModal, openOfficeDeleteModal] = useState(false);

	const [marketsCalled, setMarketsCalled] = useState(false)

	const [localPageload, setLocalPageload] = useState(false)

	useEffect(() => {
		if (!markets && !marketsCalled) {
			setMarketsCalled(true)
			dispatch(actions.getMarkets(true))
		};
	});
	const app = useSelector(({ app }) => app);
	// const loadItems = () => {
	//     dispatch({
	//         type: actions.loadItems, items: {
	//             ...items,
	//             pakistan: {
	//                 ...items.pakistan,
	//                 marketRates: 2,
	//             }
	//         }
	//     });
	// }

	const [selectedCountry, setSelectedCountry] = useState();

	const addOffice = () => {
		if (addableOffice.Code && addableOffice.Label) {
			setOfficeError(null);
			dispatch(
				actions.createOffice(selectedCountry.id, addableOffice, () => {
					setAddableOffice({});
					openAddOfficeModal(false);
				})
			);
		} else {
			if (!addableOffice.Code && !addableOffice.Label) {
				setOfficeError("Please provide Code and Label");
			} else if (!addableOffice.Code) {
				setOfficeError("Please provide Code");
			} else if (!addableOffice.Label) {
				setOfficeError("Please provide Label");
			}
		}
	};
	let columns = [
		{
			dataField: "id",
			text: "#",
			sort: true,
		},
		{
			dataField: "Label",
			text: "Country",
			sort: true,
		},
		{
			dataField: "Code",
			text: "Country Code",
			sort: true,
		},
	];
	let officeColumns = [
		{
			dataField: "id",
			text: "#",
		},
		{
			dataField: "Label",
			text: "Location/Type",
			editable: true,
		},
		{
			dataField: "Code",
			text: "Code",
			editable: true,
		},
		{
			text: "",
			editable: false,
			formatter: (cell, row) => {
				return (
					<>
						<Button
							size="sm"
							color="success"
							onClick={() => {
								setCurrentOffice(row);
								setLocalPageload(true)
								dispatch(
									actions.saveOffice(row, () => {
										setCurrentRequest(null);
										setLocalPageload(false)
									}, row.CountryId)
								);
							}}
						>
							Save
						</Button>
						<Button
							size="sm"
							color="danger"
							className="ml-2"
							onClick={() => {
								setCurrentOffice(row);
								openOfficeDeleteModal(true);
							}}
						>
							Delete
						</Button>
					</>
				);
			},
		},
	];
	let requestColumns = [
		{
			dataField: "id",
			text: "#",
		},
		{
			dataField: "RequestTypeName",
			text: "Request Type",
			editable: true,
		},
		{
			dataField: "PrimaryContactEmails",
			text: "Primary Contact Emails",
			editable: true,
		},
		{
			dataField: "OtherContactEmails",
			text: "Other Contact Emails",
			editable: true,
		},
		{
			dataField: "Comments",
			text: "Comments",
			editable: true,
		},
		{
			dataField: "CreatedBy",
			text: "Created By",
			editable: false,
		},
		{
			dataField: "updatedAt",
			text: "Updated At",
			editable: false,
		},
		{
			text: "",
			editable: false,
			formatter: (cell, row) => {
				return (
					<>
						<Button
							size="sm"
							color="success"
							onClick={() => {
								setLocalPageload(true)
								setCurrentRequest(row);
								dispatch(
									actions.saveRequestType(row, () => {
										setCurrentRequest(null);
										setLocalPageload(false);
									}, row.CountryId)
								);
							}}
						>
							Save
							{/* {app.recordloading && currentRequest.id == row.id ? (
								<Spinner size="small" color="#495057" />
							) : null} */}
						</Button>
						<Button
							size="sm"
							color="danger"
							className="ml-2"
							onClick={() => {
								setCurrentRequest(row);
								openRequestTypeDeleteModal(true);
							}}
						>
							Delete
						</Button>
					</>
				);
			},
		},
	];

	const countryChangeHandler = (eve) => { };
	const addRequestType = () => {
		dispatch(
			actions.addRequestType(selectedCountry.id, currentRequest, () => {
				setSelectedCountry(null);
				setCurrentRequest(null);
				setRequestModal(false);
			})
		);
	};
	const expandRow = {
		renderer: (row) => (
			(app.recordloading && !row.BusinessUnits)
				? <Row className="justify-content-center details-section-loading"><Spinner size="small" color="#495057" /></Row>
				: <React.Fragment>
					<Row
						className="m-0 p-0 font-sm business-verticals width-100"
						style={{ fontSize: "0.7rem" }}
					>
						<Col>
							<Card className="p-0">
								<CardHeader>
									<Row className="justify-content-between">
										<Col className="text-left">
											<CardTitle>
												{"#"}
												{row.id} {row.Label}
												{" - "} {row.Code}
											</CardTitle>
										</Col>
										<Col className="text-right">
											<CardText>
												{row.updatedAt
													? `Last updated on  ${new Date(
														row.updatedAt
													).toDateString()}`
													: ""}{" "}
												{row.UpdatedBy ? `by ${row.UpdatedBy}` : ""}
											</CardText>
										</Col>
									</Row>
								</CardHeader>
								<CardBody>
									<Row>
										<Col>
											<CardTitle>Country Settings</CardTitle>
											<Form>
												<Form.Group>
													<Row>
														<Col>
															<Form.Label>
																Conversion Rate To Local Currency
														</Form.Label>
															<Form.Control
																disabled
																type="number"
																value={row.ConversionRateToLocal}
															/>
														</Col>
														<Col>
															<Form.Label>Local Currency Unit</Form.Label>
															<Form.Control
																disabled
																type="text"
																value={row.CurrencyUnit}
															/>
														</Col>
														<Col>
															<Form.Label>Admin Contact Mails</Form.Label>
															<CreatableSelect
																isDisabled={true}
																isMulti
																value={row.AdminContactEmails?.split(",").map(
																	(val) => {
																		return { label: val, value: val };
																	}
																)}
																onChange={(val) => {
																	countryChangeHandler({
																		target: {
																			id: "AdminContactEmails",
																			value: val
																				? val.map((v) => v.value).join()
																				: null,
																		},
																	});
																}}
															// todo:add options
															// options={currentVertical[prp]
															//     ?.split(",")
															//     .map((val) => {
															//         return { label: val, value: val };
															//     })}
															/>
														</Col>
													</Row>
												</Form.Group>
											</Form>
											<hr />
											<Card>
												<CardTitle className="p-2">Request types</CardTitle>
												<Row className="justify-content-end mb-2">
													<Button
														className="mb-2"
														onClick={() => {
															setRequestModal(true);
															setSelectedCountry(row);
														}}
													>
														Add Request type
												</Button>
												</Row>
												<BootstrapTable
													data={row.RequestTypes ? row.RequestTypes : []}
													columns={requestColumns}
													keyField="id"
													cellEdit={cellEditFactory({
														mode: "click",
														blurToSave: true,
													})}
												/>
											</Card>{" "}
											<hr />
											<Card>
												<CardTitle className="p-2">Office(s)</CardTitle>

												<Row className="justify-content-end mb-2">
													<Button
														onClick={() => {
															openAddOfficeModal(true);
															setSelectedCountry(row);
														}}
													>
														Add Office
												</Button>
												</Row>
												<BootstrapTable
													data={row.Offices ? row.Offices : []}
													columns={officeColumns}
													keyField="id"
													cellEdit={cellEditFactory({
														mode: "click",
														blurToSave: true,
													})}
												/>
											</Card>
											<hr />
											<Card>
												<CardTitle className="p-2">Business Unit(s)</CardTitle>
												<Row>
													<Col>
														<BusinessUnits currentCountry={row} setLocalPageload={setLocalPageload} />
													</Col>
												</Row>
											</Card>
										</Col>
									</Row>
								</CardBody>
							</Card>
						</Col>
					</Row>
					<Modal
						isOpen={isAddOfficeModal}
						size="sm"
						toggle={() => openAddOfficeModal(!isAddOfficeModal)}
					>
						<ModalHeader toggle={() => openAddOfficeModal(!isAddOfficeModal)}>
							Add Office
					</ModalHeader>
						<ModalBody>
							<Row className="ml-1 mb-4">
								<strong>
									Commissioning Country: <i>{selectedCountry?.Label}</i>
								</strong>
							</Row>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									addOffice();
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
												setAddableOffice({
													...addableOffice,
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
												setAddableOffice({
													...addableOffice,
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
											setAddableOffice({});
											openAddOfficeModal(false);
										}}
									>
										Cancel
								</Button>
									<Button
										color="primary"
										className="ml-2"
										type="submit"
									>
										Add{" "}
										{app.recordloading ? (
											<Spinner size="small" color="#495057" />
										) : null}
									</Button>
								</Row>
							</form>
						</ModalBody>
						{/* <ModalFooter>
						<Row>
							{officeError ? <p className="error">{officeError}</p> : null}
						</Row>
						
					</ModalFooter> */}
					</Modal>
					<Modal
						isOpen={requestModal}
						toggle={() => setRequestModal(!requestModal)}
					>
						<ModalHeader toggle={() => setRequestModal(false)}>
							Add Request type
					</ModalHeader>
						<ModalBody>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									addRequestType();
								}}
							>
								<Row className="mb-2 ml-1">
									<strong>
										Commissioning Country: <i>{selectedCountry?.Label}</i>
									</strong>
								</Row>
								<Row className="mb-2">
									<Col>
										<Label>Request Type Name</Label>
										<sup>*</sup>
									</Col>
									<Col>
										<input
											className="form-control"
											required
											onChange={(e) =>
												setCurrentRequest({
													...currentRequest,
													RequestTypeName: e.target.value,
												})
											}
										/>
									</Col>
								</Row>
								<Row className="mb-2">
									<Col>
										<Label>Primary Contact Email</Label>
										<sup>*</sup>
									</Col>
									<Col>
										<input
											className="form-control"
											required
											type="email"
											onChange={(e) =>
												setCurrentRequest({
													...currentRequest,
													PrimaryContactEmails: e.target.value,
												})
											}
										/>
									</Col>
								</Row>
								<Row className="mb-2">
									<Col>
										<Label>OtherContactEmails</Label>
									</Col>
									<Col>
										<CreatableSelect
											isMulti
											onChange={(val) => {
												setCurrentRequest({
													...currentRequest,
													OtherContactEmails: val
														? val.map((v) => v.value).join()
														: null,
												});
											}}
										/>
									</Col>
								</Row>
								<Row className="mb-2">
									<Col>
										<Label>Comments</Label>
									</Col>
									<Col>
										<input
											className="form-control"
											onChange={(e) =>
												setCurrentRequest({
													...currentRequest,
													Comments: e.target.value,
												})
											}
										/>
									</Col>
								</Row>
								<Row className="justify-content-end mr-4 mt-2">
									<Button
										color="secondary"
										onClick={() => {
											setRequestModal(false);
											setCurrentRequest(null);
										}}
									>
										Cancel
								</Button>
									<Button type="submit" className="ml-2" color="primary">
										Add
									{app.recordloading ? (
											<Spinner size="small" color="#495057" />
										) : null}
									</Button>
								</Row>
							</form>
						</ModalBody>
					</Modal>

					<Modal
						size="sm"
						isOpen={requestTypeDeleteModal}
						toggle={() => openRequestTypeDeleteModal(!requestTypeDeleteModal)}
					>
						<ModalHeader
							toggle={() => openRequestTypeDeleteModal(!requestTypeDeleteModal)}
						>
							Delete Request Type
					</ModalHeader>
						<ModalBody>
							<strong>
								This change is irreversible. Are sure want to delete{" "}
								<i>{currentRequest?.RequestTypeName}</i>
							</strong>
						</ModalBody>
						<ModalFooter>
							<Row className="justify-content-end">
								<Button
									color="secondary"
									size="sm"
									onClick={() => {
										openRequestTypeDeleteModal(false);
										setCurrentRequest(null);
									}}
								>
									Cancel
							</Button>
								<Button
									color="primary"
									size="sm"
									className="ml-2"
									onClick={() => {
										dispatch(
											actions.deleteRequestType(currentRequest, () => {
												openRequestTypeDeleteModal(false);
												setCurrentRequest(null);
											}, currentRequest.CountryId)
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

					<Modal
						isOpen={officeDeleteModal}
						size="sm"
						toggle={() => openOfficeDeleteModal(!officeDeleteModal)}
					>
						<ModalHeader toggle={() => openOfficeDeleteModal(!officeDeleteModal)}>
							Delete Office
					</ModalHeader>
						<ModalBody>
							<strong>
								This change is irreversible. Are you sure want to delete{" "}
								<i>{currentOffice?.Label}</i>
							</strong>
						</ModalBody>
						<ModalFooter>
							<Row className="justify-content-end mr-4 mt-2">
								<Button
									size="sm"
									color="secondary"
									onClick={() => {
										openOfficeDeleteModal(false);
										setCurrentOffice(null);
									}}
								>
									Cancel
							</Button>
								<Button
									size="sm"
									color="primary"
									className="ml-2"
									onClick={() => {
										dispatch(
											actions.deleteOffice(currentOffice, () => {
												openOfficeDeleteModal(false);
												setCurrentOffice(null);
											}, currentOffice.CountryId)
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
				</React.Fragment>
		),
		onExpand: (row, isExpand, rowIndex, e) => {

			if (!row.BusinessUnits) {
				setTimeout(() => {
					dispatch(actions.getIndividualMarket(row.id, () => {
						dispatch(recordLoadEnd())
					}))
				});
			}
		}
	};

	return (
		<DashboardLayout navbar={<Navbar show={false}/>}>
			{(localPageload || globallocalPageload) ?
				<div id="pageCoverSpin"></div>
				: null}

			<Container fluid className="p-0">
				<Card>
					<CardBody className="p-2">
						<BootstrapTable
							hover
							bordered={false}
							bootstrap4
							striped
							data={markets ? markets : []}
							columns={columns}
							keyField="id"
							defaultSorted={[{ dataField: "createdAt", order: "desc" }]}
							expandRow={expandRow}
						/>
					</CardBody>
				</Card>
			</Container>
		</DashboardLayout>
	);
};

export default MarketDefault;

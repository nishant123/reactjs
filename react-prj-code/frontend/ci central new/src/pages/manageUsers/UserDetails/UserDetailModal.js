import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	Col,
	Input,
	Row,
	Label,
	Container,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "reactstrap";
import React from "react";
import "./UserDetailModal.css";
import PushButton from "../../../components/PushButton/PushButton";
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";
import * as manageUserActions from "../../../redux/actions/manageUserActions";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Select from "../../../components/Select/Select";
import { toastr } from "react-redux-toastr";

const UserDetailModal = ({ show, toggle }) => {
	const dispatch = useDispatch();
	const users = useSelector(({ manageUsers }) => manageUsers.users);
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const selectedUser = useSelector(
		({ manageUsers }) => manageUsers.selectedUser
	);

	// state for disabling editing
	const [userData, setUserData] = useState();
	const [editDisabled, setEditDisabled] = useState(false);

	const onChange = (value) => {
		setUserData({
			...userData,
			...value,
		});
		// dispatch(manageUserActions.updateSelectedUser(rowData.Email, value));
	};

	const onSubmit = () => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (re.test(String(userData.Email).toLowerCase())) {
			toggle();

			dispatch(manageUserActions.postUser(userData));
		} else {
			toastr.error(
				"User Creation Failed",
				"Email address not correctly formated!"
			);
		}
	};

	//Handelling

	return (
		<Modal
			isOpen={show}
			toggle={toggle}
			centered={true}
			size="lg"
			className="UserDetails"
		>
			{console.log(userData)}
			<ModalHeader toggle={toggle}>User Details</ModalHeader>
			<ModalBody style={{ overflow: "auto" }}>
				<Container>
					<Row>
						<Col>
							<Card>
								<CardBody>
									<CardTitle>Email Address</CardTitle>
									<Input
										className="mb-2"
										onChange={(e) =>
											onChange({
												Email: e.target.value,
											})
										}
										placeholder="Enter Email Address..."
										disabled={editDisabled}
										// value={}
									/>
									<Row>
										<Col>
											<CardTitle>First Name</CardTitle>
											<Input
												className="mb-2"
												onChange={(e) =>
													onChange({
														FirstName: e.target.value,
													})
												}
												disabled={editDisabled}
												// value={}
											/>
										</Col>
										<Col>
											<CardTitle>Last Name</CardTitle>
											<Input
												className="mb-2"
												onChange={(e) =>
													onChange({
														LastName: e.target.value,
													})
												}
												disabled={editDisabled}
												// value={}
											/>
										</Col>
									</Row>
									<Row>
										<Col>
											<CardTitle>Default Language</CardTitle>
											<Input
												type="select"
												id="defaultLanguage"
												name="defaultLanguage"
												className="mb-2"
												disabled={editDisabled}
												onChange={(val) =>
													onChange({
														Language: val ? val.target.value : null,
													})
												}
											>
												{codeLabels.UserLanguageOptions.map((opt, index) => {
													return (
														<option key={index} id={opt.id} value={opt.Code}>
															{opt.Label}
														</option>
													);
												})}
											</Input>
										</Col>
									</Row>
								</CardBody>
							</Card>
							<Card className="p-1">
								<CardHeader className="pb-0">
									<CardTitle>Account Status</CardTitle>
								</CardHeader>
								<CardBody className="pt-0">
									<Col>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														className="mb-2"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsDisabled: e.target.checked,
															})
														}
													/>
													Temporarily Disabled
												</Label>
											</Col>
										</Row>
									</Col>
								</CardBody>
							</Card>
						</Col>
						<Col>
							<Card>
								<Select
									header="Countries"
									options={codeLabels.CommissioningCountriesOptions}
									isMulti
									isSearchable
									onChange={(val) =>
										onChange({
											Countries: val ? val.join(",") : null,
										})
									}
								/>
							</Card>
							<Card>
								<MultiSelect
									header={"Business Unit"}
									options={codeLabels.BusinessUnitOptions}
									disabled={editDisabled}
									onChangeResult={(val) =>
										onChange({
											BusinessUnits: val ? val.join(",") : null,
										})
									}
								/>
							</Card>
							<Card>
								<MultiSelect
									header={"Verticals"}
									options={codeLabels.VerticalOptions}
									onChangeResult={(val) =>
										onChange({
											Verticals: val ? val.join(",") : null,
										})
									}
									disabled={editDisabled}
								/>
							</Card>
						</Col>
						<Col>
							<Card className="p-1">
								<CardHeader className="pb-0">
									<CardTitle>User Roles</CardTitle>
								</CardHeader>
								<CardBody className="pt-0">
									<Col>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsMarketAdmin: e.target.checked,
															})
														}
													/>
													Market Admininstrator
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsInternalUser: e.target.checked,
															})
														}
													/>
													NielsenIQ Internal User
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsClientService: e.target.checked,
															})
														}
													/>
													Client Service
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsOpsProjectManager: e.target.checked,
															})
														}
													/>
													Operations Project Manager
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsCostingSPOC: e.target.checked,
															})
														}
													/>
													Costing SPOC
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsProgrammer: e.target.checked,
															})
														}
													/>
													Survey Programmer
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsProgrammingTeamLeader: e.target.checked,
															})
														}
													/>
													SP Team Lead
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																IsTCSUser: e.target.checked,
															})
														}
													/>
													TCS User
												</Label>
											</Col>
										</Row>
									</Col>
								</CardBody>
							</Card>
						</Col>
						<Col>
							<Card className="p-1">
								<CardHeader className="pb-0">
									<CardTitle>Access Settings</CardTitle>
								</CardHeader>
								<CardBody className="pt-0">
									<Col>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																InternalDashBoardAccess: e.target.checked,
															})
														}
													/>
													Internal Dashboard
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																RequestsBoardAccess: e.target.checked,
															})
														}
													/>
													Requests Board
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																DeliveryDashboardAccess: e.target.checked,
															})
														}
													/>
													Setup &amp; Delivery
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																FinanceAccess: e.target.checked,
															})
														}
													/>
													Finance Reports
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																ManageMarketAccess: e.target.checked,
															})
														}
													/>
													Market Settings
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																ManageUsersAccess: e.target.checked,
															})
														}
													/>
													User Management
												</Label>
											</Col>
										</Row>
									</Col>
								</CardBody>
							</Card>
							<Card className="p-1">
								<CardHeader className="pb-0">
									<CardTitle>Special Permissions</CardTitle>
								</CardHeader>
								<CardBody className="pt-0">
									<Col>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																CanCreateNewProposal: e.target.checked,
															})
														}
													/>
													Create Proposal
												</Label>
											</Col>
										</Row>
										<Row>
											<Col>
												<Label>
													<Input
														type="checkbox"
														disabled={editDisabled}
														onChange={(e) =>
															onChange({
																CanBypassSalesForce: e.target.checked,
															})
														}
													/>
													Bypass SalesForce Input
												</Label>
											</Col>
										</Row>
									</Col>
								</CardBody>
							</Card>
						</Col>
					</Row>
				</Container>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" onClick={toggle}>
					Cancel
				</Button>
				<Button color="primary" onClick={() => onSubmit()}>
					Create
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default UserDetailModal;

import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardTitle,
	CardFooter,
	Col,
	Input,
	Row,
	Label,
	Container,
} from "reactstrap";
import React from "react";
import "../UserDetails/UserDetailModal.css";
import MultiSelect from "../../../components/ReactstrapMultiSelect/MultiSelect";
import * as manageUserActions from "../../../redux/actions/manageUserActions";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Select from "../../../components/Select/Select";
import { toastr } from "react-redux-toastr";
import { data } from "jquery";

const UserExpandableRow = ({ rowData }) => {
	const dispatch = useDispatch();
	const users = useSelector(({ manageUsers }) => manageUsers.users);
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const selectedUser = useSelector(
		({ manageUsers }) => manageUsers.selectedUser
	);

	// state for disabling editing
	const [editDisabled, setEditDisabled] = useState(false);
	const [data, setData] = useState({});

	const onSubmit = () => {
		dispatch(manageUserActions.updateUser(rowData.Email, data));
	};

	const onChange = (obj) => {
		let jsonBody = {
			...data,
			...obj,
		};
		setData(jsonBody);
	};

	return (
		<>
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
								defaultValue={rowData.Email ? rowData.Email : null}
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
										defaultValue={rowData.FirstName ? rowData.FirstName : null}
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
										defaultValue={rowData.LastName ? rowData.LastName : null}
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
										defaultValue={rowData.Language ? rowData.Language : null}
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
												defaultChecked={
													rowData.IsDisabled ? rowData.IsDisabled : null
												}
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
								{rowData.LastLoginDate && <Row>
									<Col>
										<Label>
											{rowData.LastLoginDate
												? `Last logged in on ${new Date(
													rowData.LastLoginDate
												).toDateString()}`
												: ""}
										</Label>
									</Col>
								</Row>
								}
								<Row>
									<Col>
										<Label className="mb-2"
										>
											{rowData.updatedAt
												? `Last updated at  ${new Date(
													rowData.updatedAt
												).toDateString()}`
												: ""}
										</Label>
									</Col>
								</Row>
							</Col>
						</CardBody>
					</Card>
					<Card className="p-1">
						<CardHeader className="pb-0">
							<CardTitle>Comments</CardTitle>
						</CardHeader>
						<CardBody className="pt-0">
							<Col>
								<Row>
									<Col>
										<textarea
											className="mb-2"
											onChange={(e) =>
												onChange({
													Comments: e.target.checked,
												})
											}
											defaultValue={rowData.Comments?rowData.Comments:null}
										/>
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
							defaultValue={
								rowData.Countries ? rowData.Countries.split(",") : null
							}
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
							defaultValues={
								rowData.BusinessUnits ? rowData.BusinessUnits.split(",") : null
							}
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
							defaultValues={
								rowData.Verticals ? rowData.Verticals.split(",") : null
							}
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
												defaultChecked={
													rowData.IsMarketAdmin ? rowData.IsMarketAdmin : null
												}
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
												defaultChecked={
													rowData.IsInternalUser ? rowData.IsInternalUser : null
												}
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
												defaultChecked={
													rowData.IsClientService
														? rowData.IsClientService
														: null
												}
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
												defaultChecked={
													rowData.IsOpsProjectManager
														? rowData.IsOpsProjectManager
														: null
												}
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
												defaultChecked={
													rowData.IsCostingApprover
														? rowData.IsCostingApprover
														: null
												}
												disabled={editDisabled}
												onChange={(e) =>
													onChange({
														IsCostingApprover: e.target.checked,
													})
												}
											/>
											Costings Approver
										</Label>
									</Col>
								</Row>
								<Row>
									<Col>
										<Label>
											<Input
												type="checkbox"
												defaultChecked={
													rowData.IsCostingSPOC ? rowData.IsCostingSPOC : null
												}
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
												defaultChecked={
													rowData.IsProgrammer ? rowData.IsProgrammer : null
												}
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
												defaultChecked={
													rowData.IsProgrammingTeamLeader
														? rowData.IsProgrammingTeamLeader
														: null
												}
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
												defaultChecked={
													rowData.IsTCSUser ? rowData.IsTCSUser : null
												}
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
												defaultChecked={
													rowData.InternalDashBoardAccess
														? rowData.InternalDashBoardAccess
														: null
												}
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
												defaultChecked={
													rowData.RequestsBoardAccess
														? rowData.RequestsBoardAccess
														: null
												}
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
												defaultChecked={
													rowData.DeliveryDashboardAccess
														? rowData.DeliveryDashboardAccess
														: null
												}
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
												defaultChecked={
													rowData.FinanceAccess ? rowData.FinanceAccess : null
												}
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
												defaultChecked={
													rowData.ManageMarketAccess
														? rowData.ManageMarketAccess
														: null
												}
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
												defaultChecked={
													rowData.ManageUsersAccess
														? rowData.ManageUsersAccess
														: null
												}
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
												defaultChecked={
													rowData.CanBypassApprovals
														? rowData.CanBypassApprovals
														: null
												}
												disabled={editDisabled}
												onChange={(e) =>
													onChange({
														CanBypassApprovals: e.target.checked,
													})
												}
											/>
											Bypass Approvals
										</Label>
									</Col>
								</Row>
								<Row>
									<Col>
										<Label>
											<Input
												type="checkbox"
												defaultChecked={
													rowData.CanCreateNewProposal
														? rowData.CanCreateNewProposal
														: null
												}
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
												defaultChecked={
													rowData.CanBypassSalesForce
														? rowData.CanBypassSalesForce
														: null
												}
												disabled={editDisabled}
												onChange={(e) =>
													onChange({
														CanBypassSalesForce: e.target.checked,
													})
												}
											/>
											Bypass Salesforce Input
										</Label>
									</Col>
								</Row>
							</Col>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row className="align-items-end">
				<Col>
					<div>
						<div className="float-right">
							<Button color="primary" onClick={() => onSubmit()}>
								Save
							</Button>
						</div>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default UserExpandableRow;

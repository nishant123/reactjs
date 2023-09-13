import React, { useEffect, useState } from "react";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Nav,
	NavItem,
	NavLink,
	Row,
	TabContent,
	TabPane,
} from "reactstrap";
import _ from "lodash";
import CreatableSelect from "react-select/creatable";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import axios from "../../../axios-interceptor";
import {
	createApprover,
	deleteApprovalSetting,
	updateApprSetting,
} from "../../../redux/actions/marketDefaultsActions";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import ApproverContacts from "./ApproverContacts";

const ApprovalSettings = (props) => {
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState();
	const [addContactModal, setAddContactModal] = useState(false);
	const [addApprovalModal, setAddApprovalModal] = useState(false);
	const [initialApprovals, setInitialApprovals] = useState();
	const [allApprovers, setAllApprovers] = useState();
	const [calledApprovers, setCalledApprovers] = useState(false);
	const [approverContactToAdd, setApproverContactToAdd] = useState({});
	const [updatableApprovalSettings, setUpdatableApprovalSettings] = useState(
		props.vertical.ApprovalSettings
	);
	const [currentApprovalSet, setcurrentApprSet] = useState({});

	const [deletableApprSetting, setDeletableApprSetting] = useState({});
	const [deleteApprModal, setDeleteApprModal] = useState(false);

	const [apprError, setApprError] = useState();

	const app = useSelector(({ app }) => app);
	useEffect(() => {
		if (
			!activeTab &&
			props.vertical.ApprovalSettings &&
			props.vertical.ApprovalSettings.length
		) {
			setActiveTab(
				_.head(_.orderBy(props.vertical.ApprovalSettings, "Order")).id
			);
		}
	});
	useEffect(() => {
		if (!allApprovers && !calledApprovers) {
			setCalledApprovers(true);
			axios
				.get(`/marketsettings/${props.vertical.id}/approvers/all`)
				.then((response) => {
					setAllApprovers(response.data.ApprovalDetails);
					setCalledApprovers(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	});
	// const [currentApprovalSetting, setCurrentApprovalSetting] = useState()
	useEffect(() => {
		if (!initialApprovals && props.vertical.ApprovalSettings) {
			let finalApprovals = [];
			props.vertical.ApprovalSettings.map((as) => {
				let finalSetting = { ...as };
				if (finalSetting.ApproverContacts)
					finalSetting.ApproverContacts = finalSetting.ApproverContacts.map(
						(ac) => {
							return { ...ac };
						}
					);
				finalApprovals.push(finalSetting);
			});
			console.log(finalApprovals);
			setInitialApprovals([...finalApprovals]);
		}
	});
	const columns = [
		{ dataField: "id", text: "#", editable: false },
		{
			dataField: "ApprovalSettingId",
			text: "Approval Setting Id",
			editable: true,
		},
		{
			dataField: "EmailAddress",
			text: "Email Address",
			editable: true,
		},
		{
			dataField: "IsMandatoryApprover",
			text: "IsMandatoryApprover",
			editable: true,
			// editor: {
			//     type: Type.CHECKBOX
			// },
			editorRenderer: (
				editorProps,
				value,
				row,
				column,
				rowIndex,
				columnIndex
			) => (
				<input
					{...editorProps}
					onChange={(e) => editorProps.onUpdate(e.target.checked)}
					type="checkbox"
					defaultChecked={value}
				/>
			),
		},
		{ dataField: "CreatedBy", text: "Created By", editable: false },
		{ dataField: "updatedAt", text: "Updated At", editable: false },
		{
			text: "Actions",
			editable: false,
			formatter: (cell, row) => {
				return (
					<div className="d-flex">
						<Button
							className="btn-success btn-sm"
							onClick={() => saveApprovalContacts(row)}
						>
							Save
						</Button>
						<Button
							className="btn-warning btn-sm ml-2"
							onClick={() => cancelApprovalContacts(row)}
						>
							Cancel
						</Button>
					</div>
				);
			},
		},
	];
	const saveApprovalContacts = (row) => {
		console.log(row);
	};
	const cancelApprovalContacts = (row) => {
		console.log(row);

		let finalApprovals = [];
		initialApprovals?.map((ia) => {
			if (ia.id == row.ApprovalSettingId) {
				ia.ApproverContacts = ia.ApproverContacts.map((appcont) => {
					if (appcont.id == row.id) {
						return {
							..._.head(
								_.head(
									props.vertical.ApprovalSettings.filter(
										(as) => as.id == row.ApprovalSettingId
									)
								).ApproverContacts?.filter((ac) => ac.id == row.id)
							),
						};
					} else return { ...appcont };
				});
			}
			finalApprovals.push({ ...ia });
		});

		console.log(finalApprovals);
		setInitialApprovals([...finalApprovals]);
	};
	const updateApprovalSettings = (appSettId) => {
		if (appSettId) {
			props.setLocalPageload(true);

			let finalAppSet = _.head(
				updatableApprovalSettings.filter((as) => as.id == appSettId)
			);
			dispatch(
				updateApprSetting(appSettId, finalAppSet, () => { setActiveTab(appSettId); props.setLocalPageload(false) }, props.currentCountry.id)
			);
		}
	};
	const addApprovalSetting = () => {
		let existedOrder = updatableApprovalSettings.filter(
			(uas) => uas.Order == currentApprovalSet.Order
		);
		if (!existedOrder.length) {
			setApprError(null);
			dispatch(
				createApprover(props.vertical.id, currentApprovalSet, () => {
					setAddApprovalModal(false);
				}, props.currentCountry.id)
			);
		} else
			setApprError(
				`Approval with Order ${currentApprovalSet.Order} existed already`
			);
	};
	const apprChangeHandler = (eve, appSettId) => {
		let updatableapprovalsettings = [...updatableApprovalSettings];
		updatableapprovalsettings = updatableapprovalsettings.map((app) => {
			if (app.id == appSettId) {
				app[eve.target.id] = eve.target.value;
			}
			return { ...app };
		});
		setUpdatableApprovalSettings(updatableapprovalsettings);
	};
	const getApproverContactOptions = (allApprovers) => {
		let approverOptions = [];
		allApprovers
			?.map((ap) => ap.ApproverContacts)
			?.map((con) => {
				con.map((contact) => {
					approverOptions.push(contact);
				});
			});
		return approverOptions;
	};
	const getAppSets = () => {
		let finalSets = [];
		props.vertical.ApprovalSettings?.map((s) => {
			finalSets.push({ ...s, ApproverContacts: [...s.ApproverContacts] });
		});
		return [...finalSets];
	};
	return (
		<CardBody>
			<Row className="justify-content-end">
				<Button
					className="btn-primary"
					onClick={() => setAddApprovalModal(true)}
				>
					Add Approval Settings
				</Button>
			</Row>
			<Row className="mt-2">
				<Nav tabs>
					{props.vertical.ApprovalSettings
						? _.orderBy(props.vertical.ApprovalSettings, "Order").map((as) => {
							return (
								<NavItem>
									<NavLink
										className={`${as.id == activeTab ? "active-navlink" : ""
											}`}
										onClick={() => {
											setActiveTab(as.id);
										}}
									>
										<label>
											#{as.id} -{as.Label}
										</label>
									</NavLink>
								</NavItem>
							);
						})
						: null}
				</Nav>
				{props.vertical.ApprovalSettings
					? _.orderBy(getAppSets()).map((as) => {
						return (
							<TabContent activeTab={activeTab} className="appr-tabcontent">
								<TabPane tabId={as.id} className="mt-4 p-0">
									<Row className="mb-2 mt-2 justify-content-end">
										<Button
											size="sm"
											color="danger"
											onClick={() => {
												setDeletableApprSetting(as);
												setDeleteApprModal(true);
											}}
										>
											Delete Setting - {as.Label}
										</Button>
									</Row>
									<form
										onSubmit={(e) => {
											e.preventDefault();
											updateApprovalSettings(as.id);
										}}
									>
										<Row className="p-1">
											<Col>
												<label>Order (unique)</label>
												<input
													type="number"
													min={0}
													step="any"
													required
													onChange={(eve) => apprChangeHandler(eve, as.id)}
													defaultValue={
														as.Order || as.Order == 0 ? as.Order : ""
													}
													className="form-control"
													id="Order"
												/>
											</Col>
											<Col>
												<label>Display Label</label>
												<input
													type="text"
													onChange={(eve) => apprChangeHandler(eve, as.id)}
													required
													defaultValue={as.Label ? as.Label : ""}
													className="form-control"
													id="Label"
												/>
											</Col>
											<Col>
												<label>Syndicated Trigger Amount OOP (USD)</label>
												<input
													type="number"
													step="any"
													min={0}
													onChange={(eve) => apprChangeHandler(eve, as.id)}
													defaultValue={
														as.ThresholdOutOfPocketAmountSyndicated ||
															as.ThresholdOutOfPocketAmountSyndicated == 0
															? as.ThresholdOutOfPocketAmountSyndicated
															: ""
													}
													className="form-control"
													id="ThresholdOutOfPocketAmountSyndicated"
												/>
											</Col>
											<Col>
												<label>Trigger OOP%</label>
												<input
													type="number"
													step="any"
													min={0}
													required
													onChange={(eve) => apprChangeHandler(eve, as.id)}
													defaultValue={
														as.ThresholdOutOfPocketPercentage ||
															as.ThresholdOutOfPocketPercentage == 0
															? as.ThresholdOutOfPocketPercentage
															: ""
													}
													className="form-control"
													id="ThresholdOutOfPocketPercentage"
												/>
											</Col>
											<Col>
												<label>Trigger Revenue Amount (USD)</label>
												<input
													type="number"
													min={0}
													step="any"
													required
													onChange={(eve) => apprChangeHandler(eve, as.id)}
													defaultValue={
														as.ThresholdRevenueAmount ||
															as.ThresholdRevenueAmount == 0
															? as.ThresholdRevenueAmount
															: ""
													}
													className="form-control"
													id="ThresholdRevenueAmount"
												/>
											</Col>
										</Row>
										<Row className="justify-content-end mb-2 mt-2">
											<Button color="primary">
												Save Approval Setting{" "}

											</Button>
										</Row>
									</form>
									<ApproverContacts
										approvalSetting={as}
										currentCountry={props.currentCountry}
										businessUnit={props.businessUnit}
										vertical={props.vertical}
										setLocalPageload={props.setLocalPageload}
									/>

									{/* <Card>
                                <CardHeader className="d-flex justify-content-between">
                                    <h5><strong>Approval Contacts</strong></h5>
                                    <Button className="btn-primary float-right" onClick={() => setAddContactModal(true)}>Add Contact</Button>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <BootstrapTable
                                            hover
                                            bootstrap4
                                            striped
                                            data={as.ApproverContacts ? as.ApproverContacts : []}
                                            columns={columns}
                                            keyField="id"
                                            // onTableChange=
                                            // remote={{ cellEdit: true }}
                                            cellEdit={cellEditFactory({
                                                mode: 'click',
                                                blurToSave: true,
                                                afterSaveCall: (oldValue, newValue, row, column) => {

                                                    console.log(row, column);
                                                }
                                            })}
                                        />
                                        
                                    </Row>
                                </CardBody>
                            </Card> */}
								</TabPane>
							</TabContent>
						);
					})
					: null}
			</Row>
			<Modal
				isOpen={addApprovalModal}
				toggle={() => {
					setAddApprovalModal(!addApprovalModal);
					setcurrentApprSet({});
					setApprError(null);
				}}
			>
				<ModalHeader
					toggle={() => {
						setAddApprovalModal(!addApprovalModal);
						setcurrentApprSet({});
						setApprError(null);
					}}
				>
					Add Approval New Setting
				</ModalHeader>
				<ModalBody>
					<Row className="mb-2 ml-1">
						<strong>
							Commisioning country: <i>{props.currentCountry.Label}</i>
						</strong>
					</Row>
					<Row className="mb-2 ml-1">
						<strong>
							Business Unit: <i>{props.businessUnit.Label}</i>
						</strong>
					</Row>
					<Row className="mb-2 ml-1">
						<strong>
							Vertical : <i>{props.vertical.Label}</i>
						</strong>
					</Row>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							addApprovalSetting();
						}}
					>
						<Row className="mb-2">
							<Col>
								<label>Order</label>
							</Col>{" "}
							<Col>
								<input
									type="number"
									step="any"
									required
									min={0}
									onChange={(e) =>
										setcurrentApprSet({
											...currentApprovalSet,
											Order: e.target.value,
										})
									}
									className="form-control"
									id="Order"
								/>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col>
								<label>Label</label>
							</Col>{" "}
							<Col>
								<input
									type="text"
									required
									onChange={(e) =>
										setcurrentApprSet({
											...currentApprovalSet,
											Label: e.target.value,
										})
									}
									className="form-control"
									id="Label"
								/>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col>
								<label>ThresholdOutOfPocketAmountSyndicated</label>
							</Col>{" "}
							<Col>
								<input
									type="number"
									step="any"
									onChange={(e) =>
										setcurrentApprSet({
											...currentApprovalSet,
											ThresholdOutOfPocketAmountSyndicated: e.target.value,
										})
									}
									min={0}
									className="form-control"
									id="ThresholdOutOfPocketAmountSyndicated"
								/>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col>
								<label>ThresholdOutOfPocketPercentage</label>
							</Col>{" "}
							<Col>
								<input
									type="number"
									step="any"
									required
									min={0}
									className="form-control"
									onChange={(e) =>
										setcurrentApprSet({
											...currentApprovalSet,
											ThresholdOutOfPocketPercentage: e.target.value,
										})
									}
									id="ThresholdOutOfPocketPercentage"
								/>
							</Col>
						</Row>
						<Row className="mb-2">
							<Col>
								<label>ThresholdRevenueAmount</label>
							</Col>{" "}
							<Col>
								<input
									type="number"
									step="any"
									min={0}
									required
									className="form-control"
									onChange={(e) =>
										setcurrentApprSet({
											...currentApprovalSet,
											ThresholdRevenueAmount: e.target.value,
										})
									}
									id="ThresholdRevenueAmount"
								/>
							</Col>
						</Row>

						{apprError ? (
							<Row className="ml-2">
								<p className="error">{apprError}</p>
							</Row>
						) : null}

						<Row className="justify-content-end mr-4 mt-2">
							<Button
								type="button"
								color="secondary"
								onClick={() => {
									setAddApprovalModal(!addApprovalModal);
									setcurrentApprSet({});
									setApprError(null);
								}}
							>
								Cancel
							</Button>
							<Button type="submit" color="primary" className="ml-2">
								Submit{" "}
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
				toggle={() => setDeleteApprModal(!deleteApprModal)}
				isOpen={deleteApprModal}
			>
				<ModalHeader toggle={() => setDeleteApprModal(!deleteApprModal)}>
					Delete Approval Setting
				</ModalHeader>
				<ModalBody>
					<strong>
						This change is irreversible. Are you sure want to delete{" "}
						<i>{deletableApprSetting?.Label}</i>
					</strong>
				</ModalBody>
				<ModalFooter>
					<Row className="justify-content-end mt-2 mr-4">
						<Button
							size="sm"
							color="secondary"
							onClick={() => {
								setDeleteApprModal(false);
								setDeletableApprSetting(null);
							}}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							className="ml-2"
							color="primary"
							onClick={() => {
								props.setLocalPageload(true)
								dispatch(
									deleteApprovalSetting(deletableApprSetting, () => {
										setDeleteApprModal(false);
										setActiveTab(null);
										setDeletableApprSetting(null);
										props.setLocalPageload(false)
									}, props.currentCountry.id)
								);
							}}
						>
							Confirm{" "}
							{app.recordloading ? (
								<Spinner size="small" color="#495057" />
							) : null}
						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</CardBody>
	);
};

export default ApprovalSettings;

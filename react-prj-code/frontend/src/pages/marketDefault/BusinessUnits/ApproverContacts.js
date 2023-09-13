import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Modal,
	ModalBody,
	ModalFooter,
	CardTitle,
	ModalHeader,
	Row,
} from "reactstrap";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import {
	createApproverContact,
	deleteApproverContact,
	updateAppContact,
} from "../../../redux/actions/marketDefaultsActions";
import Spinner from "../../../components/Spinner";
const ApproverContacts = (props) => {
	const dispatch = useDispatch();
	const [initialProps, setInitialProps] = useState(
		props.approvalSetting?.ApproverContacts
	);
	const [addContactModal, setAddContactModal] = useState(false);
	const [addMail, setAddMail] = useState();
	const [addMailError, setAddMailError] = useState();
	const [currentSavingContact, setCurrentSavingContact] = useState({});
	const app = useSelector(({ app }) => app);

	const [deletableContact, setDeletableContact] = useState({});
	const [deleteContactModal, setDeleteContactModal] = useState(false);
	// useEffect(() => {
	//     if (!initialProps && props.approvalSetting && props.approvalSetting.ApproverContacts) {
	//         let init = []
	//         props.approvalSetting.ApproverContacts.map(ac => {
	//             init.push({ ...ac })
	//         })
	//         setInitialProps(init)
	//     }
	// })
	const columns = [
		{ dataField: "id", text: "#", editable: false },
		// {
		// 	dataField: "ApprovalSettingId",
		// 	text: "Approval Setting Id",
		// 	editable: false,
		// 	validator: (newValue, row, column) => {
		// 		return validator(newValue, row, column);
		// 	},
		// },
		{
			dataField: "EmailAddress",
			text: "Email Address",
			editable: true,
			validator: (newValue, row, column) => {
				return validator(newValue, row, column);
			},
		},
		{
			dataField: "IsMandatoryApprover",
			text: "Mandatory Approver",
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
							color="success"
							size="sm"
							onClick={() => {
								saveApprovalContacts(row);
								setCurrentSavingContact(row);
							}}
						>
							Save{" "}
							{/* {app.recordloading && currentSavingContact.id == row.id ? (
								<Spinner size="small" color="#495057" />
							) : null} */}
						</Button>
						<Button
							color="danger"
							size="sm"
							className="ml-2"
							onClick={() => {
								setDeletableContact(row);
								setDeleteContactModal(true);
							}}
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];
	const validator = (newValue, row, column) => {
		console.log(newValue, column);
		if (!newValue) {
			return {
				valid: false,
				message: "Value is required",
			};
		}
		return true;
	};
	const saveApprovalContacts = (row) => {
		props.setLocalPageload(true)
		dispatch(
			updateAppContact(row.id, row, () => {
				setCurrentSavingContact(null);
				props.setLocalPageload(false)
			}, props.currentCountry.id)
		);
	};

	const addContact = () => {
		if (
			props.approvalSetting.ApproverContacts.filter(
				(ac) => ac.EmailAddress == addMail
			).length
		) {
			setAddMailError("Email already existed to current approval setting");
		} else {
			setAddMailError(null);
			dispatch(
				createApproverContact(
					props.approvalSetting.id,
					{ EmailAddress: addMail },
					() => {
						setAddContactModal(false);
						setAddMail(null);
					}, props.currentCountry.id
				)
			);
		}
	};
	return (
		<div>
			<Card>
				<CardHeader className="d-flex justify-content-between">
					<CardTitle>
						#{props.approvalSetting.id} - Approver Contacts (
						{props.approvalSetting.Label})
					</CardTitle>
					<Button
						className="btn-primary float-right"
						onClick={() => setAddContactModal(true)}
					>
						Add Contact
					</Button>
				</CardHeader>
				<CardBody>
					<Row>
						{props.approvalSetting.ApproverContacts &&
							props.approvalSetting.ApproverContacts.length ? (
								<BootstrapTable
									className="pb-0 mb-0"
									hover
									bootstrap4
									striped
									data={props.approvalSetting.ApproverContacts}
									columns={columns}
									keyField="id"
									// onTableChange=
									// remote={{ cellEdit: true }}
									cellEdit={cellEditFactory({
										mode: "click",
										blurToSave: true,
										// afterSaveCall: (oldValue, newValue, row, column) => {

										//     console.log(row, column);
										// }
									})}
								/>
							) : null}
					</Row>
				</CardBody>
			</Card>
			<Modal
				isOpen={addContactModal}
				toggle={() => {
					setAddContactModal(false);
					setAddMail(null);
					setAddMailError(null);
				}}
			>
				<ModalHeader
					toggle={() => {
						setAddContactModal(false);
						setAddMail(null);
						setAddMailError(null);
					}}
				>
					Add Approver Contact
				</ModalHeader>
				<ModalBody>
					<Row className="mb-2 ml-1">
						<strong>
							Commissioning Country: <i>{props.currentCountry.Label}</i>
						</strong>
					</Row>
					<Row className="mb-2 ml-1">
						<strong>
							Business Unit: <i>{props.businessUnit.Label}</i>
						</strong>
					</Row>
					<Row className="mb-2 ml-1">
						<strong>
							Vertical: <i>{props.vertical.Label}</i>
						</strong>
					</Row>
					<Row className="mb-2 ml-1">
						<strong>
							Approval: <i>{props.approvalSetting.Label}</i>
						</strong>
					</Row>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							addContact();
						}}
					>
						<Row className="mb-2 ml-2">
							<Col>
								<strong>Email Address</strong>
							</Col>
							<Col>
								<input
									className="form-control"
									type="email"
									required
									onChange={(e) => setAddMail(e.target.value)}
								/>
							</Col>
						</Row>

						{addMailError ? (
							<Row className="ml-2">
								<p className="error">{addMailError}</p>
							</Row>
						) : null}
						<Row className=" mr-4 mt-2 justify-content-end">
							<Button
								color="secondary"
								onClick={() => {
									setAddContactModal(false);
									setAddMail(null);
									setAddMailError(null);
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
					{/* <CreatableSelect
                    onChange={val => {
                        let approver = val ? _.head((getApproverContactOptions(allApprovers)).filter(ap => ap.EmailAddress == val.value)) : {}
                        setApproverContactToAdd(approver)
                    }}
                    options={getApproverContactOptions(allApprovers).map(contact => {
                        return { value: contact.EmailAddress, label: contact.EmailAddress }
                    })}
                /> */}
				</ModalBody>
				{/* <ModalFooter>
                <Button
                    className="btn-warning btn-sm"
                    onClick={() => setAddContactModal(!addContactModal)}>Cancel</Button>
                <Button
                    className="btn-success btn-sm"
                    onClick={() => dispatch(createApprover(props.vertical.id, approverContactToAdd, () => setAddContactModal(!addContactModal)))}>Add</Button>
            </ModalFooter> */}
			</Modal>

			<Modal
				size="sm"
				isOpen={deleteContactModal}
				toggle={() => setDeleteContactModal(!deleteContactModal)}
			>
				<ModalHeader toggle={() => setDeleteContactModal(!deleteContactModal)}>
					Delete Approver Contact
				</ModalHeader>
				<ModalBody>
					<strong>
						This change is irreversible. Are you sure want to delete{" "}
						<i>{deletableContact?.EmailAddress}</i>
					</strong>
				</ModalBody>
				<ModalFooter>
					<Row className="justify-content-end mt-2 mr-4">
						<Button
							size="sm"
							color="secondary"
							onClick={() => {
								setDeleteContactModal(false);
								setDeletableContact(null);
							}}
						>
							Cancel
						</Button>
						<Button
							size="sm"
							color="primary"
							className="ml-2"
							onClick={() => {
								props.setLocalPageload(true)
								dispatch(
									deleteApproverContact(deletableContact, () => {
										setDeleteContactModal(false);
										setDeletableContact(null);
										props.setLocalPageload(false)
									},props.currentCountry.id)
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
		</div>
	);
};

export default ApproverContacts;

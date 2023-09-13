import React, { useEffect, useState } from "react";
import Select from "react-select";
import _ from "lodash";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Collapse,
	Modal,
	Table,
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
import { createClientServiceRates, createVertical, deleteClientRateCard, updateClientServiceRates } from "../../../redux/actions/marketDefaultsActions";
import { useDispatch, useSelector } from "react-redux";
import { getLabel } from "../../../utils/codeLabels";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import Spinner from "../../../components/Spinner";

const ClientServiceRates = (props) => {
	// const [activeTab, setActiveTab] = useState(
	// 	_.head(props.businessUnit.Verticals).Code
	// );
	const dispatch = useDispatch();
	const [addRateCardModal, openRateCardModal] = useState(false);
	// const [currentVertical, setCurrentVertical] = useState({});
	const [selectedRateModal, setselectedRateModal] = useState({});
	const [rateError, setRateError] = useState();
	const [currentEditingRate, setCurrentEditingRate] = useState()
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);

	const [clientRateDeleteModal, openClientRateDeleteModal] = useState(false)

	const app = useSelector(({ app }) => app)

	// const [initialClientServiceRates, setInitialClient] = useState()
	// useEffect(() => {
	// 	if (!initialClientServiceRates && props.businessUnit.ClientServiceRates) {

	// 	}
	// })
	// useEffect(() => {
	// 	if (props.businessUnit.Verticals && activeTab) {
	// 		setCurrentVertical(
	// 			_.head(props.businessUnit.Verticals.filter((v) => v.Code == activeTab))
	// 		);
	// 	}
	// }, [activeTab]);
	const ratefields = {
		ProfileName: {
			label: "Profile Name",
			isRequired: true,
			type: "text"
		},
		ExecutiveDirector: {
			label: "Executive Director",
			isRequired: true,
			type: "number"
		},
		Director: {
			label: "Director",
			isRequired: true,
			type: "number"
		},
		AssociateDirector: {
			label: "Associate Director",
			isRequired: true,
			type: "number"
		},
		SeniorManager: {
			label: "Senior Manager",
			isRequired: true,
			type: "number"
		},
		Manager: {
			label: "Manager",
			isRequired: true,
			type: "number"
		},
		SeniorExecutive: {
			label: "Senior Executive",
			isRequired: true,
			type: "number"
		},
		Executive: {
			label: "Executive",
			isRequired: true,
			type: "number"
		},
		DatascienceInternalComm: {
			label: "Data Science",
			isRequired: true,
			type: "number"
		},
		IsDefault: {
			label: "Default",
			isCheckbox: true
		}
	}

	const columns = [
		{ dataField: "id", text: "#", editable: false },
		{ dataField: "ProfileName", text: "Name", editable: true },
		{
			dataField: "ExecutiveDirector", text: "Executive Director", editable: true,
			validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "Director", text: "Director", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "AssociateDirector", text: "Associate Director", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "SeniorManager", text: "Senior Manager", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "Manager", text: "Manager", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "SeniorExecutive", text: "Senior Executive", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "Executive", text: "Executive", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "DatascienceInternalComm", text: "Data Science", editable: true, validator: (newValue, row, column) => {
				return validator(newValue, row, column)
			}
		},
		{
			dataField: "IsDefault", text: "Default", editable: true,
			// editor: {
			// 	type: Type.CHECKBOX
			// }
			editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
				<input {...editorProps} onChange={e => editorProps.onUpdate(e.target.checked)} type="checkbox" defaultChecked={value == null ? false : value} />
			)
		},
		{ dataField: "CreatedBy", text: "Created By", editable: false },
		{ dataField: "updatedAt", text: "Updated At", editable: false },
		{
			text: "Actions", editable: false, formatter: (cell, row) => {
				return <div>
					<Button color="success" size="sm"
						onClick={() => { saveClientServiceRate(row); setCurrentEditingRate(row) }}>Save</Button>
					<Button className="ml-2" color="danger" size="sm"
						onClick={() => { openClientRateDeleteModal(true); setCurrentEditingRate(row) }}>Delete</Button>
				</div>
			}
		}
	];
	const validator = (newValue, row, column) => {
		console.log(newValue)
		if (isNaN(newValue)) {
			return {
				valid: false,
				message: 'Value should be numeric'
			};
		}
		return true;
	}
	const saveClientServiceRate = (row) => {
		let rowdata = { ...row }
		Object.keys(rowdata).map(r => {
			if (!isNaN(parseFloat(rowdata[r]))) {
				rowdata[r] = parseFloat(rowdata[r])
			}
		})
		dispatch(updateClientServiceRates(props.businessUnit.id, rowdata, () => {
			setCurrentEditingRate(false)
		}, props.currentCountry.id))
	}
	const cancelClientServiceRate = (row) => {
		//todo: cancel client service
	}
	const addRateCard = () => {
		let invalid = false
		Object.keys(ratefields).map(rf => {
			if (ratefields[rf].isRequired && selectedRateModal[rf] == null) {
				invalid = true
			}
		})
		if (!invalid) {
			Object.keys(selectedRateModal).map(r => {
				if (!isNaN(parseFloat(selectedRateModal[r]))) {
					selectedRateModal[r] = parseFloat(selectedRateModal[r])
				}
			})

			setRateError(null)
			dispatch(createClientServiceRates(props.businessUnit.id, selectedRateModal, () => {
				setselectedRateModal({});
				openRateCardModal(false);
			}, props.currentCountry.id))
		} else {
			setRateError("Please provide all the required fields values")
		}
	}
	return (
		<>
			<Row className="m-0 justify-content-end">
				<Button onClick={() => openRateCardModal(true)}>
					Add Rate Card
						</Button>
			</Row>

			<Row>
				<CardBody>
					{/* <Col> */}
					{(props.businessUnit
						&& props.businessUnit.ClientServiceRates
						&& props.businessUnit.ClientServiceRates.length)
						? <BootstrapTable
							hover
							bootstrap4
							striped
							data={props.businessUnit.ClientServiceRates}
							columns={columns}
							keyField="id"
							cellEdit={cellEditFactory({
								mode: 'click',
								blurToSave: true,
								// afterSaveCell: (oldValue, newValue, row, column) => {
								// 	console.log(row, column);
								// }
							})}
						/> : null}

					{/* </Col> */}
				</CardBody>
			</Row>
			<Modal
				isOpen={addRateCardModal}
				toggle={() => openRateCardModal(!addRateCardModal)}
				size="sm"
			>
				<ModalHeader toggle={() => openRateCardModal(!addRateCardModal)}>
					<h4>Add Client Service Rate</h4>
				</ModalHeader>
				<ModalBody>
					<Row className="ml-1 mb-2">
						<strong>Commissioning Country: <i>{props.currentCountry.Label}</i></strong>
					</Row>
					<Row className="ml-1 mb-2">
						<strong>Business Unit: <i>{props.businessUnit.Label}</i></strong>
					</Row>
					<strong>Client Service Rates:</strong>
					<div className="mt-2">
						<form onSubmit={(e) => {
							e.preventDefault();
							addRateCard()
						}
						}>

							{Object.keys(ratefields).map(rf => {
								if (ratefields[rf].isCheckbox)
									return <Row><Col>
										<label>
											{ratefields[rf].label}{ratefields[rf].isRequired ? <sup>*</sup> : null}
											<input type="checkbox" className="ml-2" onChange={(e) => setselectedRateModal({ ...selectedRateModal, [rf]: e.target.checked })} />

										</label>
									</Col>
									</Row>
								else
									return <Row>
										<Col>
											<label>{ratefields[rf].label}</label>{ratefields[rf].isRequired ? <sup>*</sup> : null}
										</Col>
										<Col>
											{ratefields[rf].type == "number" ?
												<input type={ratefields[rf].type} min={0} required={ratefields[rf].isRequired} step="any"
													onChange={(e) => setselectedRateModal({ ...selectedRateModal, [rf]: e.target.value ? parseFloat(e.target.value) : null })} />
												: <input type={ratefields[rf].type} required={ratefields[rf].isRequired}
													onChange={(e) => setselectedRateModal({ ...selectedRateModal, [rf]: e.target.value })} />
											}
										</Col>
									</Row>
							})}
							<Row className="mr-4 mt-2 justify-content-end">
								<Button
									color="secondary"
									onClick={() => { openRateCardModal(!addRateCardModal); setselectedRateModal({}) }}
								>
									Cancel
					</Button>
								<Button
									className="ml-2"
									color="primary"
									type="submit"

								>
									Add{app.recordloading ? <Spinner size="small" color="#495057" />
										: null}
								</Button>
							</Row>
						</form>

					</div>
				</ModalBody>
				{/* <ModalFooter>
					<Row>
						{rateError ? <p className="error">{rateError}</p> : null}
					</Row>

				</ModalFooter> */}
			</Modal>
			<Modal size="sm" isOpen={clientRateDeleteModal}
				toggle={() => openClientRateDeleteModal(!clientRateDeleteModal)}>
				<ModalHeader toggle={() => openClientRateDeleteModal(!clientRateDeleteModal)}>
					Delete Client Rate Card
</ModalHeader>
				<ModalBody>
					<strong>This Change is irreversible. Are you want to delete <i>{currentEditingRate?.ProfileName}</i></strong>
				</ModalBody>
				<ModalFooter>
					<Row className="justify-content-end mr-4 mt-2">
						<Button color="secondary" size="sm" onClick={() => {
							openClientRateDeleteModal(false);
							setCurrentEditingRate(null)
						}}>
							Cancel
						</Button>
						<Button color="primary" size="sm" className="ml-2"
							onClick={() => {
								dispatch(deleteClientRateCard(currentEditingRate, () => {
									openClientRateDeleteModal(false);
									setCurrentEditingRate(null)
								}, props.currentCountry.id))

							}}>Confirm{(app.recordloading) ? <Spinner size="small" color="#495057" />
								: null}

						</Button>
					</Row>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default ClientServiceRates;

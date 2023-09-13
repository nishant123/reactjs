import React, { useState } from "react";
import { useDispatch } from "react-redux";

// import * as currentProjectActions from "../../../redux/actions/currentProjectActions";

import { getLabel } from "../../utils/codeLabels";
import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Row,
	Col,
	Modal,
	ModalHeader,
	ModalBody,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import { MinusCircle, PlusCircle } from "react-feather";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

import * as deliveryActions from "../../redux/actions/deliveryActions";
import { getProject } from "../../redux/actions/currentProjectActions";
import { setCurrentWaveSpec } from "../../redux/actions/waveSpecsActions";

const ExpandableRowsTable = ({ tableData, tableColumns }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	// const [isEwnNotesModal, setEwnModal] = useState(false);
	// const [currentEwn, setCurrentEwn] = useState(false);

	const projectDetails = (row) => {
		let CostingProfile = row.WaveSpec.CostingProfile;
		return (
			<Col>
				<Row>
					<Col>
						<h4>Project Details</h4>
					</Col>
				</Row>
				<Row>
					<Col xs="6">Project ID (across all waves)</Col>
					<Col xs="6">{CostingProfile?.Project.ProjectId}</Col>
				</Row>
				<Row>
					<Col xs="6">Commissioned Profile</Col>
					<Col xs="6">
						{"#"}
						{CostingProfile?.ProfileNumber} {CostingProfile?.ProfileName}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Wave Number/Name</Col>
					<Col xs="6">
						{"#"}
						{row.WaveSpec.WaveNumber} {row.WaveSpec.WaveName}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Business Unit</Col>
					<Col xs="6">
						{getLabel(
							"BusinessUnitOptions",
							CostingProfile?.Project.BusinessUnit
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Vertical</Col>
					<Col xs="6">
						{getLabel(
							"VerticalOptions",
							CostingProfile?.Project.IndustryVertical
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Office</Col>
					<Col>
						{getLabel(
							"OfficeOptions",
							CostingProfile?.Project.CommissioningOffice
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Syndicated Project</Col>
					<Col>{CostingProfile?.Project.IsSyndicated ? "Yes" : "No"}</Col>
				</Row>
				<Row>
					<Col xs="6">Tracker</Col>
					<Col>{CostingProfile?.IsTracker ? "Yes" : "No"}</Col>
				</Row>
				<Row>
					<Col xs="6">Total Waves</Col>
					<Col>{CostingProfile?.NumberOfWaves}</Col>
				</Row>
				<Row>
					<Col xs="6">Tracking Frequency</Col>
					<Col>
						{getLabel(
							"TrackingFrequencyOptions",
							CostingProfile?.TrackingFrequency
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Fielding Countries</Col>
					<Col>
						{CostingProfile?.FieldingCountries?.split(",").map(
							(country, index) => {
								return (
									<li key={index} className="no-list-style">
										{getLabel("FieldingCountriesOptions", country)}
									</li>
								);
							}
						)}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Methodologies</Col>
					<Col xs="6">
						<ul style={{ paddingInlineStart: "0" }}>
							{CostingProfile?.Methodology
								? CostingProfile.Methodology.split(",").map((method, index) => {
										return (
											<li key={index} className="no-list-style">
												{getLabel("MethodologyOptions", method)}
											</li>
										);
								  })
								: null}
						</ul>
					</Col>
				</Row>
			</Col>
		);
	};
	const clientDetails = (row) => {
		let CostingProfile = row.WaveSpec.CostingProfile;

		return (
			<Col>
				<Row>
					<Col>
						<h4>Client Details</h4>
					</Col>
				</Row>
				{CostingProfile && CostingProfile.Project.ContractDetails
					? CostingProfile.Project.ContractDetails.map((cd) => (
							<>
								<Row>
									<Col xs="4">Name</Col>
									<Col xs="8">{cd.AccountName}</Col>
								</Row>
								<Row>
									<Col xs="4">Industry</Col>
									<Col xs="8">{cd.Industry}</Col>
								</Row>
								<Row>
									<Col xs="4">OP Number</Col>
									<Col xs="8">{cd.OpportunityNumber}</Col>
								</Row>
								<hr></hr>
								{cd.opportunityLineItemDetails?.map((opl) => (
									<Row>
										<Col xs="6">WBS Number</Col>
										<Col xs="6">
											{opl.WBSNumber ? opl.WBSNumber : "Not Available"}
										</Col>
									</Row>
								))}
							</>
					  ))
					: "No Contract Details Found"}
			</Col>
		);
	};
	const timeline = (row) => {
		let waveSpec = row.WaveSpec;
		return (
			<Col>
				<Row>
					<Col>
						<h4>Timeline</h4>
					</Col>
					{/* <Col>
            <a
              onClick={() => {
                setEwnModal(!isEwnNotesModal);
                setCurrentEwn(row);
              }}
            >
              View EWN Notes (link to clipboard then remove this)
            </a>
          </Col> */}
					{/* <Col>
            <a
              onClick={(e) => {
                dispatch(
                  getProject(row.WaveSpec.CostingProfile.Project.ProjectId)
                );
                dispatch(deliveryActions.setCurrentDelivery(row));
                history.push("/survey");
              }}
            >
              Programmer's Link (remove once linked with faPen)
            </a>
          </Col> */}
				</Row>
				<Row>
					<Col>Commissioned Date</Col>
					<Col>
						{waveSpec.DateWaveCommissioned
							? waveSpec.DateWaveCommissioned.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Final Questionnaire Due</Col>
					<Col>
						{waveSpec.DateFinalQuestionnaire
							? waveSpec.DateFinalQuestionnaire.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Translations Due</Col>
					<Col>
						{waveSpec.DateTranslations
							? waveSpec.DateTranslations.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Field Start</Col>
					<Col>
						{waveSpec.DateFieldStart
							? waveSpec.DateFieldStart.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Field End</Col>
					<Col>
						{waveSpec.DateFieldEnd
							? waveSpec.DateFieldEnd.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Data Processing Due</Col>
					<Col>
						{waveSpec.DateDataProcessing
							? waveSpec.DateDataProcessing.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Charting Due</Col>
					<Col>
						{waveSpec.DateCharts
							? waveSpec.DateCharts.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Dashboard Due</Col>
					<Col>
						{waveSpec.DateDashboards
							? waveSpec.DateDashboards.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
				<Row>
					<Col>Reports Due</Col>
					<Col>
						{waveSpec.DateFinalReport
							? waveSpec.DateFinalReport.split("T")[0]
							: "Not Applicable"}
					</Col>
				</Row>
			</Col>
		);
	};
	const projectContacts = (row) => {
		let CostingProfile = row.WaveSpec.CostingProfile;
		return (
			<Col>
				<Row>
					<Col>
						<h4>Project Contacts</h4>
					</Col>
				</Row>
				<Row>
					<Col>Primary CS Contact</Col>
					<Col xs="6">
						{CostingProfile && CostingProfile.Project.ProposalOwnerEmail
							? CostingProfile.Project.ProposalOwnerEmail.value
									.toLowerCase()
									.split("@")[0]
									.split(".")
									.map((word) => {
										return word.replace(word[0], word[0].toUpperCase());
									})
									.join(" ")
							: "Not Available"}
					</Col>
				</Row>
				<Row>
					<Col>Ops Project Manager</Col>
					<Col xs="6">
						{CostingProfile && CostingProfile.Project.ProjectManagerEmail
							? CostingProfile.Project.ProjectManagerEmail.toLowerCase()
									.split("@")[0]
									.split(".")
									.map((word) => {
										return word.replace(word[0], word[0].toUpperCase());
									})
									.join(" ")
							: "Not Assigned"}
					</Col>
				</Row>
				<Row>
					<Col>Survey Programmer</Col>
					<Col xs="6">
						{" "}
						{row.ProgrammerAssigned
							? row.ProgrammerAssigned.toLowerCase()
									.split("@")[0]
									.split(".")
									.map((word) => {
										return word.replace(word[0], word[0].toUpperCase());
									})
									.join(" ")
							: "Not Assigned"}
						{/* This string transformation (email to names) is dodgy. Will check with Sai for better ways.  */}
					</Col>
				</Row>
				<Row>
					<Col xs="6">Other Project Team Contacts</Col>
					<Col xs="6">
						{CostingProfile &&
						CostingProfile.Project.OtherProjectTeamContacts &&
						CostingProfile.Project.OtherProjectTeamContacts.length
							? CostingProfile.Project.OtherProjectTeamContacts.map(
									(opt, index) => (
										<li className="no-list-style" key={index}>
											{opt.value
												.toLowerCase()
												.split("@")[0]
												.split(".")
												.map((word) => {
													return word.replace(word[0], word[0].toUpperCase());
												})
												.join(" ")}
										</li>
									)
							  )
							: "Not Available"}
					</Col>
				</Row>
			</Col>
		);
	};
	const expandRow = {
		renderer: (row) => (
			<div>
				<Row>
					<Col lg="3" md="3" sm="12" xs="12" className="border-right">
						{projectDetails(row)}
					</Col>
					<Col lg="3" md="3" sm="12" xs="12" className="border-right">
						{clientDetails(row)}
					</Col>
					<Col lg="3" md="3" sm="12" xs="12" className="border-right">
						{projectContacts(row)}
					</Col>
					<Col lg="3" md="3" sm="12" xs="12">
						{timeline(row)}
					</Col>
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
		<Card>
			<CardBody className="p-4">
				<BootstrapTable
					hover
					striped
					responsive
					defaultSorted={[{ dataField: "createdAt", order: "desc" }]}
					bootstrap4
					bordered={false}
					keyField="id"
					data={tableData}
					columns={tableColumns}
					expandRow={expandRow}
				/>
			</CardBody>
		</Card>
	);
};

const Tables = (props) => {
	return (
		<Container fluid className="p-0">
			<ExpandableRowsTable {...props} />
		</Container>
	);
};

export default Tables;

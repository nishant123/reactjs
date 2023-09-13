import React from "react";
import {
	Row,
	Col,
	Card,
	CardBody,
	CardTitle,
	CardHeader,
	Container,
} from "reactstrap";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { MinusCircle, PlusCircle } from "react-feather";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ExpandableRowsTable = ({ delOpp, tableData, tableColumns }) => {
	const expandRow = {
		renderer: (row) => (
			<div>
				<Row>
					<Col>
						<h5>Opportunity Owner</h5>
						{row.OpportunityOwnerName ? row.OpportunityOwnerName : "-"}
					</Col>
					<Col>
						<h5>Client Industry Group</h5>
						{row.Industry}
					</Col>
					<Col>
						<h5>Delivery Start Date</h5>
						{row.StartofDelivery ? row.StartofDelivery.split("T")[0] : "-"}
					</Col>
					<Col>
						<h5>Delivery End Date</h5>
						{row.EndofDelivery ? row.EndofDelivery.split("T")[0] : "-"}
					</Col>
					<Col xs="1">
						<FontAwesomeIcon
							title="Remove Client"
							icon={faTrash}
							fixedWidth
							onClick={(e) => delOpp(row.OpportunityNumber, row.id)}
						/>
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
			<CardHeader>
				{/* <CardTitle tag="h5">Expandable Rows</CardTitle>
        <h6 className="card-subtitle text-muted">
          Expandable rows by react-bootstrap-table2
        </h6> */}
				<CardTitle>Project Clients/Accounts</CardTitle>
			</CardHeader>
			<CardBody className="p-0 mb-0">
				<BootstrapTable
					bootstrap4
					striped
					hover
					condensed
					className="m-1 mb-0"
					bordered={false}
					keyField="ContractNumber"
					data={tableData}
					columns={tableColumns}
					expandRow={expandRow}
				// pagination={paginationFactory({
				//   sizePerPage: 10,
				//   sizePerPageList: [5, 10, 25, 50],
				// })}
				/>
			</CardBody>
		</Card>
	);
};

const Tables = (props) => {
	console.log("tables", props);
	return (
		<Container fluid className="p-0">
			<ExpandableRowsTable {...props} />
		</Container>
	);
};

export default Tables;

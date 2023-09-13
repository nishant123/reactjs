import React, { useState, useEffect } from "react";
import InfiniteScroll from "@alexcambose/react-infinite-scroll";
import { CardBody, Card, Container } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import DeleteModal from "../DeletePrompt/DeleteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import * as manageUserActions from "../../../redux/actions/manageUserActions";
import { useSelector, useDispatch } from "react-redux";
import RecordsSpinner from "../../../components/RecordsSpinner";
import RecordsBadge from "../../../components/RecordsBadge";
import UserExpandableRow from "../ExpandableRow/UserExpandableRow";
import { MinusCircle, PlusCircle } from "react-feather";

const UsersTable = ({ onClickedRowId }) => {
	const dispatch = useDispatch();
	const isLoading = useSelector(({ manageUsers }) => manageUsers.recordLoading);
	const hasMore = useSelector(({ manageUsers }) => manageUsers.hasMore);
	const users = useSelector(({ manageUsers }) => manageUsers.users);
	const totalItems = useSelector(({ manageUsers }) => manageUsers.totalItems);
	const selectedUser = useSelector(
		({ manageUsers }) => manageUsers.selectedUser
	);

	const fetchMoreData = () => {
		if (users.length < totalItems) {
			dispatch(manageUserActions.loadSearchUsers(users.length));
		} else {
			dispatch(manageUserActions.updateState({ hasMore: false }));
		}
	};

	useEffect(() => {
		dispatch(manageUserActions.updateState({ hasMore: true }));
	}, [users]);

	//Delete User State and Handelling
	const [deleteModalShow, setDeleteModalShow] = useState(false);

	// cancel delete action
	const onDeleteToggle = () => {
		setDeleteModalShow(!deleteModalShow);
	};

	// confirm delete action
	const onDeleteOk = () => {
		dispatch(manageUserActions.deleteUser(selectedUser.Email));
		onDeleteToggle();
	};

	// delete button handler from UsersTable
	const onDeleteHandler = (e, id) => {
		e.stopPropagation();
		dispatch({ type: manageUserActions.LOAD_SELECTEDUSER, UserId: id });
		setDeleteModalShow(true);
	};

	//User Data Mapping
	const data = {
		tableColumns: [
			{ dataField: "id", text: "USER ID", classes: "colStyle", sort: true },
			{ dataField: "Email", text: "EMAIL", classes: "colStyle", sort: true },
			{
				dataField: "FirstName",
				text: "FIRST NAME",
				classes: "colStyle",
				sort: true,
			},
			{
				dataField: "LastName",
				text: "LAST NAME",
				classes: "colStyle",
				sort: true,
			},
			// { dataField: 'Team', text: 'TEAM', sort: true },
			// { dataField: 'IsDisabled', text: 'ACCESS DISABLED', sort: true },
			{
				dataField: "createdAt",
				text: "DATE CREATED",
				classes: "colStyle",
				formatter: (cell) => {
					return cell !== null && typeof cell !== "undefined"
						? cell.split("T")[0]
						: null;
				},
				sort: true,
			},
			{
				dataField: "remove",
				text: "",
				classes: "colStyle",
				formatter: (cell, row) => {
					return (
						<div className="removeIconContainer">
							<FontAwesomeIcon
								title="Delete User"
								onClick={(e) => onDeleteHandler(e, row.id)}
								icon={faTrash}
								fixedWidth
							/>
						</div>
					);
				},
			},
		],
		tableData: users,
		sortBy: "id",
	};

	const expandRow = {
		renderer: (row) => <UserExpandableRow rowData={row} />,
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
		<>
			<DeleteModal
				show={deleteModalShow}
				toggle={onDeleteToggle}
				onSubmit={onDeleteOk}
				user={selectedUser}
			/>
			<InfiniteScroll
				loadMore={fetchMoreData}
				hasMore={hasMore}
				isLoading={isLoading}
				loading={<RecordsSpinner />}
				noMore={<RecordsBadge recordTypeLabel="users" />}
				initialLoad={false}
			>
				<BootstrapTable
					defaultSorted={[{ dataField: data.sortBy, order: "asc" }]}
					bootstrap4
					striped
					bordered={false}
					keyField="Email"
					data={data.tableData}
					columns={data.tableColumns}
					expandRow={expandRow}
					hover
				/>
			</InfiniteScroll>
		</>
	);
};

export default UsersTable;

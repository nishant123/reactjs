import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Row,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Table,
	Input,
	Label,
	Spinner,
	Badge,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import "./ManageUsers.css";
import DashboardLayout from "../../layouts/Dashboard";
import Navbar from "../../components/NavbarUsers";
import "./Users/Users.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import * as manageUserActions from "../../redux/actions/manageUserActions";
import { useSelector, useDispatch } from "react-redux";
import UsersTable from "./usersTable/UsersTable";
import UserDetailModal from "./UserDetails/UserDetailModal";
import ModalSpinner from "../../components/ModalSpinner";

const ManageUsers = () => {
	const dispatch = useDispatch();
	const totalItems = useSelector(({ manageUsers }) => manageUsers.totalItems);
	const hasMore = useSelector(({ manageUsers }) => manageUsers.hasMore);
	const searchbar = useSelector(({ navbar }) => navbar.SearchCharactors);
	const searchbarSelectedType = useSelector(({ navbar }) => navbar.SearchBy);
	const codeLabels = useSelector(({ codeLabels }) => codeLabels);
	const isLoading = useSelector(({ app }) => app.recordloading);
	useEffect(() => {
		// dispatch({ type: "SET_SEARCHBY", SearchTypes: searchbarOptions });
		dispatch({
			type: manageUserActions.SEARCHED_USER,
			SearchCharacters: searchbar,
			SeachingType: searchbarSelectedType,
		});
	}, [searchbar]);

	useEffect(() => {
		dispatch({ type: "SEARCH_TYPE", SearchingType: 'email' });
	}, []);


	// User Detail Modal's States and Handelling
	const [UserDetailModalShow, setUserDetailModalShow] = useState(false);
	const [request, setRequest] = useState("");
	const [DeleteUser, setDeleteUser] = useState(false);
	const [isOpen, handleOpen] = useState(false);
	const [selectedCountries, setCountries] = useState([]);
	const [selectedVerticals, setVerticals] = useState([]);
	const [selectedBusinessUnits, setBusinessUnits] = useState([]);
	const countries =useSelector(({ codeLabels }) => codeLabels.CommissioningCountriesOptions) ||[];
	const verticals =useSelector(({ codeLabels }) => codeLabels.VerticalOptions) || [];
	const businessUnits =useSelector(({ codeLabels }) => codeLabels.BusinessUnitOptions) || [];
	const searchCharactors =useSelector(({ navbar }) => navbar.SearchCharactors) || "";
	const searchBy = useSelector(({ navbar }) => navbar.SearchBy);
	console.log(searchBy,"--")
	const [clear, isClear] = useState(false);
	const users =useSelector(({ manageUsers }) => manageUsers.users) || [];
	const onSearchBarValueChange = (chr) => {
		dispatch({ type: "SEARCH_CHARACTORS", Charactors: chr });
	};
	const onSearchBarTypeChange = (typ) => {
		console.log(typ)
		dispatch({ type: "SEARCH_TYPE", SearchingType: typ });
		dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
	};
	const onModalChange = () => {
		handleOpen(!isOpen);
	};
	const handleCountries = (code) => {
		const arrayList = [...selectedCountries];
		if (!selectedCountries.includes(code)) arrayList.push(code);
		else {
			let i = arrayList.indexOf(code);
			arrayList.splice(i, 1);
		}
		setCountries([...arrayList]);
	};
	const hanldeVerticals = (code) => {
		const arrayList = [...selectedVerticals];
		if (!selectedVerticals.includes(code)) arrayList.push(code);
		else {
			let i = arrayList.indexOf(code);
			arrayList.splice(i, 1);
		}
		setVerticals([...arrayList]);
	};
	const hanldeBusinessUnits = (code) => {
		const arrayList = [...selectedBusinessUnits];
		if (!selectedBusinessUnits.includes(code)) arrayList.push(code);
		else {
			let i = arrayList.indexOf(code);
			arrayList.splice(i, 1);
		}
		setBusinessUnits([...arrayList]);
	};

	const getJson = () => {
		return {
			verticals: selectedVerticals.length > 0 ? selectedVerticals : undefined,
			businessUnits:
				selectedBusinessUnits.length > 0 ? selectedBusinessUnits : undefined,
			countries: selectedCountries.length > 0 ? selectedCountries : undefined,
		};
	};
	const handleAdvancedFilter = (e) => {
		handleOpen(false);
		isClear(true);
		dispatch(manageUserActions.loadSearchUsers(0, getJson()));
	};
	useEffect(() => {
		dispatch(manageUserActions.loadSearchUsers(0));
		dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
	}, []);

	const [timelimit, setTimeLimit] = useState(0);
	const handleSearch = () => {
		let searchingType = searchBy;
		if (searchBy === "") {
			searchingType = "email";
		}
		if (timelimit) clearTimeout(timelimit);
		if (searchCharactors.length >= 3 || searchCharactors.length === 0) {
			setTimeLimit(
				setTimeout(() => {
					let jsonBody = {
						[searchingType]: searchCharactors,
					};
					dispatch(manageUserActions.loadSearchUsers(0, jsonBody));
					isClear(true);
				}, 500)
			);
		}
	};
	const handleClear = () => {
		isClear(false);
		setVerticals([]);
		setCountries([]);
		setBusinessUnits([]);
		dispatch({ type: "SEARCH_CHARACTORS", Charactors: "" });
		dispatch(manageUserActions.loadSearchUsers(0, {}));
	};
	const onDeleteClick = (val) => {
		setUserDetailModalShow(false);
		setDeleteUser(val);
	};

	const onUserDetailToggle = () => {
		setUserDetailModalShow(false);
	};

	// const onUserDetailsOk = () => {
	//   onUserDetailToggle();
	// };

	const onClickedRowId = (id) => {
		if (id) {
			dispatch({ type: manageUserActions.LOAD_SELECTEDUSER, UserId: id });
		}
	};

	const onAddUser = () => {
		dispatch(manageUserActions.resetSelectedUser());
		setUserDetailModalShow(true);
	};

	let length = Math.max(
		countries.length,
		verticals.length,
		businessUnits.length
	);
	return (
		<>
			<DashboardLayout
				navbar={
					<Navbar
						onSearchBarValueChange={onSearchBarValueChange}
						onSearchBarTypeChange={onSearchBarTypeChange}
						handleOpen={onModalChange}
						handleSearch={handleSearch}
						handleClear={handleClear}
						searchCharactors={searchCharactors}
						clear={clear}
					/>
				}
			>
				<Card>
					<CardHeader>
						<div>
							<div className="float-left">
								<h2>
									Showing {users.length} of {totalItems} Users
								</h2>
							</div>
							<div className="float-right">
								<Button
									onClick={() => {
										onAddUser();
									}}
								>
									Add New User
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardBody className="p-4">
						<UsersTable onClickedRowId={onClickedRowId} />
					</CardBody>
				</Card>

				{isLoading ? <Row className="justify-content-center">
					<Spinner show={isLoading} />
				</Row> : null}
				{/* {!hasMore ? <Row className="justify-content-center">
					<Badge href="#" color="info">
						All Users loaded. Back to top ↑</Badge>
				</Row> : null} */}
			</DashboardLayout>

			<Modal isOpen={isOpen} toggle={() => handleOpen()} size="lg">
				<ModalHeader toggle={() => handleOpen()}>Refine Search</ModalHeader>
				<ModalBody>
					<Table borderless>
						<thead>
							<tr>
								<th>COMMISSIONING COUNTRY</th>
								<th>VERTICALS</th>
								<th>BUSINESS UNITS</th>
							</tr>
						</thead>
						<tbody>
							{[...Array(length).keys()].map((index) => (
								<tr>
									{countries.map(
										(country, key) =>
											key === index &&
											countries.length > index && (
												<td
													onClick={() => handleCountries(country.Code)}
													className={
														selectedCountries.includes(country.Code)
															? "selected-column"
															: "table-column"
													}
												>
													{selectedCountries.includes(country.Code) && (
														<span style={{ marginRight: "5%" }}>
															<FontAwesomeIcon icon={faCheck} fixedWidth />
														</span>
													)}
													{country.Label}
												</td>
											)
									)}
									{index >= countries.length && <td></td>}
									{verticals.map(
										(vertical, key) =>
											key === index &&
											verticals.length > index && (
												<td
													onClick={() => hanldeVerticals(vertical.Code)}
													className={
														selectedVerticals.includes(vertical.Code)
															? "selected-column"
															: "table-column"
													}
												>
													{selectedVerticals.includes(vertical.Code) && (
														<span style={{ marginRight: "5%" }}>
															<FontAwesomeIcon icon={faCheck} fixedWidth />
														</span>
													)}
													{vertical.Label}
												</td>
											)
									)}
									{index >= verticals.length && <td></td>}
									{businessUnits.map(
										(bu, key) =>
											key === index &&
											businessUnits.length > index && (
												<td
													onClick={() => hanldeBusinessUnits(bu.Code)}
													className={
														selectedBusinessUnits.includes(bu.Code)
															? "selected-column"
															: "table-column"
													}
												>
													{selectedBusinessUnits.includes(bu.Code) && (
														<span style={{ marginRight: "5%" }}>
															<FontAwesomeIcon icon={faCheck} fixedWidth />
														</span>
													)}
													{bu.Label}
												</td>
											)
									)}
									{index >= businessUnits.length && <td></td>}
								</tr>
							))}
						</tbody>
					</Table>
				</ModalBody>
				<ModalFooter>
					<Button
						color="primary"
						onClick={(e) => {
							handleAdvancedFilter(e);
						}}
					>
						Filter
					</Button>{" "}
					<Button color="secondary" onClick={() => handleOpen()}>
						Cancel
					</Button>
				</ModalFooter>
			</Modal>

			<UserDetailModal
				show={UserDetailModalShow}
				toggle={onUserDetailToggle}
			/>
		</>
	);
};

export default ManageUsers;

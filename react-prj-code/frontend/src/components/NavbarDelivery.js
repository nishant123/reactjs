import React from "react";
import { connect } from "react-redux";
import { getLabel, getSingleOptions } from "../utils/codeLabels";
import { toggleSidebar } from "../redux/actions/sidebarActions";
import * as userActions from "../redux/actions/userActions";
import { useHistory } from "react-router-dom";
import { debounce } from "throttle-debounce";
import {
	Row,
	Col,
	Collapse,
	Navbar,
	Button,
	Nav,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	InputGroup,
	Input,
} from "reactstrap";
import { User } from "react-feather";

import avatar1 from "../assets/img/avatars/nielsen-logo.png";

const NavbarComponent = (props) => {
	const history = useHistory();
	const handleLogOut = () => {
		props.onLogOut();
		history.push("/auth/login");
	};
	let { searchCharactors } = props;
	const searchBy = [
		{ Code: "projectId", Label: "Project ID" },
		{ Code: "projectName", Label: "Project Name" },
		{ Code: "waveName", Label: "Wave Name" },
		{ Code: "programmer", Label: "Programmer" },
		{ Code: "projectmanager", Label: "Project Manager" },
		{ Code: "proposalOwner", Label: "Proposal Owner" },
	];

	return (
		<Navbar color="white" light expand fixed="top" sticky="top">
			<span
				className="sidebar-toggle d-flex mr-2"
				onClick={() => {
					props.onToggleSideBar();
				}}
			>
				<i className="hamburger align-self-center" />
			</span>
			<span
				style={{
					color: "#354052",
					fontWeight: "700",
					fontSize: "20px",
					letterSpacing: "0.1vh",
				}}
			>
				{props.headerTitle}
			</span>

			<Collapse navbar>
				<Nav className="ml-auto" navbar>
					<InputGroup>
						<Input
							type="select"
							id="exampleCustomSelect"
							name="customSelect"
							onChange={(e) => props.onSearchBarTypeChange(e.target.value)}
						>
							{searchBy.map((opt, index) => {
								return (
									<option key={index} value={opt.Code}>
										{opt.Label}
									</option>
								);
							})}
						</Input>
						<Input
							type="text"
							placeholder="Search projects..."
							aria-label="Search"
							className="mr-sm-2"
							value={searchCharactors}
							onChange={(e) => props.onSearchBarValueChange(e.target.value)}
							onKeyUp={() => props.handleSearch()}
						/>
					</InputGroup>
				</Nav>
			</Collapse>
			<Button
				onClick={() => {
					props.handleOpen(true);
				}}
			>
				Advanced Search
			</Button>
			{props.clear && (
				<Button
					style={{ margin: "10px" }}
					onClick={() => {
						props.handleClear();
					}}
				>
					Clear Filter
				</Button>
			)}
			<Collapse navbar>
				<Nav className="ml-auto" navbar>
					<UncontrolledDropdown nav inNavbar>
						<span className="d-none d-sm-inline-block">
							<DropdownToggle nav caret>
								<img
									src={avatar1}
									className="avatar img-fluid rounded-circle mr-1"
									alt="User Profile Picture"
								/>
								<span className="text-dark">
									{props.userRecord.FirstName} {props.userRecord.LastName}
								</span>
							</DropdownToggle>
						</span>
						<DropdownMenu right>
							<DropdownItem>
								<User size={18} className="align-middle mr-2" />
								Profile
							</DropdownItem>
							<DropdownItem divider />
							<DropdownItem
								onClick={(e) => {
									handleLogOut();
								}}
							>
								Sign out
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
				</Nav>
			</Collapse>
		</Navbar>
	);
};

const mapStateToProps = (state) => ({
	app: state.app,
	userRecord: state.user.userRecord,
	codeLabels: state.codeLabels,
});

const mapDispatchToProps = (dispatch) => {
	return {
		onLogOut: () => {
			dispatch(userActions.logout());
		},
		onToggleSideBar: () => {
			dispatch(toggleSidebar());
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);

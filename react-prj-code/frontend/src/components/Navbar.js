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
	UncontrolledButtonDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	ListGroup,
	ListGroupItem,
	Form,
	InputGroup,
	Input,
} from "reactstrap";

import usFlag from "../assets/img/flags/us.png";

import {
	AlertCircle,
	Bell,
	BellOff,
	Home,
	MessageCircle,
	Settings,
	User,
	UserPlus,
	RefreshCw,
} from "react-feather";

import avatar1 from "../assets/img/avatars/nielsen-logo.png";

// const NavbarDropdown = ({
//   children,
//   count,
//   showBadge,
//   header,
//   footer,
//   icon: Icon,
// }) => (
//   <UncontrolledDropdown nav inNavbar className="mr-2">
//     <DropdownToggle nav className="nav-icon dropdown-toggle">
//       <div className="position-relative">
//         <Icon className="align-middle" size={18} />
//         {showBadge ? <span className="indicator">{count}</span> : null}
//       </div>
//     </DropdownToggle>
//     <DropdownMenu right className="dropdown-menu-lg py-0">
//       <div className="dropdown-menu-header position-relative">
//         {count} {header}
//       </div>
//       <ListGroup>{children}</ListGroup>
//       <DropdownItem header className="dropdown-menu-footer">
//         <span className="text-muted">{footer}</span>
//       </DropdownItem>
//     </DropdownMenu>
//   </UncontrolledDropdown>
// );

// const NavbarDropdownItem = ({ icon, title, description, time, spacing }) => (
//   <ListGroupItem>
//     <Row noGutters className="align-items-center">
//       <Col xs={2}>{icon}</Col>
//       <Col xs={10} className={spacing ? "pl-2" : null}>
//         <div className="text-dark">{title}</div>
//         <div className="text-muted small mt-1">{description}</div>
//         <div className="text-muted small mt-1">{time}</div>
//       </Col>
//     </Row>
//   </ListGroupItem>
// );

// const ProjectSearchBy = () => {
//   return (
//     <UncontrolledDropdown nav inNavbar className="mr-2">
//       <DropdownToggle nav caret className="nav-flag">
//         {BellOff}
//       </DropdownToggle>
//       <DropdownMenu right>
//         <DropdownItem>
//           <span className="align-middle">English</span>
//         </DropdownItem>
//         <DropdownItem>
//           <span className="align-middle">Spanish</span>
//         </DropdownItem>
//         <DropdownItem>
//           <span className="align-middle">German</span>
//         </DropdownItem>
//         <DropdownItem>
//           <span className="align-middle">Dutch</span>
//         </DropdownItem>
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   );
// };

const SearchBy = [
	{
		Code: "ID",
		Label: "Project ID",
	},
	{
		Code: "NAME",
		Label: "Project Name",
	},

	{
	  "Code":"OP",Label:"Op Number"
	},
	{
	  "Code":"PO",Label:"Proposal Owner"
	},
	{
	  "Code":"AN",Label:"Account Name"
	},
	{
		"Code":"PM",Label:"Project Manager"
	  }
];
const NavbarComponent = (props) => {
	const history = useHistory();
	const handleLogOut = () => {
		props.onLogOut();
		history.push("/auth/login");
	};
	let { searchCharactors } = props;

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
			{props.show!==false &&
			<>
			<Collapse navbar>
				<Nav className="ml-auto" navbar>
					<InputGroup>
						<Input
							type="select"
							id="exampleCustomSelect"
							name="customSelect"
							onChange={(e) => props.onSearchBarTypeChange(e.target.value)}
						>
							{SearchBy.map((opt, index) => {
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
			)}{" "}
			</>
}
			{/* <RefreshCw onClick={} /> */}
			<Collapse navbar>
				<Nav className="ml-auto" navbar>
					{/* <UncontrolledDropdown nav inNavbar className="mr-2">
            <DropdownToggle nav caret className="nav-flag">
              <img src={usFlag} alt="English" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <span className="align-middle">English</span>
              </DropdownItem>
              <DropdownItem>
                <span className="align-middle">Spanish</span>
              </DropdownItem>
              <DropdownItem>
                <span className="align-middle">German</span>
              </DropdownItem>
              <DropdownItem>
                <span className="align-middle">Dutch</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
					{/* <ProjectSearchBy /> */}
					{/* <NavbarDropdown
            header="New Messages"
            footer="Show all messages"
            icon={MessageCircle}
            count={messages.length}
            showBadge
          >
            {messages.map((item, key) => {
              return (
                <NavbarDropdownItem
                  key={key}
                  icon={
                    <img
                      className="avatar img-fluid rounded-circle"
                      src={item.avatar}
                      alt={item.name}
                    />
                  }
                  title={item.name}
                  description={item.description}
                  time={item.time}
                  spacing
                />
              );
            })}
          </NavbarDropdown>

          <NavbarDropdown
            header="New Notifications"
            footer="Show all notifications"
            icon={BellOff}
            count={notifications.length}
          >
            {notifications.map((item, key) => {
              let icon = <Bell size={18} className="text-warning" />;

              if (item.type === "important") {
                icon = <AlertCircle size={18} className="text-danger" />;
              }

              if (item.type === "login") {
                icon = <Home size={18} className="text-primary" />;
              }

              if (item.type === "request") {
                icon = <UserPlus size={18} className="text-success" />;
              }

              return (
                <NavbarDropdownItem
                  key={key}
                  icon={icon}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                />
              );
            })}
          </NavbarDropdown> */}

					<UncontrolledDropdown nav inNavbar>
						{/* <span className="d-inline-block d-sm-none">
              <DropdownToggle nav caret>
                <Settings size={18} className="align-middle" />
              </DropdownToggle>
            </span> */}
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

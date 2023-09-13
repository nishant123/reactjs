import * as types from "../actions/manageUserActions";
import update from "immutability-helper";

// users array
const initialState = {
	hasMore: true,
	recordLoading: false,
	users: [],
	filteredUsers: [],
	selectedUser: {
		UserName: null,
		Email: null,
		BusinessUnits: null,
		PrimaryRole: null,
		Language: null,
		Permissions: null,
		Countries: null,
		CreatedBy: null,
		UpdatedBy: null,
		Verticals: null,
		LastLoginDate: null,
		LastPasswordResetDate: null,
		IsDisabled: false,
		DisplayinLocalCurrency: false,
		FirstName: null,
		LastName: null,
		Comments: null,
		IsClientService: false,
		IsCostingSPOC: false,
		IsDeveloper: false,
		IsInternalUser: false,
		IsMarketAdmin: false,
		IsOpsProjectManager: false,
		IsProgrammer: false,
		IsProgrammingTeamLeader: false,
		IsTCSUser: false,
	},
	totalItems: 0,
};

export default function manageUserReducer(state = initialState, actions) {
	switch (actions.type) {
		case types.UPDATE_SELECTEDUSER:
			return {
				...state,
				selectedUser: {
					...state.selectedUser,
					...actions.updatedData,
				},
			};
		case types.RESET_SELECTEDUSER:
			return {
				...state,
				selectedUser: initialState.selectedUser,
			};
		case types.CREATE_USER:
			return update(state, { users: { $push: actions.UserData } });

		case types.LOAD_USERS:
			return update(state, { users: { $push: actions.UsersData } });

		case types.SET_USERS:
			return {
				...state,
				users:actions.UsersData,
			};

		case types.DELETE_USER:
			var newArray = state.users.filter((user) => user.Email != actions.UserId);
			return {
				...state,
				users: newArray,
			};
		case types.LOAD_SELECTEDUSER:
			var currentUser = state.users.find((user) => user.id === actions.UserId);

			if (state.users.length > 0) {
				return {
					...state,
					selectedUser: {
						...currentUser,
					},
				};
			} else {
				return {
					...state,
				};
			}

		case types.UPDATE_USER:
			let newUsersList = [...state.users];
			newUsersList.forEach((user) => {
				if (user.Email === actions.emailId) {
					user.Email = actions.data.Email ? actions.data.Email : user.Email;
					user.Language = actions.data.Language
						? actions.data.Language
						: user.Language;
					user.FirstName = actions.data.FirstName
						? actions.data.FirstName
						: user.FirstName;
					user.LastName = actions.data.LastName
						? actions.data.LastName
						: user.LastName;
					user.IsDisabled = actions.data.IsDisabled
						? actions.data.IsDisabled
						: actions.data.IsDisabled == false
						? actions.data.IsDisabled
						: user.IsDisabled;
					user.DisplayinLocalCurrency = actions.data.DisplayinLocalCurrency
						? actions.data.DisplayinLocalCurrency
						: actions.data.DisplayinLocalCurrency == false
						? actions.data.DisplayinLocalCurrency
						: user.DisplayinLocalCurrency;
					user.Countries = actions.data.Countries
						? actions.data.Countries
						: user.Countries;
					user.BusinessUnits = actions.data.BusinessUnits
						? actions.data.BusinessUnits
						: user.BusinessUnits;
					user.PrimaryRole = actions.data.PrimaryRole
						? actions.data.PrimaryRole
						: user.PrimaryRole;
					user.Permissions = actions.data.Permissions
						? actions.data.Permissions
						: user.Permissions;
					user.Verticals = actions.data.Verticals
						? actions.data.Verticals
						: user.Verticals;
					user.IsClientService = actions.data.IsClientService
						? actions.data.IsClientService
						: actions.data.IsClientService == false
						? actions.data.IsClientService
						: user.IsClientService;
					user.IsCostingSPOC = actions.data.IsCostingSPOC
						? actions.data.IsCostingSPOC
						: actions.data.IsCostingSPOC == false
						? actions.data.IsCostingSPOC
						: user.IsCostingSPOC;
					user.IsDeveloper = actions.data.IsDeveloper
						? actions.data.IsDeveloper
						: actions.data.IsDeveloper == false
						? actions.data.IsDeveloper
						: user.IsDeveloper;
					user.IsInternalUser = actions.data.IsInternalUser
						? actions.data.IsInternalUser
						: actions.data.IsInternalUser == false
						? actions.data.IsInternalUser
						: user.IsInternalUser;
					user.IsMarketAdmin = actions.data.IsMarketAdmin
						? actions.data.IsMarketAdmin
						: actions.data.IsMarketAdmin == false
						? actions.data.IsMarketAdmin
						: user.IsMarketAdmin;
					user.IsOpsProjectManager = actions.data.IsOpsProjectManager
						? actions.data.IsOpsProjectManager
						: actions.data.IsOpsProjectManager == false
						? actions.data.IsOpsProjectManager
						: user.IsOpsProjectManager;
					user.IsProgrammer = actions.data.IsProgrammer
						? actions.data.IsProgrammer
						: actions.data.IsProgrammer == false
						? actions.data.IsProgrammer
						: user.IsProgrammer;
					user.IsProgrammingTeamLeader = actions.data.IsProgrammingTeamLeader
						? actions.data.IsProgrammingTeamLeader
						: actions.data.IsProgrammingTeamLeader == false
						? actions.data.IsProgrammingTeamLeader
						: user.IsProgrammingTeamLeader;
					user.IsTCSUser = actions.data.IsTCSUser
						? actions.data.IsTCSUser
						: actions.data.IsTCSUser == false
						? actions.data.IsTCSUser
						: user.IsTCSUser;
				}
			});
			return {
				...state,
				users: newUsersList,
			};
		case types.LOAD_TOTALITEMS:
			var totalItemsInt = parseInt(actions.totalItems, 10);
			return {
				...state,
				totalItems: totalItemsInt,
			};
		case types.TOTALITEMS_ADD:
			return {
				...state,
				totalItems: state.totalItems + 1,
			};
		case types.TOTALITEMS_SUBTRACT:
			return {
				...state,
				totalItems: state.totalItems - 1,
			};
		case types.UPDATE:
			return {
				...state,
				...actions.data,
			};
		default:
			return {
				...state,
			};
	}
}

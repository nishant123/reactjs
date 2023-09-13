import * as currentCostingActions from "../actions/currentCostingActions";

const initialState = {
	currentCostingProfile: {
		ProfileName: "",
		ProfileNumber: 0,
		ProfileStatus: "1",
		IsTracker: false,
		NumberOfWaves: 1,
		TrackingFrequency: "",
		IsMultiCountry: false,
		FieldingCountries: [],
		StudyType: [],
		// Methodology: [],
		// SubMethodology: [],
		ResearchType: "",
		FieldType: "",
		VerticalId: null,
	},
};

export default function currentCostingReducer(state = initialState, actions) {
	switch (actions.type) {
		case currentCostingActions.SELECT_COSTING:
			console.log("COSTING SELECTED", actions.profile);
			return {
				currentCostingProfile: actions.profile,
			};
		case currentCostingActions.UPDATE_NEW_COSTING:
			return {
				currentCostingProfile: {
					...state.currentCostingProfile,
					...actions.currentCostingProfile,
				},
			};
		case currentCostingActions.CLEAR_NEW_COSTING:
			return {
				...state,
				currentCostingProfile: { ...initialState.currentCostingProfile },
			};
		case currentCostingActions.SET_CURRENCIES:
			return {
				...state,
				currencies: actions.payload,
				currentCostingProfile: {
					...state.currentCostingProfile
					, ProfileSetting: { ...state.currentCostingProfile.ProfileSetting, CurrenciesData: actions.payload }
				}
			};
		default:
			return state;
	}
}

import * as currentCountrySpecActions from "../actions/currentCountrySpecActions";

const initialState = {
  data: {},
};

export default function currentCountrySpecReducer(
  state = initialState,
  actions
) {
  switch (actions.type) {
    case currentCountrySpecActions.SELECT_COUNTRYSPEC:
      return {
        ...actions.countrySpec,
        data: { ...actions.countrySpec.data } || {},
      };
    case currentCountrySpecActions.UPDATE_COUNTRYSPEC:
      return {
        ...state,
        ...actions.currentCountrySpec,
      };
    case currentCountrySpecActions.CLEAR_COUNTRYSPEC:
      return initialState;
    default:
      return state;
  }
}

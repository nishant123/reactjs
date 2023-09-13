import * as types from "../actions/navbarActions";

const initialState = {
  SearchBy: "",
  SearchCharactors: ""
};

export default function navbarReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.SEARCH_CHARACTORS:
      return {
        ...state,
        SearchCharactors: actions.Charactors
      }
    case types.SEARCH_TYPE:
      return {
        ...state,
        SearchBy: actions.SearchingType
      }
    default:
      return state;
  }
}

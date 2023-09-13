import * as types from "../actions/appActions";

const initialState = {
  apploaded: false,
  pageloaded: true,
  recordloading: false,
  costingStatus: {
    showManualCostEntry: false,
    showSheetsCosts: false
  }
};

export default function AppReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.SET_APP: {
      return {
        ...state,
        apploaded: actions.apploaded,
      };
    }
    case types.SET_PAGELOAD: {
      return {
        ...state,
        pageloaded: actions.pageloaded,
      };
    }
    case types.SET_RECORDLOAD: {
      return {
        ...state,
        recordloading: actions.recordloading,
      };
    }
    case types.SET_LOCAL_LOAD: {
      return {
        ...state,
        localPageload: actions.localPageload,
      };
    }
    case types.SET_RECORDENDED: {
      return {
        ...state,
        recordhasmore: actions.recordhasmore,
      };
    }
    case types.SET_COSTING: {
      return {
        ...state,
        costingStatus: actions.costing
      }
    }
    default:
      return state;
  }
}

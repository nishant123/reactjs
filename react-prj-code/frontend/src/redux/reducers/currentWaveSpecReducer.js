import * as currentWaveSpecActions from "../actions/currentWaveSpecActions";

const initialState = {
  OpsResourcesSchema: {},
  OpsResourcesData: {},
  CommercialTimeCostSchema: {},
  CommercialHoursData: {},
};

export default function currentWaveReducer(state = initialState, actions) {
  switch (actions.type) {
    case currentWaveSpecActions.SELECT_WAVE:
      console.log("WAVE SELECTED", actions.wave);
      if (
        !actions.wave.OpsResourcesData &&
        !actions.wave.CommercialHoursData
      ) {
        actions.wave = {
          ...actions.wave,
          OpsResourcesData: {},
          CommercialHoursData: {},
        };
      }
      return {
        ...state,
        ...actions.wave,
      };
    case currentWaveSpecActions.UPDATE_WAVE:
      return {
        ...state,
        ...actions.currentWave,
      };
    case currentWaveSpecActions.CLEAR_WAVE:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

import * as waveSpecsActions from "../actions/waveSpecsActions.js";

const initialState = [];

export default function waveSpecsReducer(state = initialState, actions) {
  switch (actions.type) {
    case waveSpecsActions.SET_WAVESPECS: {
      return [...actions.waveSpecs];
    }
    case waveSpecsActions.SET_CURRENT_DELIVERY_WAVESPEC: {
      return { ...state, currentWaveSpec: actions.waveSpec };
    }
    default:
      return state;
  }
}

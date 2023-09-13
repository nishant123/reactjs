export const SET_WAVESPECS = "SET_WAVESPECS";
export const SET_CURRENT_DELIVERY_WAVESPEC = "SET_CURRENT_DELIVERY_WAVESPEC";
export const CLEAR_WAVESPECS = "CLEAR_WAVESPECS";

export const setWaveSpecs = (waveSpecs) => {
  return (dispatch) => {
    dispatch({ type: SET_WAVESPECS, waveSpecs: waveSpecs });
  };
};
export const setCurrentWaveSpec = (waveSpec) => {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_DELIVERY_WAVESPEC, waveSpec });
  };
};

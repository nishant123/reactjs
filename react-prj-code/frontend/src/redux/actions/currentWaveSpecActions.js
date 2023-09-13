export const SELECT_WAVE = "SELECT_WAVE";
export const UPDATE_WAVE = "UPDATE_WAVE";
export const CLEAR_WAVE = "CLEAR_WAVE";

export const selectWaveSpec = (item) => {
  return (dispatch) => {
    dispatch({ type: SELECT_WAVE, wave: item });
  };
};
export const updateCurrentWaveSpec = (currentWave) => {
  console.log("current Wave");
  console.log(currentWave);
  return (dispatch) => {
    dispatch({ type: UPDATE_WAVE, currentWave: currentWave });
  };
};

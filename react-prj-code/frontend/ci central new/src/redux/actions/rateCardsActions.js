export const SET_RATECARDS = "SET_RATECARDS";

export const setRateCards = (rateCards) => {
  return (dispatch) => {
    dispatch({ type: SET_RATECARDS, rateCards: rateCards });
  };
};

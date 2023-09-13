export const SELECT_COUNTRYSPEC = "SELECT_COUNTRYSPEC";
export const UPDATE_COUNTRYSPEC = "UPDATE_COUNTRYSPEC";
export const CLEAR_COUNTRYSPEC = "CLEAR_COUNTRYSPEC";

export const selectCountrySpec = (countrySpec) => {
  return (dispatch) => {
    console.log("country spec selected", countrySpec);
    dispatch({ type: SELECT_COUNTRYSPEC, countrySpec: countrySpec });
  };
};

export const updateCountrySpec = (countrySpec) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_COUNTRYSPEC, currentCountrySpec: countrySpec });
  };
};

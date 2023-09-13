export const SET_COUNTRYSPECS = "SET_COUNTRYSPECS";
export const CLEAR_COUNTRYSPECS = "CLEAR_COUNTRYSPECS";

export const setCountrySpecs = (countrySpecs) => {
  console.log("SET COUNTRY SPECS");
  return (dispatch) => {
    dispatch({ type: SET_COUNTRYSPECS, countrySpecs: countrySpecs });
  };
};

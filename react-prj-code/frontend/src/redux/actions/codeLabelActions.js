import * as rateCardsActions from "./rateCardsActions";
import axios from "../../axios-interceptor";
import * as userActions from "./userActions";
export const SET_CODELABELS = "SET_CODELABELS";
export const SET_SEARCHBY = "SET_SEARCHBY";

export const getCodeLabels = () =>
{

    debugger;
  return (dispatch, getState) => {
    axios
      .get("/init")
      .then((res) => {
        dispatch({
          type: SET_CODELABELS,
          InitLabels: res.data.initialState,
        });
        dispatch(rateCardsActions.setRateCards(res.data.rateCards));
        const token = localStorage.getItem("auth-token");
        const userRecord = JSON.parse(localStorage.getItem("userRecord"));
        dispatch(userActions.authSuccess(token, userRecord));
      })
      .catch((err) => {
        dispatch(userActions.authFail());
      });
  };
};

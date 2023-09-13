import axios from "../../axios-interceptor";
import { toastr } from "react-redux-toastr";

import * as projectsActions from "./projectsActions";
import * as codeLabelActions from "./codeLabelActions";
import * as appActions from "./appActions";

export const AUTH_START = "AUTH_START";
export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const AUTH_FAIL = "AUTH_FAIL";
export const TOGGLE_LOGIN = "TOGGLE_LOGIN";
export const UPDATE_AUTH = "UPDATE_AUTH";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authSuccess = (authToken, userRecord) => {
  return (dispatch) => {
    dispatch({
      type: AUTH_SUCCESS,
      authToken: authToken,
      userRecord: userRecord,
    });
    dispatch({ type: appActions.SET_APP, apploaded: true });
    // dispatch(codeLabelActions.getCodeLabels());
    // dispatch(projectsActions.getProjects());
  };
};

export const authFail = (error) => {
  return (dispatch) => {
    dispatch(logout());
    dispatch({ type: appActions.SET_APP, apploaded: true });
    dispatch({ type: AUTH_FAIL, error: error });
  };
};

export const logout = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("userRecord");
  localStorage.removeItem("showModal");
  return (dispatch) => {
    dispatch({
      type: AUTH_LOGOUT,
    });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("auth-token");
    const userRecord = JSON.parse(localStorage.getItem("userRecord"));
    if (!token || token === "undefined") {
      dispatch(authFail());
    } else {
      dispatch(authSuccess(token, userRecord));
    }
  };
};

export const register = (data) => {
  return (dispatch) => {
    dispatch(appActions.pageLoadStart());
    axios
      .post("/auth/register", data)
      .then((res) => {
        dispatch(appActions.pageLoadEnd());
        toastr.success("Account Requested", res.data.message);
      })
      .catch((err) => {
        dispatch(appActions.pageLoadEnd());
        toastr.error("Request Failed", err.data?.message);
      });
  };
};

export const forgotPassword = (data) => {
  return (dispatch) => {
    //console.log(data);
    dispatch(appActions.recordLoadStart());
    axios
      .post("/auth/forgot-password", data)
      .then((res) => {
        toastr.success("Password Successfully Reset", res.data.message);
        dispatch(appActions.recordLoadEnd());
      })
      .catch((err) => {
        dispatch(appActions.recordLoadEnd());
        toastr.error("Request Failed", err.data?.message);
      });
  };
};

export const resetPassword = (data) => {
  return (dispatch) => {
    dispatch(appActions.recordLoadStart());
    axios
      .post("/auth/reset-password", data)
      .then((res) => {
        dispatch(appActions.recordLoadEnd());
        toastr.success("Password Successfully Reset", res.data.message);
      })
      .catch((err) => {
        //console.log(err);
        dispatch(appActions.recordLoadEnd());
        toastr.error("Request Failed", err.data?.message);
      });
  };
};

export const auth = (loginData) => {
  return (dispatch) => {
    dispatch(authStart());
    const payload = {
      Email: loginData.email.toLowerCase(),
      Password: loginData.password,
      };
      debugger;
    axios
      .post("/auth/login", payload)
      .then((res) => {
        localStorage.setItem("auth-token", res.data.token);
        localStorage.setItem("userRecord", JSON.stringify(res.data.user));
        // dispatch(authSuccess(res.data.token, res.data.user));
        dispatch({
          type: UPDATE_AUTH,
          field: "error",
          value: res.data.message,
        });
        //dispatch(codeLabelActions.getCodeLabels());
      })
      .catch((err) => {
        if (err?.response) {
          //console.log(err.response);
          dispatch(authFail(err.response.data?.message));
          toastr.error("Login Failed", err.response.data?.message);
        } else if (err?.data) {
          dispatch(authFail(err.data.message));
          toastr.error("Login Failed", err.data?.message);
        }
      });
  };
};

import * as codeLabelActions from "./codeLabelActions";

export const SET_APP = "SET_APP";
export const SET_PAGELOAD = "SET_PAGELOAD";
export const SET_RECORDLOAD = "SET_RECORDLOAD";
export const SET_LOCAL_LOAD = "SET_LOCAL_LOAD";
export const SET_RECORDENDED = "SET_RECORDENDED";
export const SET_COSTING = "SET_COSTING";

export const init = () => {
  return (dispatch) => {
      // dispatch(userActions.authCheckState());
      debugger;
      dispatch(codeLabelActions.getCodeLabels());
  };
};

export const pageLoadStart = () => {
  return (dispatch) => {
    dispatch({ type: SET_PAGELOAD, pageloaded: false });
  };
};
export const pageLoadEnd = () => {
  return (dispatch) => {
    dispatch({ type: SET_PAGELOAD, pageloaded: true });
  };
};

export const recordLoadStart = () => {
  return (dispatch) => {
    dispatch({ type: SET_RECORDLOAD, recordloading: true });
  };
};
export const recordLoadEnd = () => {
  return (dispatch) => {
    dispatch({ type: SET_RECORDLOAD, recordloading: false });
  };
};

export const localPageLoadStart = () => {
  return (dispatch) => {
    dispatch({ type: SET_LOCAL_LOAD, localPageload: true });
  };
};
export const localPageLoadEnd = () => {
  return (dispatch) => {
    dispatch({ type: SET_LOCAL_LOAD, localPageload: false });
  };
};

export const setCostingStatus = (costing, history) => {
  return (dispatch) => {
    dispatch({ type: SET_COSTING, costing: { ...costing } })
    if (history) {
      history.push("/costing")
    }
  }
}

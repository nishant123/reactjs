import axios from "../../axios-interceptor";
import * as appActions from "./appActions";
import { toastr } from "react-redux-toastr";

export const SET_DELIVERIES = "SET_DELIVERIES";
export const APPEND_DELIVERIES = "APPEND_DELIVERIES";
export const HANDLE_DELIVERIES = "HANDLE_DELIVERIES";
export const SET_CURRENT_DELIVERY = "SET_CURRENT_DELIVERY";

export const handleDeliveryProps = (key, value) => {
  return (dispatch) => {
    dispatch({
      type: HANDLE_DELIVERIES,
      key,
      value,
    });
  };
};
export const setDeliveries = (json = {},length=0) => {
  return (dispatch, getState) => {
    dispatch(appActions.pageLoadStart());
    //todo: api call
    axios
      .post("/deliveries/filter?limit=10&offset="+length, json)
      .then((response) => {
        let filteredItems = response.data.items.filter((item) => {
          return (
            item.WaveSpec?.CostingProfile &&
            item.WaveSpec?.CostingProfile !== {}
          );
        });
        dispatch({
          type: SET_DELIVERIES,
          payload: filteredItems,
          // totalItems: response.data.totalItems,
          totalItems: response.data.totalItems,
        });
        dispatch(appActions.pageLoadEnd());
      })
      .catch((error) => {
        dispatch(appActions.pageLoadEnd());
      });
    if (!getState().deliveries.teamLeads.length) {
      axios
        .get("/users/spteamleads/all")
        .then((response) => {
          dispatch({
            type: HANDLE_DELIVERIES,
            key: "teamLeads",
            value: response.data?.users,
          });
        })
        .catch((error) => {
          toastr.error("User Search Failed.", error.data.message);
        });
    }
    if (!getState().deliveries.programmers.length) {
      axios
        .get("/users/programmers/all")
        .then((response) => {
          dispatch({
            type: HANDLE_DELIVERIES,
            key: "programmers",
            value: response.data?.users,
          });
        })
        .catch((error) => {
          toastr.error("User Search Failed", error.data.message);
        });
    }
  };
};
export const appendDeliveries = (deliveries, totalItems) => {
  return (dispatch) => {
    dispatch({
      type: APPEND_DELIVERIES,
      payload: deliveries,
      totalItems: totalItems,
    });
  };
};
export const setCurrentDelivery = (currentDelivery) => {
  return (dispatch) => {
    dispatch({ type: SET_CURRENT_DELIVERY, payload: currentDelivery });
  };
};
export const saveDelivery = (delivery, callback) => {
  return (dispatch) => {
    // dispatch(appActions.pageLoadStart());
    dispatch(appActions.recordLoadStart());
    axios
      .put(`/deliveries/${delivery.id}`, delivery, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((response) => {
        // dispatch(appActions.pageLoadEnd());
        if (!delivery.IsDecommissionedFixed)
          toastr.success("Project Saved.", response.data.message);
        axios
          .get("/deliveries")
          .then((response) => {
            dispatch(appActions.recordLoadEnd());
            if (callback) callback();
            dispatch({
              type: SET_DELIVERIES,
              payload: response.data.items,
              totalItems: response.data.totalItems,
            });
            // dispatch(appActions.pageLoadEnd());
          })
          .catch((error) => {
            // dispatch(appActions.pageLoadEnd());
            toastr.error("Loading Failed.", error.data.message);
          });
        // dispatch({ type: SET_CURRENT_DELIVERY, payload: delivery })
      })
      .catch((error) => {
        toastr.error("Save Failed", error.data.message);
      });
  };
};

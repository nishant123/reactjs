import _ from "lodash";
import { toastr } from "react-redux-toastr";
import axios from "../../axios-interceptor";
import {
  pageLoadEnd,
  pageLoadStart,
  recordLoadEnd,
  recordLoading,
  recordLoadStart,
} from "./appActions";

export const SET_REQUESTS = "SET_REQUESTS";
export const APPEND_REQUESTS = "APPEND_REQUESTS";
export const HANDLE_REQUESTS = "HANDLE_REQUESTS";
export const GET_REQUEST_TYPES = "GET_REQUEST_TYPES";
export const CLEAR_REQUEST_TYPES = "GET_REQUEST_TYPES";



export const handleRequestProps = (key, value) => {
  return (dispatch) => {
    dispatch({
      type: HANDLE_REQUESTS,
      key,
      value,
    });
  };
};
export const setRequestTypes = () => {
  return (dispatch) => {
        dispatch({
          type: CLEAR_REQUEST_TYPES,
          payload: [],
        });
  };
}
export const getRequestTypes = (countryArray) => {
  return (dispatch) => {
    dispatch(pageLoadStart());
    axios
      .post(`/marketsettings/requesttypes/all`,countryArray)
      .then((response) => {
        console.log(response.data.RequestTypes, "pp")
        dispatch({
          type: GET_REQUEST_TYPES,
          payload: response.data.RequestTypes,
        });
        dispatch(pageLoadEnd());
      })
  };
}
export const setIndividualRequest = (requestId) => {
  return (dispatch, getState) => {
    dispatch(pageLoadStart());
    axios
      .get(`/requests/${requestId}`)
      .then((response) => {
        dispatch({
          type: SET_REQUESTS,
          payload: [response.data.project],
          totalItems: 1,
        });
        dispatch(pageLoadEnd());
        if (!getState().requests.allusers.length) {
          axios
            .get("/users/internal/all")
            .then((response) => {
              dispatch({
                type: HANDLE_REQUESTS,
                key: "allusers",
                value: response.data ?.users,
              });
            })
            .catch((error) => {
              toastr.error("Users retrieving Failed", error.data.message);
            });
        }
      })
      .catch((error) => {
        dispatch(pageLoadEnd());
        toastr.error("Request Failed.", error.data.message);
      });
  };
};
export const setRequests = (requests = {}) => {
  return (dispatch, getState) => {
    dispatch(pageLoadStart());
    axios
      .post("/requests/filter", requests)
      .then((response) => {
        let filteredItems = response.data.items.filter((item) => {
          return item.CostingProfile && item.CostingProfile !== {};
        });
        dispatch({
          type: SET_REQUESTS,
          payload: filteredItems,
          // totalItems: response.data.totalItems, // revisit
          totalItems: filteredItems.length,
        });
        dispatch(pageLoadEnd());
        if (!getState().requests.allusers.length) {
          axios
            .get("/users/internal/all")
            .then((response) => {
              dispatch({
                type: HANDLE_REQUESTS,
                key: "allusers",
                value: response.data ?.users,
              });
            })
            .catch((error) => {
              toastr.error("Users retrieving Failed", error.data.message);
            });
        }
      })
      .catch((error) => {
        dispatch(pageLoadEnd());
        toastr.error("Request Failed.", error.data.message);
      });
  };
};
export const appendRequests = (requests) => {
  return (dispatch) => {
    dispatch({ type: APPEND_REQUESTS, payload: requests });
  };
};
export const postComment = (commentData, callback) => {
  return (dispatch, getState) => {
    dispatch(recordLoadStart());
    let requests = [...getState().requests.items];
    let reqRequest = _.head(
      requests.filter((req) => req.id == commentData.RequestId)
    );
    reqRequest.RequestLogs = [...reqRequest.RequestLogs, commentData];
    dispatch({
      type: SET_REQUESTS,
      payload: [...requests],
      totalItems: getState().requests.totalItems,
    });
    axios
      .post(`/requests/${commentData.RequestId}/requestlogs`, commentData)
      .then((response) => {
        if (callback) callback();
        dispatch(recordLoadEnd());
        dispatch(updateComment(commentData));
      })
      .catch((error) => {
        dispatch(recordLoadEnd());
        toastr.error("Request Failed.", error.data.message);
      });
  };
};
export const updateComment = (commentData) => {
  return (dispatch, getState) => {
    axios
      .get(`/requests/${commentData.RequestId}/requestlogs`)
      .then((response) => {
        let requests = [...getState().requests.items];
        let reqRequest = _.head(
          requests.filter((req) => req.id == commentData.RequestId)
        );
        reqRequest.RequestLogs = _.reverse(response.data.items);
        dispatch({
          type: SET_REQUESTS,
          payload: [...requests],
          totalItems: getState().requests.totalItems,
        });
      })
      .catch((error) => {
        toastr.error("Request Failed.", error.data.message);
      });
  };
};
export const updateRequest = (request, callback) => {
  return (dispatch, getState) => {
    dispatch(recordLoadStart());

    axios
      .put(`/requests/${request.id}`, request)
      .then((response) => {
        if (callback) callback();
        dispatch(recordLoadEnd());

        let requests = [...getState().requests.items];
        let reqReqts = requests.map((req) => {
          if (req.id == request.id) {
            // req = { ...req, ..._.omit(request, ["createdAt", "updatedAt", "UpdatedBy"]) }
            return { ...request };
          } else return { ...req };
        });
        dispatch({
          type: SET_REQUESTS,
          payload: [...reqReqts],
          totalItems: getState().requests.totalItems,
        });

        //if needed add get call
        // axios
        //     .get(`/request/${request.id}`)
        //     .then(response => {
        //         let requests = [...getState().requests.items]
        //         requests.map(req => {
        //             if (req.id == request.id) {
        //                 req = response.data
        //             }
        //         })
        //         dispatch({
        //             type: SET_REQUESTS,
        //             payload: [...requests],
        //             totalItems: getState().requests.totalItems
        //         })
        //     })
        //     .catch(error => {
        //         toastr.error(error.data.message);
        //     })

        toastr.success("Request Saved.", response.data.message);
      })
      .catch((error) => {
        toastr.error("Request Failed.", error.data.message);
        dispatch(recordLoadEnd());
      });
  };
};

export const mailRequest = (requestId, template) => {
  // /utils/mail/:RequestId/request/new
  // /utils/mail/:RequestId/request/update
  // /utils/mail/:RequestId/request/close
  // /utils/mail/:RequestId/request/reopen
  return (dispatch, getState) => {
    axios
      .post("/utils/mail/" + requestId + "/request/" + template)
      .then((res) => {
        toastr.success("Request Email Notification Sent", res.data.message);
      })
      .catch((err) => {
        toastr.error("Request Email Notification Failed", err.data.message);
      });
  };
};

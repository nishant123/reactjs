import axios from "../../axios-interceptor";
import * as appActions from "./appActions";
import { toastr } from "react-redux-toastr";

export const LOAD_USERS = "LOAD_USERS";
export const SET_USERS = "SET_USERS";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const LOAD_SELECTEDUSER = "LOAD_SELECTEDUSER";
export const SEARCHED_USER = "SEARCHED_USER";
export const CREATE_USER = "CREATE_USER";
export const RESET_SELECTEDUSER = "RESET_SELECTEDUSER";
export const LOAD_TOTALITEMS = "LOAD_TOTALITEMS";
export const TOTALITEMS_ADD = "TOTALITEMS_ADD";
export const TOTALITEMS_SUBTRACT = "TOTALITEMS_SUBTRACT";
export const DELETE_FROM_CLIENT = "DELETE_FROM_CLIENT";
export const UPDATE_SELECTEDUSER = "UPDATE_SELECTEDUSER";
export const UPDATE = "UPDATE";

export const updateSelectedUser = (id, data) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_USER, emailId: id, data: data });
  };
};

export const updateNewUserData = (data) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_SELECTEDUSER, updatedData: data });
  };
};

export const loadItems = (val) => {
  console.log(val, "oo")
  return (dispatch) => {
    dispatch({ type: LOAD_USERS, UsersData: val });
  };
};
export const setItems = (val) => {
  console.log(val, "oo")
  return (dispatch) => {
    dispatch({ type: SET_USERS, UsersData: val });
  };
};

export const loadFilters = () => {
  return (dispatch) => {
    dispatch({ type: SEARCHED_USER });
  };
};

export const createUser = (val) => {
  return (dispatch) => {
    dispatch({ type: CREATE_USER, UserData: val });
  };
};

export const resetSelectedUser = () => {
  return (dispatch) => {
    dispatch({ type: RESET_SELECTEDUSER });
  };
};

export const loadTotalItems = (val) => {
  console.log(val,"pp")
  return (dispatch) => {
    dispatch({ type: LOAD_TOTALITEMS, totalItems: val });
  };
};

export const totalItemsSubtract = () => {
  return (dispatch) => {
    dispatch({ type: TOTALITEMS_SUBTRACT });
  };
};

export const totalItemsAdd = () => {
  return (dispatch) => {
    dispatch({ type: TOTALITEMS_ADD });
  };
};

export const removeUser = (id) => {
  return (dispatch) => {
    dispatch({ type: DELETE_USER, UserId: id });
  };
};

export const loadUsers = (usersCount) => {
  return (dispatch) => {
    if (usersCount === 0) {
      dispatch(appActions.pageLoadStart());
    } else {
      dispatch(updateState({ recordLoading: true }));
    }
    axios
      .get("/users?limit=20&offset=" + usersCount)
      .then((res) => {
        dispatch(loadItems(res.data.items));
        dispatch(loadTotalItems(res.data.totalItems));
        dispatch(loadFilters());
        dispatch(appActions.recordLoadEnd());
        dispatch(appActions.pageLoadEnd());
        console.log(res.data.items)
      })
      .catch((err) => {
        dispatch(appActions.pageLoadEnd());
        dispatch(appActions.recordLoadEnd());
        toastr.error("Loading Failed", err.response ? err.response.data.message : "Unexpected error occured!");
      });
  };
};
export const loadSearchUsers = (usersCount, jsonBody) => {
  return (dispatch) => {
    if (usersCount === 0) {
      dispatch(appActions.pageLoadStart());
    } else {
      dispatch(appActions.recordLoadStart());
    }
    axios
      .post("/users/search?limit=20&offset=" + usersCount, jsonBody)
      .then((res) => {
        dispatch(loadTotalItems(res.data.totalItems));
        if (usersCount === 0)
          dispatch(setItems(res.data.items));
        else
        dispatch(loadItems(res.data.items));
        dispatch(updateState({ recordLoading: false }));
        dispatch(appActions.pageLoadEnd());
        dispatch(appActions.recordLoadEnd());
      })
      .catch((err) => {
        dispatch(appActions.pageLoadEnd());
        dispatch(appActions.recordLoadEnd());
        dispatch(updateState({ recordLoading: false }));
        toastr.error("Loading Failed", err.response ? err.response.data.message : "Unexpected error occured!");
      });
  };
};

export const updateUser = (id, updatedData) => {
  return (dispatch) => {
    dispatch(appActions.recordLoadStart());
    axios
      .put(
        "/users/" + id,
        {
          ...updatedData,
        },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      )
      .then((res) => {
        dispatch({ type: UPDATE_USER, emailId: id, data: updatedData });
        toastr.success("User Updated Successfully", res ? res.data.message : "Unexpected error occured!");
        dispatch(appActions.recordLoadEnd());
        let currentUser = JSON.parse(localStorage.getItem("userRecord"))
        //in case user updated his details
        //avoid showing current user in user table
        if (currentUser.Email == id) {
          localStorage.setItem("userRecord", JSON.stringify({ ...currentUser, ...updatedData }));
        }
      })
      .catch((err) => {
        dispatch(appActions.recordLoadEnd());
        toastr.error("User Updation Failed", err.response ? err.response.data.message : "Unexpected error occured!");
      });
  };
};

export const deleteUser = (id) => {
  return (dispatch) => {
    dispatch(appActions.recordLoadStart());
    dispatch(removeUser(id));
    dispatch(totalItemsSubtract());
    dispatch(loadFilters());
    axios
      .delete("/users/" + id, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        dispatch(appActions.recordLoadEnd());
      })
      .catch((err) => {
        dispatch(totalItemsAdd());
        dispatch(loadUsers(0));
        console.log(err.response);
        // toastr.error("User Deletion Failed", err.response ? err.response.data.message : "Unexpected error occured!");
        dispatch(appActions.recordLoadEnd());
      });
  };
};

export const postUser = (data) => {
  console.log(data)
  return (dispatch) => {
    dispatch(totalItemsAdd());
    dispatch(appActions.recordLoadStart());
    axios
      .post(
        "/users/",
        {
          ...data,
        },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      )
      .then((res) => {
        toastr.success("User" + data.Email + "Created Successfully");
        dispatch(createUser([res.data.user]));
        dispatch(loadFilters());
        dispatch(appActions.recordLoadEnd());
      })
      .catch((err) => {
        console.log(err);
        dispatch(removeUser(data.Email));
        dispatch(totalItemsSubtract());
        toastr.error("User Creation Failed", err.response ? err.response.data.message : "Unexpected error occured!");
        dispatch(appActions.recordLoadEnd());
      });
  };
};

export const updateState = (data) => {
  return (dispatch) => {
    dispatch({ type: UPDATE, data: data });
  };
};

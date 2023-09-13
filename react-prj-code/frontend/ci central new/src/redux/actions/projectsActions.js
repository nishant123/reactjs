import axios from "../../axios-interceptor";
import * as userActions from "./userActions";
import * as appActions from "./appActions";

export const SET_PROJECTS = "SET_PROJECTS";
export const APPEND_PROJECTS = "APPEND_PROJECTS";

export const setProjects = (projects) => {
  return {
    type: SET_PROJECTS,
    projects: projects,
  };
};

export const appendProjects = (projects) => {
  return {
    type: APPEND_PROJECTS,
    projects: projects,
  };
};

export const getProjects = (jsonBody={}) => {
  return (dispatch) => {
    dispatch(appActions.pageLoadStart());
    axios.post("/projects/filter?limit=20",jsonBody)
      .then((res) => {
        dispatch(setProjects(res.data));
        dispatch(appActions.pageLoadEnd());
      })
      .catch((err) => {
        console.log(err);
        dispatch(appActions.pageLoadEnd());
        dispatch(userActions.logout());
      });
  };
};

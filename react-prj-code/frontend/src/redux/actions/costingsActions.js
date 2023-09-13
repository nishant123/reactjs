import axios from "../../axios-setup";
import * as appActions from "./appActions";

export const SET_CURRENT_PROFILES = "SET_CURRENT_PROFILES";
export const CLEAR_ALL_COSTINGS = "CLEAR_ALL_COSTINGS";

export const setCurrentCostingProfiles = (costingProfilesArr) => {
  console.log(costingProfilesArr);
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_PROFILES,
      costingProfiles: costingProfilesArr,
    });
  };
};

export const updateCostingProfiles = (costingProfilesArr, profile) => {
  return (dispatch) => {
    costingProfilesArr = costingProfilesArr.filter(
      (obj) => obj.id !== profile.id
    );
    costingProfilesArr.push(profile);
    costingProfilesArr.sort((a, b) => {
      return a.ProfileNumber - b.ProfileNumber;
    });
    console.log(costingProfilesArr);
    dispatch({
      type: SET_CURRENT_PROFILES,
      costingProfiles: costingProfilesArr,
    });
  };
};

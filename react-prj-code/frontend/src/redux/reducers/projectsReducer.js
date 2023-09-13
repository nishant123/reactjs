import * as types from "../actions/projectsActions";
import update from "immutability-helper";

const initialState = {
  hasMore: true,
  totalItems: 0,
  items: [],
};

export default function projectsReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.SET_PROJECTS: {
      return update(state, { $merge: actions.projects });
    }
    case types.APPEND_PROJECTS: {
      return update(state, { items: { $push: actions.projects } });
    }
    default:
      return state;
  }
}

import * as types from "../actions/rateCardsActions";
import update from "immutability-helper";

const initialState = {};

export default function rateCardsReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.SET_RATECARDS: {
      return update(state, { $merge: actions.rateCards });
    }
    default:
      return state;
  }
}

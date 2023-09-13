import * as types from "../actions/requestsActions";
import update from "immutability-helper";

const initialState = {
    allusers: [],
    requestTypes:[]
};

export default function requestsReducer(state = initialState, actions) {
    switch (actions.type) {
        case types.HANDLE_REQUESTS: {
            return update(state, { [actions.key]: { $set: actions.value } });
        }
        case types.SET_REQUESTS: {
            return update(state, { items: { $set: actions.payload }, totalItems: { $set: actions.totalItems } });
        }
        case types.GET_REQUEST_TYPES: {
            return update(state, { requestTypes: { $set: actions.payload } });
        }
        case types.CLEAR_REQUEST_TYPES: {
            return update(state, { requestTypes: { $set: actions.payload } });
        }
        case types.APPEND_REQUESTS: {
            return update(state, { items: { $push: actions.payload } });
        }
        default:
            return state;
    }
}

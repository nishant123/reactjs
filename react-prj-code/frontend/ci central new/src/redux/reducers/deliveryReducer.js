import * as types from "../actions/deliveryActions";
import update from "immutability-helper";

const initialState = {
    hasMore: true,
    currentProject: {},
    teamLeads: [],
    programmers: []
};

export default function deliveryReducer(state = initialState, actions) {
    switch (actions.type) {
        case types.HANDLE_DELIVERIES: {
            return update(state, { [actions.key]: { $set: actions.value } });
        }
        case types.SET_DELIVERIES: {
            // return Object.assign({}, state, { items: actions.payload, totalItems: actions.totalItems })
            return update(state, { items: { $set: actions.payload }, totalItems: { $set: actions.totalItems } });
        }
        case types.APPEND_DELIVERIES: {
            return update(state, { items: { $push: actions.payload }, totalItems: { $set: actions.totalItems } });
            // return Object.assign({}, state, { items: [...state.items, ...actions.payload], totalItems: actions.totalItems });
        }
        case types.SET_CURRENT_DELIVERY: {
            // return Object.assign({}, state, { currentDelivery: actions.payload })
            return update(state, { currentDelivery: { $set: actions.payload } })
        }
        default:
            return state;
    }
}

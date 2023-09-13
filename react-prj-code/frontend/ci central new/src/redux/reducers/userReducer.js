import * as types from "../actions/userActions";

const initialState = {
  userRecord: {},
  authToken: null,
  error: null,
  loading: false,
  isLogIn: true,
};

export default function userReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.AUTH_START: {
      return {
        ...state,
        error: null,
        loading: true,
      };
    }
    case types.AUTH_SUCCESS: {
      return {
        ...state,
        loading: false,
        authToken: actions.authToken,
        error: null,
        userRecord: actions.userRecord
      };
    }
    case types.AUTH_FAIL: {
      return {
        ...state,
        loading: false,
        error: actions.error,
      };
    }
    case types.TOGGLE_LOGIN: {
      return {
        ...state,
        isLogIn: !state.isLogIn,
      };
    }
    case types.UPDATE_AUTH: {
      return {
        ...state,
        [actions.field]: actions.value,
      };
    }
    case types.AUTH_LOGOUT: {
      return {...initialState};
    }
    default:
      return state;
  }
}

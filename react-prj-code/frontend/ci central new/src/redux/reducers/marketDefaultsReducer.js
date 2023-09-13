import * as types from "../actions/marketDefaultsActions";

const initialState = [
  {
    CountryName: "AU",
    BusinessUnit: [
      {
        BusinessUnitName: "CI",
        ClientServiceRateCards: [],
      },
      {
        BusinessUnitName: "MA",
        ClientServiceRateCards: [],
      }
    ]
  },
  {
    CountryName: "EG",
    BusinessUnit: [
      {
        BusinessUnitName: "CI",
        ClientServiceRateCards: [],
      },
      {
        BusinessUnitName: "MA",
        ClientServiceRateCards: [],
      }
    ]
  }
];

export default function marketDefaultsReducer(state = initialState, actions) {
  switch (actions.type) {
    case types.LOAD_ITEMS:
      return {
        ...state,
        items: actions.items
      }
    default:
      return state;
  }
}
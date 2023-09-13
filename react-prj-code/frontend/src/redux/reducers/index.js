import { combineReducers } from "redux";

import navbar from "./navbarReducer";

import sidebar from "./sidebarReducers";
import layout from "./layoutReducer";
import theme from "./themeReducer";

import currentCosting from "./currentCostingReducer";
import costings from "./costingsReducer";

import currentCountrySpec from "./currentCountrySpecReducer";
import countrySpecs from "./countrySpecsReducer";

import currentWaveSpec from "./currentWaveSpecReducer";
import waveSpecs from "./waveSpecsReducer";

import currentProject from "./currentProjectReducer";
import projects from "./projectsReducer";

import manageUsers from "./manageUsersReducer";
import marketdefaults from "./marketDefaultsReducer"

import user from "./userReducer";
import codeLabels from "./codeLabelReducer";
import app from "./appReducer";

import rateCards from "./rateCardsReducer";
import deliveries from "./deliveryReducer";
import requests from "./requestsReducer";

import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
  navbar,
  sidebar,
  layout,
  theme,
  toastr,
  currentCosting,
  costings,
  currentCountrySpec,
  countrySpecs,
  currentWaveSpec,
  waveSpecs,
  currentProject,
  projects,
  rateCards,
  manageUsers,
  marketdefaults,
  user,
  codeLabels,
  app,
  deliveries,
  requests
});

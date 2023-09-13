import axios from "../../axios-interceptor";
import * as appActions from "./appActions";
import * as costingsActions from "./costingsActions";
import * as countrySpecsActions from "./countrySpecsActions";
import * as currentCountrySpecActions from "./currentCountrySpecActions";
import * as currentWaveSpecActions from "./currentWaveSpecActions";
import * as waveSpecsActions from "./waveSpecsActions";
import * as currentProjectActions from "./currentProjectActions";
import { toastr } from "react-redux-toastr";

import {
  sumTotalCostsRawAndGenerateMinRecPrice,
  calcProfitability,
} from "../../utils/calculations";

import _ from "lodash";

export const CREATE_PROFILE = "CREATE_PROFILE";
export const UPDATE_NEW_COSTING = "UPDATE_NEW_COSTING";
export const CLEAR_NEW_COSTING = "CLEAR_NEW_COSTING";
export const SELECT_COSTING = "SELECT_COSTING";
export const SET_CURRENCIES = "SET_CURRENCIES";
export const COPY_COSTING = "COPY_COSTING";

export const selectCosting = (profile) => {
  return (dispatch) => {
    dispatch({ type: SELECT_COSTING, profile: profile });
  };
};

export const copyCosting = (profileId, callback) => {
  return (dispatch, getState) => {
    dispatch(appActions.pageLoadStart());
    axios
      .post("/costingprofiles/duplicate/" + profileId, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        dispatch(
          costingsActions.setCurrentCostingProfiles([
            ...getState().costings.costingProfiles,
            res.data.costingProfile,
          ])
        );
        toastr.success("Costing Profile copied Successfully", res.data.message);
        dispatch(appActions.pageLoadEnd());
      })
      .catch((err) => {
        toastr.error("Save Failed", err.data.error);
        dispatch(appActions.pageLoadEnd());
      });
  };
};

export const deleteCosting = (profileId, callback) => {
  return (dispatch, getState) => {
    dispatch(appActions.pageLoadStart());
    axios
      .delete("/costingprofiles/" + profileId, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        let arrayList = [...getState().costings.costingProfiles];
        arrayList = arrayList.filter(function (item) {
          return item.id !== profileId;
        });
        dispatch(costingsActions.setCurrentCostingProfiles(arrayList));
        toastr.success(
          "Costing Profile Deleted Successfully",
          res.data.message
        );
        dispatch(appActions.pageLoadEnd());
      })
      .catch((err) => {
        toastr.error("Save Failed", err.data.error);
        dispatch(appActions.pageLoadEnd());
      });
  };
};

export const getCosting = (profileId, callback, cangenerateSummary) => {
  return (dispatch, getState) => {
    dispatch(appActions.pageLoadStart());
    axios
      .get("/costingprofiles/" + profileId)
      .then((res) => {
        dispatch({ type: SELECT_COSTING, profile: res.data.costingProfile });

        let costingProfile = res.data.costingProfile;

        if (cangenerateSummary)
          costingProfile = generateSummary(res.data.costingProfile);

        dispatch(
          countrySpecsActions.setCountrySpecs(costingProfile.CountrySpecs)
        );
        dispatch(
          currentCountrySpecActions.selectCountrySpec(
            _.head(costingProfile.CountrySpecs)
          )
        );
        dispatch(waveSpecsActions.setWaveSpecs(costingProfile.WaveSpecs));
        dispatch(
          currentWaveSpecActions.selectWaveSpec(
            _.head(costingProfile.WaveSpecs)
          )
        );

        if (callback) callback();

        dispatch(appActions.pageLoadEnd());
        if (
          costingProfile.ProfileSetting &&
          !costingProfile.ProfileSetting.CurrenciesData
        )
          dispatch(setCurrencies());
      })
      .catch((err) => {
        dispatch(appActions.pageLoadEnd());
      });
  };
};

export const createCostingProfile = (newProfile, callback) => {
  return (dispatch, getState) => {
    dispatch(appActions.pageLoadStart());
    axios
      .post("/costingprofiles", newProfile, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        dispatch(
          costingsActions.setCurrentCostingProfiles([
            ...getState().costings.costingProfiles,
            res.data.costingProfile,
          ])
        );
        dispatch(getCosting(res.data.costingProfile.id, callback));
      })
      .catch((err) => {
        dispatch(appActions.pageLoadEnd());
      });
  };
};

export const updateProfile = (profile, callback) => {
  return (dispatch, getState) => {
    if (callback) dispatch(callback);
    dispatch({
      type: UPDATE_NEW_COSTING,
      currentCostingProfile: { ...profile },
      currencies: getState().costings.currencies,
    });
  };
};

export const profileCalc = (profile) => {
  // console.log("PROFILE CALC CALLED");
  return (dispatch) => {
    let newProfile = profile;

    // let fields = [
    //   "CostExtCharting",
    //   "CostIntCharting",
    //   "CostExtDataProcessing",
    //   "CostIntDataProcessing",
    //   "CostExtVerbatimCoding",
    //   "CostIntVerbatimCoding",
    //   "CostExtTextAnalytics",
    //   "CostIntSurveyProgramming",
    //   "CostExtSurveyProgramming",
    //   "CostIntOtherDataPreparation",
    //   "CostIntAdditionalOperationsSupport",
    //   "SurveyProgrammingJobCount",
    // ];

    // fields.forEach((field) => {
    //   newProfile[field] = newProfile.WaveSpecs.reduce((total, val) => {
    //     return val[field] ? total + val[field] : total;
    //   }, 0);
    // });

    // console.log(newProfile);
    dispatch(updateProfile(newProfile));
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
    dispatch({
      type: costingsActions.SET_CURRENT_PROFILES,
      costingProfiles: costingProfilesArr,
    });
  };
};

// export const saveCostingProfile = (costing) => {
//   // console.log("before dispatch");
//   return (dispatch) => {
//     // console.log("after dispatch");
//     dispatch(appActions.recordLoading(true));
//     axios
//       .put("/costingprofiles/" + costing.id, costing, {
//         headers: { "auth-token": localStorage.getItem("auth-token") },
//       })
//       .then((res) => {
//         // console.log("done");
//         dispatch(appActions.recordLoading(false));
//       })
//       .catch((err) => {
//         // console.log("error", err);
//         dispatch(appActions.recordLoading(false));
//       });
//   };
// };
const calculateFinalCosts = (costing) => {
  let finalCostFields = [];
  costing.CountrySpecs.map((cs) => {
    cs.MethodologySpecs.map((ms) => {
      Object.keys(ms.CalculationSchema).map((csch) => {
        if (!_.includes(finalCostFields, csch)) {
          finalCostFields.push(csch);
        }
        Object.keys(ms.CalculationSchema[csch]).map((insch) => {
          if (!_.includes(finalCostFields, insch)) {
            finalCostFields.push(insch);
          }
        });
      });
    });
  });
  finalCostFields.map((fcf) => {
    costing[fcf] = 0;
    costing.CountrySpecs.map((cs) => {
      costing[fcf] = costing[fcf] + (cs[fcf] ? cs[fcf] : 0);
    });
    costing.WaveSpecs.map((ws) => {
      // finalCostFields.map(fcf => {
      costing[fcf] = costing[fcf] + (ws[fcf] ? ws[fcf] : 0);
      // })
    });
  });
  return { ...costing };
};

const calcCountryToProfileCost = (costing) => {
  console.log("in calc profile cost");
  console.log(costing);
  const waveFields = [
    "CostExtOpsCharting",
    "CostExtOpsDataEntry",
    "CostExtOpsDataProcessing",
    "CostExtOpsHosting",
    "CostExtOpsOnlineSample",
    "CostExtOpsSurveyProgramming",
    "CostExtOpsTextAnalytics",
    "CostExtOpsVerbatimCoding",
    "CostIntCommAssociateDirector",
    "CostIntCommDataScience",
    "CostIntCommDirector",
    "CostIntCommExecDirector",
    "CostIntCommExecutive",
    "CostIntCommManager",
    "CostIntCommSeniorExecutive",
    "CostIntCommSeniorManager",
    "CostIntOpsAdditionalOperationsSupport",
    "CostIntOpsCharting",
    "CostIntOpsDataEntry",
    "CostIntOpsDataProcessing",
    "CostIntOpsDataScience",
    "CostIntOpsOtherDataPreparation",
    "CostIntOpsPM",
    "CostIntOpsSurveyProgramming",
    "CostIntOpsVerbatimCoding",
    "SurveyProgrammingJobCount",
    "TotalIntOpsPMHours",
    "TotalOnlineSampleSize",
  ];
  const countryFields = [
    "CostExtCommConsultant",
    "CostExtCommOthers",
    "CostExtCommTE",
    "CostExtOpsConsultantVendor",
    "CostExtOpsDCQCDPSP",
    "CostExtOpsFreightShipping",
    "CostExtOpsIncentives",
    "CostExtOpsInterviewers",
    "CostExtOpsMCPSubContract",
    // "CostExtOpsOnlineSample",
    "CostExtOpsOtherTaxVAT",
    "CostExtOpsOthers",
    "CostExtOpsPrintingStationery",
    "CostExtOpsTE",
    "CostExtOpsVenueHireRecruitment",
    "CostIntCommAssociateDirector",
    "CostIntCommDataScience",
    "CostIntCommDirector",
    "CostIntCommExecDirector",
    "CostIntCommExecutive",
    "CostIntCommManager",
    "CostIntCommSeniorExecutive",
    "CostIntCommSeniorManager",
    "CostIntOpsDPCodingAnalysis",
    "CostIntOpsFieldPMQC",
    "CostIntOpsOthers",
    "CostIntOpsProgramming",
  ];
  let allFields = waveFields.concat(countryFields);
  allFields.forEach((field) => {
    costing[field] = 0;
  });
  waveFields.forEach((field) => {
    costing[field] = costing.WaveSpecs.reduce((total, wave) => {
      if (wave[field] === undefined) {
        console.log("WAVE FIELD IS UNDEFINED", field);
        return total + 0;
      } else {
        return total + wave[field];
      }
    }, 0);
  });
  countryFields.forEach((field) => {
    costing[field] =
      costing[field] +
      costing.CountrySpecs.reduce((total, country) => {
        if (country[field] === undefined) {
          console.log("COUNTRY FIELD IS UNDEFINED", field);
          return total + 0;
        } else {
          return total + country[field];
        }
      }, 0);
  });

  // console.log("ta da");
  // console.log(costing);
  return costing;
};

// export const generateSummary = (cb) => {
//   // console.log("GENERATE SUMMARY");
//   return (dispatch, getState) => {
//     let profile = getState().currentCosting.currentCostingProfile;
//     if (profile.CostingType != "SHEETS")
//       profile = calcCountryToProfileCost(profile);
//     profile = sumTotalCostsRawAndGenerateMinRecPrice({
//       ...profile,
//     });
//     dispatch(updateProfile(profile));

//     cb();
//   };
// };

export const generateSummary = (profile) => {
  if (profile.CostingType != "SHEETS")
    profile = calcCountryToProfileCost(profile);
  profile = sumTotalCostsRawAndGenerateMinRecPrice({
    ...profile,
  });
  return profile;
};

export const saveCostingProfile = (costing, callback, noToastRequired) => {
  console.log("save start");
  console.log("costing to save", costing);
  return (dispatch, getState) => {
    // costing = calculateFinalCosts(costing);
    dispatch(appActions.recordLoadStart());
    if (!costing.IsImportedProfile) {
      // this moves the commercial time cost from WaveSpecs back to profile.WaveSpecs
      costing = { ...costing, WaveSpecs: [...getState().waveSpecs] };
      costing = generateSummary({ ...costing });
    }

    // const cb = () =>
    axios
      .put("/costingprofiles/" + costing.id, costing, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        console.log("save start");
        if (callback) callback();
        console.log("save done");
        // console.log(res);
        if (!noToastRequired) {
          toastr.success("Costing Profile Saved", res.data.message);
        }
        let currentCosting = {
          ...getState().currentCosting.currentCostingProfile,
        };
        costing.ProfileSetting.CSRateCardUsed =
          currentCosting.ProfileSetting.CSRateCardUsed;
        console.log("the One with everything", costing);
        dispatch(updateProfile(costing));
        dispatch(waveSpecsActions.setWaveSpecs(costing.WaveSpecs));
        dispatch(appActions.recordLoadEnd());
      })
      .catch((err) => {
        console.log("save start");

        // console.log("error", err);
        toastr.error("Save Failed", err?.data?.error);
        dispatch(appActions.recordLoadEnd());
      });

    // dispatch(generateSummary(cb));
  };
};
export const saveSchedule = (costing, callback) => {
  return (dispatch, getState) => {
    let currentWaveId = getState().currentWaveSpec.id;
    // costing = calculateFinalCosts(costing);
    // costing = { ...costing, WaveSpecs: [...getState().waveSpecs] }
    dispatch(appActions.recordLoadStart());
    axios
      .put("/costingprofiles/" + costing.id, costing, {
        headers: { "auth-token": localStorage.getItem("auth-token") },
      })
      .then((res) => {
        axios
          .post(`/deliveries/${currentWaveId}/deliveryspec`)
          .then((response) => {
            if (callback) callback();
            if (response.status == 201)
              toastr.success("Save Success", res.data.message);

            dispatch(appActions.recordLoadEnd());
          })
          .catch((error) => {
            dispatch(appActions.recordLoadEnd());
            toastr.error("Save Failed", error.data.error);
            // console.log(error, "error");
          });
      })
      .catch((err) => {
        // console.log("error", err);
        toastr.error("Save Failed", err.data.error);
        dispatch(appActions.recordLoadEnd());
      });
  };
};
export const setCurrencies = (callback) => {
  return (dispatch, getState) => {
    axios
      .get("/marketsettings/currencies/all")
      .then((response) => {
        if (callback) callback();
        dispatch({ type: SET_CURRENCIES, payload: response.data.currencies });
        let currenCosting = {
          ...getState().currentCosting.currentCostingProfile,
        };
        let currentCostingProfileSetting = {
          ...currenCosting.ProfileSetting,
          CurrenciesData: response.data.currencies,
        };
        let costing = {
          ...currenCosting,
          ProfileSetting: currentCostingProfileSetting,
        };
        dispatch(updateProfile(costing));
        dispatch(saveCostingProfile(costing, null, true));
      })
      .catch((error) => {
        toastr.error(error.data.error);
      });
  };
};

export const commissionCosting = (callback) => {
  return (dispatch, getState) => {
    let profile = { ...getState().currentCosting.currentCostingProfile };
    let user = getState().user.userRecord.Email;
    profile.ProfileStatus = "6";
    profile.Project.ProjectStatus = "3";
    profile.Project.CommissionedProfileId = profile.id;
    profile.Project.CommissionedBy = user;
    profile.CommissionedBy = user;
    profile.CommissionedDate = new Date();
    dispatch(saveCostingProfile(profile, callback));
  };
};

export const generateProfitability = (priceToClient) => {
  // console.log("GENERATE PROFITABILITY");
  return (dispatch, getState) => {
    let profile = {
      ...getState().currentCosting.currentCostingProfile,
      PriceToClient: priceToClient,
    };
    if (!profile.ApprovalDetails) {
      axios
        .get("/marketsettings/" + profile.Project.VerticalId + "/approvers/all")
        .then((res) => {
          // console.log(res);
          // fetch approvalSettings
          // sort by order (or have this done in backend)
          res.data.ApprovalDetails.sort((a, b) => {
            return a.Order - b.Order;
          });
          // save approvaldetails to profile
          profile.ApprovalDetails = [...res.data.ApprovalDetails];
          // to be done elsewhere:
          // if level has multiple approvers, check IsMandatoryApprover, if true for multiple approvers, await for all mandatory approvers to approve
          // else if one of approvers has approved, go to next level until level needed is met
          // console.log("after assigning approval details");
          profile = calcProfitability(profile);

          // profile = approvalValidation(profile);
          // // console.log("after return from approval validation function");
          // console.log("after calc profitability");
          // console.log(profile);
          dispatch(updateProfile({ ...profile }));
        })
        .catch((err) => {
          // console.log(err);
        });
    } else {
      profile = calcProfitability(profile);

      // profile = approvalValidation(profile);
      // // console.log("after return from approval validation function");
      // console.log("after calc profitability");
      // console.log(profile);
      dispatch(updateProfile({ ...profile }));
    }
  };
};

const sendMail = (template, cb) => {
  console.log("sendmail start");
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    const api = "/utils/mail/" + profile.id + "/approval/" + template;
    axios
      .post(api)
      .then(() => {
        if (cb) cb();
        console.log("sendmail done");
        toastr.success("Email notification sent");
        // console.log("SEND MAIL SUCCESS", template);
      })
      .catch(() => {
        console.log("sendmail done");
        toastr.error("Email notification failed");
        // console.log("SEND MAIL FAILED", template);
        // console.log(api);
      });
  };
};

export const sendForApproval = () => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    // default field to be created on db
    profile.ApprovalLevelAwaiting = 0; // default
    profile.ApprovalLevelReached = -1; // default

    profile.ApprovalSent = true;
    profile.ProfileStatus = "3";

    //MAIL
    // const cb = dispatch(
    //   saveCostingProfile(profile, dispatch(updateProfile(profile)))
    // );
    // dispatch(sendMail("new", cb));

    dispatch(
      saveCostingProfile(profile, () => {
        dispatch(sendMail("new", () => dispatch(updateProfile(profile))));
      })
    );
  };
};

const updateCurrentApprovalLevel = () => {
  return (dispatch, getState) => {
    let profile = getState().currentCosting.currentCostingProfile;
    const previousLevelAwaiting = profile.ApprovalLevelAwaiting;
    profile.ApprovalDetails.forEach((level) => {
      let mandatoryCount = 0;
      let mandatoryApproved = 0;
      let approved = false;
      level.ApproverContacts.forEach((contact) => {
        // checks if approvers are mandatory
        if (contact.IsMandatoryApprover) {
          mandatoryCount += 1;
          if (contact.Approved) {
            mandatoryApproved += 1;
          }
        }
        // if any approver at the level approves, toggle flag true
        if (contact.Approved) {
          approved = true;
        }
      });
      // checks both mandatory approver condition and approved condition
      if (approved && mandatoryCount === mandatoryApproved) {
        profile.ApprovalLevelReached = level.Order;
        if (profile.ApprovalLevelReached < profile.ApprovalLevelNeeded) {
          // doesn't hurt to always increment
          profile.ApprovalLevelAwaiting = level.Order + 1;
        }
      }
      // console.log(
      //   "checking level",
      //   mandatoryCount,
      //   mandatoryApproved,
      //   approved
      // );
    });

    // check if approvals have been fulfilled
    if (profile.ApprovalLevelReached >= profile.ApprovalLevelNeeded) {
      // profile is approved
      // no longer awaiting approvals
      // update profileStatus
      profile.ProfileStatus = "5";
      // save and update record
      dispatch(
        saveCostingProfile(profile, () =>
          dispatch(sendMail("complete", () => dispatch(updateProfile(profile))))
        )
      );
      // alert("profile is approved");
    } else {
      // console.log("profile is not approved");
      // test if profileLevelAwaiting is updated
      if (profile.ApprovalLevelAwaiting !== previousLevelAwaiting) {
        // awaiting new level of approval
        // send mail
        // alert("send mail to new level of approvers");
        // save and update
        //MAIL
        dispatch(
          saveCostingProfile(profile, () =>
            dispatch(sendMail("new", () => dispatch(updateProfile(profile))))
          )
        );
      } else {
        dispatch(
          saveCostingProfile(profile, () => dispatch(updateProfile(profile)))
        );
      }
    }
  };
};

export const approve = () => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    const user = getState().user.userRecord.Email;
    // console.log(user);
    // sets Approved = true in ApproverContacts in ApprovalDetails at ALL levels
    profile.ApprovalDetails = profile.ApprovalDetails.map((level) => {
      // // console.log("LEVEL", level);

      level.ApproverContacts = level.ApproverContacts.map((contact) => {
        // TEMP FOR TESTING
        // if (level.Order === 0) {
        //   contact.EmailAddress = user;
        // }
        ////////////////////
        if (contact.EmailAddress === user) {
          contact.Approved = true;
        }
        return contact;
      });
      return level;
    });
    // dispatch(updateProfile(profile));
    dispatch(updateCurrentApprovalLevel());
    // Mail notify approval granted only if level is approved in updateCurrentApprovalLevel
  };
};

export const deny = () => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    const user = getState().user.userRecord.Email;
    // console.log(user);
    // sets Approved = true in ApproverContacts in ApprovalDetails at ALL levels
    profile.ApprovalDetails = profile.ApprovalDetails.map((level) => {
      // // console.log("LEVEL", level);

      level.ApproverContacts = level.ApproverContacts.map((contact) => {
        // TEMP FOR TESTING
        // if (level.Order === 0) {
        //   contact.EmailAddress = user;
        // }
        ////////////////////
        if (contact.EmailAddress === user) {
          contact.Denied = true;
          // update profile to be denied here?
          profile.ProfileStatus = "4";
        }
        return contact;
      });
      return level;
    });
    // dispatch(updateProfile(profile));
    // dispatch(updateCurrentApprovalLevel());
    //MAIL
    const cb = dispatch(
      saveCostingProfile(profile, () => dispatch(updateProfile(profile)))
    );
    dispatch(sendMail("deny", cb));
  };
};

export const bypassApproval = () => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    profile.ApprovalDetails = profile.ApprovalDetails.map((level) => {
      level.ApproverContacts = level.ApproverContacts.map((contact) => {
        // can add more conditions in here on whether or not user can override
        if (level.Order === profile.ApprovalLevelAwaiting) {
          contact.Approved = true;
          level.IsBypassed = true;
        }
        return contact;
      });
      return level;
    });
    // dispatch(updateProfile(profile));
    dispatch(updateCurrentApprovalLevel());
  };
};

export const resetApprovals = () => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    profile.ApprovalDetails = null;
    profile.ApprovalLevelReached = -1;
    profile.ApprovalLevelNeeded = -1;
    profile.ApprovalLevelAwaiting = null;
    profile.ProfileStatus = "1";
    profile.ApprovalNotes = null;
    profile.ApprovalJustification = null;
    dispatch(updateProfile(profile));
  };
};

export const decommissionProfile = (cb) => {
  return (dispatch, getState) => {
    const profile = getState().currentCosting.currentCostingProfile;
    dispatch(appActions.recordLoadStart());
    axios
      .post("/costingprofiles/duplicate/" + profile.id)
      .then((res) => {
        console.log(res);
        profile.ProfileStatus = "99";
        profile.Project.ProjectStatus = "30";

        const cbb = () => {
          cb();
          dispatch(appActions.recordLoadEnd());
        };
        dispatch(
          saveCostingProfile(profile, () =>
            dispatch(
              currentProjectActions.getProject(profile.Project.ProjectId, cbb)
            )
          )
        );
      })
      .catch((err) => {
        console.log(err);
        toastr.error("Decommission Failed", err?.data?.error);
        dispatch(appActions.recordLoadEnd());
      });
  };
};

const calcFormula = (profile) => {
  let finalCostFields = [];
  let finalExternalOpsFields = []
  let countryspecs = profile.CountrySpecs;
  const additionalLabels = {
    CostTotalExternalOperations: {
      // CostExtOpsMCPSubContract: "MCP/Group Company Sub-Contracting",
      CostExtOpsOtherTaxVAT: ["MCPTaxCost"
        , "MCPOtherTaxAdjustment"
        , "MCPLocalCountryExtra"]
    },
  };
  const alternativeLabels = {
    CostTotalInternalCommercial: {
      UsesOopOverrideIntCommCost: "CostIntCommMultiplier",
      // Value: "CostTotalExternalOperations"
    },
    CostTotalInternalOperations: {
      UsesOopOverrideIntOpsCost: "CostIntOpsMultiplier",
      // Value: "CostTotalExternalOperations"
    },
  };
  const costIntCommLabels = {
    CostIntCommExecDirector: "Executive Director",
    CostIntCommDirector: "Director",
    CostIntCommAssociateDirector: "Associate Director",
    CostIntCommSeniorManager: "Senior Manager",
    CostIntCommManager: "Manager",
    CostIntCommSeniorExecutive: "Senior Executive",
    CostIntCommExecutive: "Executive",
    CostIntCommDataScience: "Data Science",
  }
  countryspecs.map((cs) => {

    cs.MethodologySpecs.map((ms) => {
      let costCalFormulas = ms.CalculationSchema;
      Object.keys(costCalFormulas).map((ccf) => {
        cs[ccf] = 0;
        Object.keys(costCalFormulas[ccf]).map((obj) => {
          cs[obj] = 0;
          cs.MethodologySpecs.map((mth) => {
            if (mth.CostsData) {
              cs[obj] =
                cs[obj] +
                _.sum(
                  Object.keys(mth.CostsData)
                    .filter((cdkey) =>
                      _.includes(costCalFormulas[ccf][obj], cdkey)
                    )
                    .map((k) => {
                      return mth.CostsData[k];
                    })
                );
            }
          });
          cs[ccf] = cs[ccf] + cs[obj];
        });

        if (additionalLabels[ccf])
          Object.keys(additionalLabels[ccf]).map((obj) => {
            cs[obj] = 0;
            cs.MethodologySpecs.map((mth) => {
              if (mth.CostsData) {
                cs[obj] =
                  cs[obj] +
                  _.sum(
                    Object.keys(mth.CostsData)
                      .filter((cdkey) =>
                        _.includes(additionalLabels[ccf][obj], cdkey)
                      )
                      .map((k) => {
                        return mth.CostsData[k];
                      })
                  );
              }
            });
            cs[ccf] = cs[ccf] + cs[obj];
          });

      });

      Object.keys(ms.CalculationSchema).map((csch) => {
        if (!_.includes(finalCostFields, csch)) {
          finalCostFields.push(csch);
        }

        if (!_.includes(finalExternalOpsFields, csch)
          && csch == "CostTotalExternalOperations") {
          finalExternalOpsFields.push(csch);
        }

        Object.keys(ms.CalculationSchema[csch]).map((insch) => {
          if (!_.includes(finalCostFields, insch)) {
            finalCostFields.push(insch);
          }
          if (!_.includes(finalExternalOpsFields, insch)
            && csch == "CostTotalExternalOperations") {
            finalExternalOpsFields.push(insch);
          }
        });
        if (additionalLabels && additionalLabels[csch]) {
          Object.keys(additionalLabels[csch]).map((lab) => {
            if (!_.includes(finalCostFields, lab)) {
              finalCostFields.push(lab);
            }
            // if (!_.includes(finalExternalOpsFields, lab)
            //   && csch == "CostTotalExternalOperations") {
            //   finalExternalOpsFields.push(lab);
            // }
          });
        }
      });

    });
    Object.keys(costIntCommLabels).map(commlabel => {
      cs[commlabel] = 0;
      cs.MethodologySpecs.map((mth) => {
        if (mth.CostsData) {
          cs[commlabel] = cs[commlabel] + (mth.CostsData[commlabel] ? mth.CostsData[commlabel] : 0)
        }
      })
      if (!_.includes(finalCostFields, commlabel)) {
        finalCostFields.push(commlabel);
      }
    })
  });
  let fieldingCountries = countryspecs.filter(cs => cs.CountryCode !== profile.Project.CommissioningCountry)
  profile["CostExtOpsMCPSubContract"] = 0
  fieldingCountries.map(fc => {
    // fc["CostExtOpsMCPSubContract"] = fc["CostTotalExternalOperations"]
    profile["CostExtOpsMCPSubContract"] = profile["CostExtOpsMCPSubContract"] + (fc["CostTotalExternalOperations"] - fc["CostExtOpsOtherTaxVAT"])
  })
  finalCostFields.map((ff) => {
    // if (!currentCostingProfile[ff])
    profile[ff] = 0;
    countryspecs.map((cs) => {
      if (!(_.includes(finalExternalOpsFields, ff) && cs.CountryCode !== profile.Project.CommissioningCountry))
        profile[ff] = profile[ff] + cs[ff];
    });
  });

  let finalProfile = {
    ...profile,
    CountrySpecs: countryspecs
  };
  return finalProfile;
};
export const syncSheetData = (profile) => {
  return (dispatch) => {
    dispatch(appActions.pageLoadStart());
    axios
      .put(`/utils/sheets/${profile.id}/costing`)
      .then((response) => {
        let profileToSave = calcFormula({ ...response.data.CostingProfile, isOldSheet: response.data.isOldSheet })
        dispatch(updateProfile({ ...profileToSave, CountrySpecs: [] }));
        dispatch(
          countrySpecsActions.setCountrySpecs(
            []
          )
        );
        dispatch(
          saveCostingProfile(
            profileToSave,
            () => {
              dispatch(appActions.pageLoadEnd());
              dispatch(
                countrySpecsActions.setCountrySpecs(
                  profileToSave.CountrySpecs
                )
              );
              toastr.success(
                "Sheet Sync Success",
                "SUCCESS: Costing Sheet Sync Complete."
              );
            },
            true
          )
        );
      })
      .catch((error) => {
        dispatch(appActions.pageLoadEnd());
        toastr.error("Sheet Sync Failed", error?.data.error);
      });
  };
};

export const unlockPriceToClient = () => {
  return (dispatch, getState) => {
    let profile = getState().currentCosting.currentCostingProfile;
    profile.ProfileStatus = "1";
    dispatch(updateProfile(profile));
    dispatch(resetApprovals());
  };
};
const getCurrentCurrency = (actualvalue, currentCurrency) => {
  let finalVal = _.round(
    actualvalue * currentCurrency.ConversionRateToLocal,
    2
  );
  return `${finalVal} ${currentCurrency.CurrencyUnit}`
}
export const downloadInPdf = (selectedProperties, currentCurrency) => {
  return (dispatch, getState) => {
    let profile = getState().currentCosting.currentCostingProfile;
    let orientation =
      ((profile.CountrySpecs.length > 5 && profile.CountrySpecs.length <= 10)
        || (profile.WaveSpecs.length > 5 && profile.WaveSpecs.length <= 10))
        ? "landscape"
        : "potrait";
    let format = "A4";
    if (profile.CountrySpecs.length > 6 || profile.WaveSpecs.length > 6) {
      format = "A3";
    }
    if (profile.CountrySpecs.length > 10 || profile.WaveSpecs.length > 10) {
      format = "A2";
    }
    dispatch(appActions.recordLoadStart());
    const tableStyles = `
    <style>
    table{
      font-size:12pt !important;
      border-collapse: collapse;
      margin: 0.5pt 0 0.5pt 0;
    }
    th,td{
      border-top: 1pt solid #ccc;
      border-bottom: 1pt solid #ccc;
      padding: 0.5pt 0.5pt;
      page-break-inside: avoid!important;
      page-break-before: avoid!important;
      max-width:250px;
      word-break:break-word;
    }
    tr{
      page-break-before: avoid!important;
      page-break-inside: avoid!important;
      font-size:10pt !important;
    }
    .mb-0{
      margin-bottom: 0;
    }
    </style>
    `;
    const docheader = `<div style="border-bottom: 1pt double #ccc;"><div style="display:flex;justify-content:space-between;"><h5>Project Name: ${profile.Project.ProjectName} </h5><h5>Project ID: ${profile.Project.ProjectId}<h5></div>
    <div style="display:flex;justify-content:flex-start;"><h5>Profile name:${profile.ProfileName}</h5></div></div>
    `;

    const propertyLookup = {
      profitabilitychecks: { id: "profitabilityChecksBreakdown", header: "Profitablity Checks" },
      profitability: { id: "profitabilityBreakdown", header: "Profitablity Overview" },
      costbreakdown: { id: "totalCostbreakdown", header: "Total Cost Breakdown" },
      opsresources: { id: "operationsResourceBreakdown", header: "Operation Resources" },
      methodology: { id: "methodologiesBreakdown", header: "Methodologies" },
      projectDetails: { id: "projectDetails", header: "Project Details" }
    }

    let htmlbodyMarkup = ""
    selectedProperties.map(selectedProp => {
      let currentProp = propertyLookup[selectedProp]
      let additionalData = ""
      if (selectedProp == "profitability") {
        additionalData = `<tr style="font-size:12px !important;"><td style="font-size:12px !important;">Actual Price To Client</td> <td style="font-size:12px !important;padding-left:5px;">${getCurrentCurrency(profile.PriceToClient, currentCurrency)}</td></tr>`
      }
      htmlbodyMarkup = `${htmlbodyMarkup}<br></br><h5>${currentProp.header}</h5><div style="margin-top:1pt;">${document.getElementById(currentProp.id).innerHTML + additionalData}</div>`
    })

    axios
      .post(
        "/utils/converttopdf",
        {
          htmlcontent: `${tableStyles}<div id="pageHeader-first">${docheader}</div><div style="margin-top:1pt;">${htmlbodyMarkup}</div>`,
          orientation,
          format,
          docheader,
        },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      )
      .then((response) => {
        if (response.data && response.data.data && response.data.data.data) {
          const pdfblob = new Blob([new Uint8Array(response.data.data.data)], {
            type: "application/pdf",
          });
          const downloadLink = document.createElement("a");

          downloadLink.href = URL.createObjectURL(pdfblob);
          downloadLink.className = "hidden";
          document.body.appendChild(downloadLink);

          downloadLink.setAttribute(
            "download",
            `${profile.Project.ProjectId}${profile.Project.ProjectName ? `_${profile.Project.ProjectName}` : ""}_${profile.ProfileNumber}${profile.ProfileName ? `_${profile.ProfileName}` : ""}_summary.pdf`
          );

          downloadLink.setAttribute("target", `_blank`);
          downloadLink.click();
          dispatch(appActions.recordLoadEnd());
          window.addEventListener(
            "focus",
            (e) => {
              setTimeout(() => downloadLink.remove(), 300);
              URL.revokeObjectURL(downloadLink.href);
            },
            { once: true }
          );
        } else {
          toastr.error("Download failed");
        }
      })
      .catch((error) => {
        dispatch(appActions.recordLoadEnd());
        toastr.error(
          "Download failed",
          error.data ? error.data.message : error
        );
      });
  }
}
export const downloadPdf = (id, filename, header) => {
  return (dispatch, getState) => {
    let profile = getState().currentCosting.currentCostingProfile;
    let project = getState().currentProject.newProject;
    let orientation =
      profile.CountrySpecs.length > 5 && profile.CountrySpecs.length <= 10
        ? "landscape"
        : "potrait";
    let format = "A4";
    if (profile.CountrySpecs.length > 6) {
      format = "A3";
    }
    if (profile.CountrySpecs.length > 10) {
      format = "A2";
    }
    // let format = "A4"
    dispatch(appActions.recordLoadStart());
    const tableStyles = `
    <style>
    table{
      font-size:12pt !important;
      border-collapse: collapse;
      margin: 0.5pt 0 0.5pt 0;
    }
    th,td{
      border-top: 1pt solid #ccc;
      border-bottom: 1pt solid #ccc;
      padding: 0.5pt 0.5pt;
      page-break-inside: avoid!important;
      page-break-before: avoid!important;
      
    }
    tr{
      page-break-before: avoid!important;
      page-break-inside: avoid!important;
      font-size:10pt !important;
    }
    .mb-0{
      margin-bottom: 0;
    }
    </style>
    `;
    const docheader = `<div style="border-bottom: 1pt double #ccc;"><div style="display:flex;justify-content:space-between;"><h5>Project Name: ${profile.Project.ProjectName} </h5><h5>Project ID: ${profile.Project.ProjectId}<h5></div>
    <div style="display:flex;justify-content:flex-start;"><h5>Profile name:${profile.ProfileName}</h5></div></div>
    `;
    const pageheader = `<h5>${header}</h5>`;
    axios
      .post(
        "/utils/converttopdf",
        {
          htmlcontent: `${tableStyles}<div id="pageHeader-first">${docheader}</div>${pageheader}<div style="margin-top:1pt;">${document.getElementById(id).innerHTML
            }</div>`,
          orientation,
          format,
          docheader,
        },
        {
          headers: { "auth-token": localStorage.getItem("auth-token") },
        }
      )
      .then((response) => {
        if (response.data && response.data.data && response.data.data.data) {
          const pdfblob = new Blob([new Uint8Array(response.data.data.data)], {
            type: "application/pdf",
          });
          const downloadLink = document.createElement("a");

          downloadLink.href = URL.createObjectURL(pdfblob);
          downloadLink.className = "hidden";
          document.body.appendChild(downloadLink);

          downloadLink.setAttribute(
            "download",
            `${profile.Project.ProjectId}_${profile.Project.ProjectName}.pdf`
          );

          downloadLink.setAttribute("target", `_blank`);
          downloadLink.click();
          dispatch(appActions.recordLoadEnd());
          window.addEventListener(
            "focus",
            (e) => {
              setTimeout(() => downloadLink.remove(), 300);
              URL.revokeObjectURL(downloadLink.href);
            },
            { once: true }
          );
        } else {
          toastr.error("Download failed");
        }
      })
      .catch((error) => {
        dispatch(appActions.recordLoadEnd());
        toastr.error(
          "Download failed",
          error.data ? error.data.message : error
        );
      });
  };
};

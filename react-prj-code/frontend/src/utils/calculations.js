import axios from "../axios-interceptor";

export const calcAll = (
  currentProject,
  profile,
  countrySpecs,
  waveSpecs,
  rateCards
) => {
  // console.log("in calc All");
  // console.log("currentProject", currentProject);
  // console.log("profile", profile);
  // console.log("waveSpecs", waveSpecs);
  // console.log("rateCArds", rateCards);
  /**
   * Return maximum cost per interview based on provider rate cards for commissioning country, length of interview and incidence rate bands
   * @commissioningCountry required   commissioning country of the project
   * @loiBand {string} required       length of inteview band
   * @irBand {string} required        incidence rate band
   * @return {number}                 cost per interview, otherwise null if no matching rates for the inputs
   */
  function getOnlineCostPerInterview(fieldingCountry, loiBand, irBand) {
    // console.log(loiBand);
    // console.log(irBand);
    // console.log(fieldingCountry);
    var loi = getBounds(loiBand);
    var ir = getBounds(irBand);
    if (loi !== null && ir !== null) {
      if (rateCards.onlineSample.hasOwnProperty(fieldingCountry)) {
        var rates = rateCards.onlineSample[fieldingCountry];
        var matches = rates.filter(function (x) {
          var keep = true;
          if (x.loiU.length === 0) {
            x.loiU = 999;
          }
          if (x.irU.length === 0) {
            x.irU = 100;
          }
          if (loi.u === null) {
            if (!(loi.l <= x.loiL || (loi.l >= x.loiL && loi.l <= x.loiU))) {
              keep = false;
            }
          } else if (
            !(
              (loi.l >= x.loiL && loi.l <= x.loiU) ||
              (loi.u >= x.loiL && loi.u <= x.loiU)
            )
          ) {
            keep = false;
          }
          if (ir.u === null) {
            if (!(ir.l <= x.irL || (ir.l >= x.irL && ir.l <= x.irU))) {
              keep = false;
            }
          } else if (
            !(
              (ir.l >= x.irL && ir.l <= x.irU) ||
              (ir.u >= x.irL && ir.u <= x.irU)
            )
          ) {
            keep = false;
          }
          if (keep) {
            console.log(x);
          }
          return keep;
        });
        if (matches.length) {
          var maxRateCard = matches.reduce(function (prev, current) {
            return prev.cpi > current.cpi ? prev : current;
          });
          return maxRateCard;
        }
      }
    }
    return null;
  }

  /**
   * Return lower and upper band values by parsing a string
   * @band {string} required    A band range (e.g. >=n, >n, <=n, <n, n-n, n+), numbers can be 2 decimal places
   * @return {dictionary}       dictionary with defined lower and upper band limit, limit is null if no upper band is defined
   */
  const getBounds = (band) => {
    if (band !== null) {
      let matches = band
        .replace(/\s/g, "")
        .match(/([><]=?)?(\d+\.?\d{0,2})(\+|-)?(\d+\.?\d{0,2})?/);
      if (matches !== null) {
        let preOperator = typeof matches[1] === "undefined" ? null : matches[1];
        let op1 = typeof matches[2] === "undefined" ? null : matches[2];
        let postOperator =
          typeof matches[3] === "undefined" ? null : matches[3];
        let op2 = typeof matches[4] === "undefined" ? null : matches[4];

        if (preOperator === null && op1 !== null && postOperator !== null) {
          if (postOperator.indexOf("-") > -1 && op2 !== null) {
            return { l: Number(op1), u: Number(op2) };
          }
          if (postOperator.indexOf("+") > -1 && op2 === null) {
            return { l: Number(op1), u: null };
          }
        }
        if (
          preOperator !== null &&
          op1 !== null &&
          postOperator === null &&
          op2 === null
        ) {
          if (preOperator.indexOf("=") === -1) {
            if (preOperator.indexOf(">") > -1) {
              return { l: Number(op1) + 1, u: null };
            } else {
              return { l: 0, u: Number(op1) - 1 };
            }
          }
          if (preOperator.indexOf("=") > -1) {
            if (preOperator.indexOf(">") > -1) {
              return { l: Number(op1), u: null };
            } else {
              return { l: 0, u: Number(op1) };
            }
          }
        }
      }
    }
    return null;
  };

  const totalOnlineSampleSize = (countrySpecs, wave) => {
    for (let i = 0; i < countrySpecs.length; i++) {
      const spec = countrySpecs[i].MethodologySpecs.filter((methodology) => {
        return (
          methodology.Code === "SM000001" || methodology.Code === "SM000022"
        );
      });
      countrySpecs[i].TotalOnlineSampleSize = 0;
      if (spec.length === 1 && spec[0].RFQData) {
        console.log("IN TOTAL ONLINE SAMPLE SIZE");
        const ssExt = spec[0].RFQData.externalSampleSourceSize || 0;
        const ssInt = spec[0].RFQData.internalSampleSourceSize || 0;
        const ssSS = spec[0].RFQData.clientSuppliedSampleSourceSize || 0;
        const ssOther = spec[0].RFQData.otherSampleSourceSize || 0;
        countrySpecs[i].TotalOnlineSampleSize = ssExt + ssInt + ssSS + ssOther;
      }
    }
    wave.TotalOnlineSampleSize = countrySpecs.reduce((total, country) => {
      return total + country.TotalOnlineSampleSize;
    }, 0);
  };

  const calcOnlineExternalSampleCost = (countrySpecs, waves) => {
    console.log("in online external sample cost");
    for (let i = 0; i < countrySpecs.length; i++) {
      const spec = countrySpecs[i].MethodologySpecs.filter((methodology) => {
        return (
          methodology.Code === "SM000001" || methodology.Code === "SM000022"
        );
      });
      // console.log("specs", spec);
      //use lodash
      if (
        spec.length &&
        spec[0] &&
        spec[0].RFQData &&
        spec[0].RFQData.externalSampleProvider
      ) {
        if (
          spec[0].RFQData?.lengthOfInterview &&
          spec[0].RFQData?.incidenceRate &&
          spec[0].RFQData?.externalSampleSourceSize
        ) {
          const loi = spec[0].RFQData.lengthOfInterview;
          const ir = spec[0].RFQData.incidenceRate;
          const fieldingCountry = countrySpecs[i].CountryCode;
          countrySpecs[i].SampleSizeExternal =
            spec[0].RFQData.externalSampleSourceSize;

          countrySpecs[i].OnlineCostPerInterview =
            getOnlineCostPerInterview(fieldingCountry, loi, ir)?.cpi || 0;
          countrySpecs[i].CostExtOpsOnlineSample =
            countrySpecs[i].OnlineCostPerInterview *
            countrySpecs[i].SampleSizeExternal;
        }
      } else {
        // delete? and clear cost
        if (spec[0]) {
          delete spec[0].RFQData?.incidenceRate;
          delete spec[0].RFQData?.externalSampleSourceSize;
        }
        countrySpecs[i].CostExtOpsOnlineSample = 0;
      }
    }
    // Assigns Cost per wave
    for (let i = 0; i < waves.length; i++) {
      if (
        profile.ProfileSetting &&
        profile.ProfileSetting.CalcCostOnlineExternalSample &&
        !waves[i].OverrideOnlineSampleCost
      ) {
        waves[i].CostExtOpsOnlineSample = countrySpecs.reduce((total, val) => {
          if (val.CostExtOpsOnlineSample) {
            return total + val.CostExtOpsOnlineSample;
          } else {
            return total;
          }
        }, 0);
      }
    }
  };

  const calcHostingCost = (wave) => {
    if (!wave.OverrideHostingCost) {
      let rateHosting = profile.ProfileSetting?.RateHosting; //using just one field. removing Decipher refs
      // these fields can be not saved to record
      let costHosting = 0;
      let costOtherHosting = 0;
      if (wave.TotalOnlineSampleSize) {
        costHosting = wave.TotalOnlineSampleSize * rateHosting; // decipherRate
      }
      if (wave.OpsResourcesData?.dataEntryNumberOfResponses) {
        costOtherHosting =
          wave.OpsResourcesData.dataEntryNumberOfResponses * rateHosting; // decipherRate
      }

      wave.CostExtOpsHosting = costHosting + costOtherHosting;
    }
  };

  const calcProgrammingCost = (waves) => {
    const rateCard =
      rateCards?.programming[profile.Project.CommissioningCountry];
    const unitCost = rateCard?.UnitCost || 0;

    // console.log("calc prog call");
    // console.log(waves);

    if (profile.IsTracker) {
      // Tracker calc
      let currentNumberOfQuestions;
      for (let i = 0; i < waves.length; i++) {
        if (!waves[i].OverrideSurveyProgrammingCost) {
          if (
            waves[i].OpsResourcesData &&
            waves[i].OpsResourcesData.surveyProgrammingRequired &&
            rateCard
          ) {
            if (
              waves[i].OpsResourcesData.surveyProgrammingNumberOfQuestions &&
              waves[i].OpsResourcesData.surveyProgrammingPercentageChangePerWave
            ) {
              if (!currentNumberOfQuestions) {
                // Initial wave
                currentNumberOfQuestions =
                  waves[i].OpsResourcesData.surveyProgrammingNumberOfQuestions;
                waves[i].SurveyProgrammingJobCount =
                  rateCard.JobCountNumberOfQuestions[
                    waves[i].OpsResourcesData.surveyProgrammingNumberOfQuestions
                  ];
              } else {
                // Subsequent waves
                if (
                  waves[i].OpsResourcesData
                    .surveyProgrammingNumberOfQuestions ===
                  currentNumberOfQuestions
                ) {
                  // If num of questions stays the same, get % of change to generate Job Count
                  // Percentage change per wave is fraction of initial wave job count
                  waves[i].SurveyProgrammingJobCount =
                    rateCard.JobCountChange[
                      waves[i].OpsResourcesData
                        .surveyProgrammingPercentageChangePerWave
                    ] *
                    rateCard.JobCountNumberOfQuestions[
                      waves[i].OpsResourcesData
                        .surveyProgrammingNumberOfQuestions
                    ];
                } else {
                  // If different, get new Number of Questions Job Count
                  waves[i].SurveyProgrammingJobCount =
                    rateCard.JobCountNumberOfQuestions[
                      waves[
                        i
                      ].OpsResourcesData.surveyProgrammingNumberOfQuestions
                    ];
                  currentNumberOfQuestions =
                    waves[i].OpsResourcesData
                      .surveyProgrammingNumberOfQuestions;
                }
              }

              // Calc cost per wave
              if (
                waves[i].OpsResourcesData.surveyProgrammingResource ===
                "External"
              ) {
                waves[i].CostExtOpsSurveyProgramming =
                  waves[i].SurveyProgrammingJobCount * unitCost;
                waves[i].CostIntOpsSurveyProgramming = null;
              } else if (
                waves[i].OpsResourcesData.surveyProgrammingResource ===
                "Internal"
              ) {
                waves[i].CostExtOpsSurveyProgramming = null;
                waves[i].CostIntOpsSurveyProgramming =
                  waves[i].SurveyProgrammingJobCount * unitCost;
              }
            }
          } else {
            waves[i].CostExtOpsSurveyProgramming = null;
            waves[i].CostIntOpsSurveyProgramming = null;
          }
        }
      }
    } else {
      // Adhoc calc
      if (!waves[0].OverrideSurveyProgrammingCost) {
        if (
          waves[0].OpsResourcesData &&
          waves[0].OpsResourcesData.surveyProgrammingRequired &&
          rateCard
        ) {
          if (waves[0].OpsResourcesData.surveyProgrammingNumberOfQuestions) {
            waves[0].SurveyProgrammingJobCount =
              rateCard.JobCountNumberOfQuestions[
                waves[0].OpsResourcesData.surveyProgrammingNumberOfQuestions
              ];
            if (
              waves[0].OpsResourcesData.surveyProgrammingResource === "External"
            ) {
              waves[0].CostExtOpsSurveyProgramming =
                waves[0].SurveyProgrammingJobCount * unitCost;
              waves[0].CostIntOpsSurveyProgramming = null;
            } else if (
              waves[0].OpsResourcesData.surveyProgrammingResource === "Internal"
            ) {
              waves[0].CostExtOpsSurveyProgramming = null;
              waves[0].CostIntOpsSurveyProgramming =
                waves[0].SurveyProgrammingJobCount * unitCost;
            }
          }
        } else {
          waves[0].CostExtOpsSurveyProgramming = null;
          waves[0].CostIntOpsSurveyProgramming = null;
        }
      }
    }
  };

  const getChartingRateCard = (countryCode, complexity) => {
    const country = rateCards["charting"][countryCode];
    if (country) {
      for (let i = 0; i < country.length; i++) {
        if (complexity === country[i]["Complexity"]) {
          if (countryCode === "AE") {
            return { CostPerSlide: 10 };
          }
          return country[i];
        }
      }
    } else {
      // console.log("No Charting Rate Found for ", countryCode, complexity);
      return { CostPerSlide: 0 };
    }
  };

  function calcOpsPMCost(wave) {
    console.log("calc PM cost");
    if (!wave.OverrideOpsPMCost) {
      let totalHours = profile.CountrySpecs[0].MethodologySpecs.reduce(
        (total, methodology) => {
          return total + methodology.OpsPMHours;
        },
        0
      );
      console.log(totalHours);
      let rate = profile.ProfileSetting?.RateOpsPM;
      console.log(rate);
      wave.TotalIntOpsPMHours = totalHours;
      wave.CostIntOpsPM = totalHours * rate;
    }
  }

  const calcChartingCost = (wave) => {
    if (!wave.OverrideChartingCost) {
      if (wave.OpsResourcesData.chartingRequired) {
        if (
          wave.OpsResourcesData.chartingComplexity &&
          wave.OpsResourcesData.chartingNumber
        ) {
          let rateCard = getChartingRateCard(
            currentProject.CommissioningCountry,
            wave.OpsResourcesData.chartingComplexity
          );
          // console.log("COST PER SLIDE", rateCard["CostPerSlide"]);
          // console.log(rateCard);

          if (rateCard) {
            // Do not calc for Internal Charting for now
            if (wave.OpsResourcesData.chartingResource === "External") {
              wave.CostExtOpsCharting =
                wave.OpsResourcesData.chartingNumber * rateCard["CostPerSlide"];
              wave.CostIntOpsCharting = null;
            } else {
              // Clear cost if not External
              wave.CostExtOpsCharting = null;
              wave.CostIntOpsCharting = null;
            }
          }
        }
      } else {
        // Clear cost and relevant keys if conditions not met
        wave.CostExtOpsCharting = null;
        wave.CostIntOpsCharting = null;
        delete wave.OpsResourcesData.chartingComplexity;
        delete wave.OpsResourcesData.chartingNumber;
        delete wave.OpsResourcesData.chartingVendorName;
        delete wave.OpsResourcesData.chartingResource;
      }
    }
  };

  const getDPRateCard = (countryCode, complexity, isTracker) => {
    let country = rateCards["dataProcessing"][countryCode];
    if (country) {
      for (let i = 0; i < country.length; i++) {
        if (
          isTracker === country[i]["Tracker"] &&
          complexity === country[i]["Complexity"]
        ) {
          return country[i];
        }
      }
    } else {
      // console.log(
      //   "No Data Processing Rate Found for ",
      //   countryCode,
      //   complexity,
      //   isTracker
      // );
      return { CostExternal: 0, HoursInternal: 0 };
    }
  };

  const calcDataProcessingCost = (wave) => {
    if (!wave.OverrideDataProcessingCost) {
      if (wave.OpsResourcesData.dataProcessingRequired) {
        if (wave.OpsResourcesData.dataProcessingComplexity) {
          let rateCard = getDPRateCard(
            currentProject.CommissioningCountry,
            wave.OpsResourcesData.dataProcessingComplexity,
            profile.IsTracker
          );
          if (rateCard) {
            // ratecard always return obj? else if returns undefined implementation needs to delete data
            if (wave.OpsResourcesData.dataProcessingResource === "External") {
              wave.CostIntOpsDataProcessing = null;
              wave.CostExtOpsDataProcessing = rateCard["CostExternal"];
            } else if (
              wave.OpsResourcesData.dataProcessingResource === "Internal"
            ) {
              wave.CostIntOpsDataProcessing = rateCard["HoursInternal"]; // * PMRate
              wave.CostExtOpsDataProcessing = null;
            }
          }
        } else {
          wave.CostIntOpsDataProcessing = null;
          wave.CostExtOpsDataProcessing = null;
        }
      } else {
        wave.CostIntOpsDataProcessing = null;
        wave.CostExtOpsDataProcessing = null;
        delete wave.OpsResourcesData.dataProcessingComplexity;
      }
    }
  };

  const calcDataScienceCost = (wave) => {
    let pmRate = profile.ProfileSetting.RateOpsPM;
    if (!wave.OverrideDataScienceCost) {
      if (wave.OpsResourcesData.dataScienceRequired) {
        if (
          wave.OpsResourcesData.dataScienceResource ===
            "Internal - Operations" &&
          wave.OpsResourcesData.dataScienceHours
        ) {
          wave.CostIntOpsDataScience =
            wave.OpsResourcesData.dataScienceHours * pmRate;
        }
      } else {
        wave.CostIntOpsDataScience = null;
        delete wave.OpsResourcesData.dataScienceHours;
        delete wave.OpsResourcesData.dataScienceResource;
      }
    }
  };

  const calcCodingCost = (wave) => {
    let internalRatesFullOE = profile.ProfileSetting?.RateCodingFull;
    let internalRatesOtherSpec = profile.ProfileSetting?.RateCodingSemi;

    let externalRatesFullOE = profile.ProfileSetting?.RateCodingFull;
    let externalRatesOtherSpec = profile.ProfileSetting?.RateCodingSemi; //using same for int ext

    if (!wave.OverrideCodingCost) {
      if (wave.OpsResourcesData.verbatimCoding) {
        if (
          wave.OpsResourcesData.verbatimCodingResource &&
          wave.TotalOnlineSampleSize
        ) {
          let fullOE = wave.OpsResourcesData.verbatimCodingFullOpenEnded || 0;
          let semiOE = wave.OpsResourcesData.verbatimCodingOtherSpecify || 0;
          if (wave.OpsResourcesData.verbatimCodingResource === "External") {
            wave.CostIntOpsVerbatimCoding = null;
            wave.CostExtOpsVerbatimCoding =
              wave.TotalOnlineSampleSize *
              (externalRatesFullOE * fullOE + externalRatesOtherSpec * semiOE);
          } else if (
            wave.OpsResourcesData.verbatimCodingResource === "Internal"
          ) {
            wave.CostExtOpsVerbatimCoding = null;
            wave.CostIntOpsVerbatimCoding =
              wave.TotalOnlineSampleSize *
              (internalRatesFullOE * fullOE + internalRatesOtherSpec * semiOE);
          }
        } else {
          wave.CostExtOpsVerbatimCoding = null;
          wave.CostIntOpsVerbatimCoding = null;
        }
      } else {
        // delete fields
        wave.CostExtOpsVerbatimCoding = null;
        wave.CostIntOpsVerbatimCoding = null;
        delete wave.OpsResourcesData.verbatimCodingFullOpenEnded;
        delete wave.OpsResourcesData.verbatimCodingOtherSpecify;
        delete wave.OpsResourcesData.verbatimCodingResource;
      }
    }
  };

  const calcTextAnalyticsCost = (wave) => {
    // console.log(wave.OverrideTextAnalyticsCost);
    let rateTextAnalytics = profile.ProfileSetting?.RateTextAnalytics;
    if (!wave.OverrideTextAnalyticsCost) {
      // console.log("calc text analytics", wave.OpsResourcesData.textAnalytics);
      if (wave.OpsResourcesData.textAnalytics) {
        wave.CostExtOpsTextAnalytics = rateTextAnalytics;
      } else {
        wave.CostExtOpsTextAnalytics = null;
      }
    }
  };

  const getMaxDELoiBand = () => {
    console.log("max de loi band");
    let a = -1;
    let b;
    // let fields = ["OfflineQuestionnaireLength"];
    let fields = ["lengthOfInterview"];
    countrySpecs.map((item) => {
      console.log(item);
      let spec = item.MethodologySpecs.filter((meth) => {
        return meth.Code === "SM000001" || meth.Code === "SM000022";
      })[0];
      console.log(spec);

      for (let i = 0; i < fields.length; i++) {
        let loi = null;
        if (spec.RFQData) {
          loi = spec.RFQData[fields[i]] ?? null;
        }
        console.log("loi", loi);
        let band = getBounds(loi);
        console.log("band", band);
        if (band !== null) {
          if (band.l > a) {
            a = band.l;
            b = loi;
          }
        }
      }
    });

    return b;
  };

  /**
   * Return maximum cost per hour based on PM rate cards for commissioning country, length of interview and questionaire complexity
   * @commissioningCountry required       commissioning country of the project
   * @loiBand {string} required           length of inteview band
   * @qnreComplexity {string} required    questionaire complexity
   * @return {number}                     cost per hour, otherwise null if no matching rates for the inputs
   */
  function getDataEntryCostPerMinute(
    commissioningCountry,
    loiBand,
    qnreComplexity,
    locale
  ) {
    // console.log(loiBand);
    // console.log(qnreComplexity);
    // console.log(commissioningCountry);
    if (typeof locale === "undefined") {
      locale = "offshore";
    }
    let loi = getBounds(loiBand.toString());
    if (loi !== null && qnreComplexity !== null) {
      if (rateCards.dataEntry.hasOwnProperty(commissioningCountry)) {
        let minutes = rateCards.dataEntry[commissioningCountry];
        if (minutes.hasOwnProperty(locale) !== -1) {
          let rates = minutes[locale];
          let matches = rates.filter(function (x) {
            let keep = true;
            if (x.loiU.length === 0) {
              x.loiU = 999;
            }
            if (loi.u === null) {
              if (!(loi.l <= x.loiL || (loi.l >= x.loiL && loi.l <= x.loiU))) {
                keep = false;
              }
            } else if (
              !(
                (loi.l >= x.loiL && loi.l <= x.loiU) ||
                (loi.u >= x.loiL && loi.u <= x.loiU)
              )
            ) {
              keep = false;
            }
            if (qnreComplexity !== x.qnreComplexity) {
              keep = false;
            }
            if (keep) {
              // console.log(x);
            }
            return keep;
          });
          if (matches.length) {
            let maxRateCard = matches.reduce(function (prev, current) {
              return prev.minutes > current.minutes ? prev : current;
            });
            return maxRateCard;
          }
        }
      }
    }
    return null;
  }

  const calcDataEntryCost = (wave) => {
    let rateDataEntry = profile.ProfileSetting.RateOpsDataPrep;

    if (!wave.OverrideDataEntryCost) {
      if (wave.OpsResourcesData?.dataEntryRequired) {
        let loi = getMaxDELoiBand();
        if (
          loi &&
          wave.OpsResourcesData?.dataEntryResource &&
          wave.OpsResourcesData?.dataEntryNumberOfResponses
        ) {
          console.log("do calc prerequisites met");

          let minutes = getDataEntryCostPerMinute(
            currentProject.CommissioningCountry,
            loi,
            "1",
            "offshore" // TODO: change to "internal" or "external" in ratecard and get value from dataEntryResource
          );
          let totalMinutes =
            wave.OpsResourcesData.dataEntryNumberOfResponses * minutes.minutes;
          totalMinutes = totalMinutes * 1.1; // 10% validation times
          let hours = totalMinutes / 60;
          hours = hours + 4; // 4 hours admin time

          if (wave.OpsResourcesData.dataEntryResource === "External") {
            wave.CostExtOpsDataEntry = hours * rateDataEntry;
            wave.CostIntOpsDataEntry = null;
          } else if (wave.OpsResourcesData.dataEntryResource === "Internal") {
            wave.CostExtOpsDataEntry = null;
            wave.CostIntOpsDataEntry = hours * rateDataEntry;
          } else {
            // unhandled case of not External or Internal
            wave.CostIntOpsDataEntry = null;
            wave.CostExtOpsDataEntry = null;
          }
        } else {
          wave.CostIntOpsDataEntry = null;
          wave.CostExtOpsDataEntry = null;
        }
      } else {
        console.log("delete and wipe");
        // delete and wipe cost
        wave.CostIntOpsDataEntry = null;
        wave.CostExtOpsDataEntry = null;
        delete wave.OpsResourcesData.dataEntryNumberOfResponses;
        delete wave.OpsResourcesData.dataEntryResource;
      }
    }
  };

  const calcOtherDataPrepCost = (wave) => {
    let rateDataEntry = profile.ProfileSetting.RateOpsDataPrep;
    if (!wave.OverrideOtherDataPreparationCost) {
      if (wave.OpsResourcesData.otherDataPreparationAssistance) {
        wave.CostIntOpsOtherDataPreparation =
          wave.OpsResourcesData.otherDataPreparationAssistanceHours *
          rateDataEntry;
      } else {
        wave.CostIntOpsOtherDataPreparation = null;
        delete wave.OpsResourcesData.otherDataPreparationAssistanceHours;
      }
    }
  };

  const calcAdditionalOpsCost = (wave) => {
    let rateOpsPM = profile.ProfileSetting.RateOpsPM;
    if (!wave.OverrideAdditionalOperationsSupportCost) {
      if (wave.OpsResourcesData.additionalOperationsSupport) {
        wave.CostIntOpsAdditionalOperationsSupport =
          wave.OpsResourcesData.additionalOperationsSupportHours * rateOpsPM;
      } else {
        wave.CostIntOpsAdditionalOperationsSupport = null;
        delete wave.OpsResourcesData.additionalOperationsSupportHours;
      }
    }
  };

  const calcCommercialTimeCost = (wave) => {
    const commercialFields = {
      "Associate Director": "CostIntCommAssociateDirector",
      "Data Science": "CostIntCommDataScience",
      Director: "CostIntCommDirector",
      "Executive Director": "CostIntCommExecDirector",
      Executive: "CostIntCommExecutive",
      Manager: "CostIntCommManager",
      "Senior Executive": "CostIntCommSeniorExecutive",
      "Senior Manager": "CostIntCommSeniorManager",
    };

    const rateCardReferences = {
      "Executive Director": "ExecutiveDirector",
      Director: "Director",
      "Associate Director": "AssociateDirector",
      "Senior Manager": "SeniorManager",
      Manager: "Manager",
      "Senior Executive": "SeniorExecutive",
      Executive: "Executive",
      "Data Science": "DatascienceInternalComm",
    };
    let csRateCard = profile.ProfileSetting.CSRateCardUsed || {};
    let csData = wave.CommercialHoursData || {};
    // for each band
    // total hours * ratecard[band]
    console.log("wave number", wave.WaveNumber);
    Object.keys(commercialFields).forEach((key) => {
      if (csRateCard[rateCardReferences[key]] && csData[key]?.Total) {
        wave[commercialFields[key]] =
          csRateCard[rateCardReferences[key]] * csData[key]?.Total;
        console.log(
          commercialFields[key],
          "wave cost is",
          wave[commercialFields[key]]
        );
      } else {
        console.log("wave has no commercial field");
        console.log(csRateCard[rateCardReferences[key]], csData[key]?.Total);
        wave[commercialFields[key]] = 0;
      }
    });
  };

  ////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  // Calc functions called here
  const setting = profile.ProfileSetting;

  calcOnlineExternalSampleCost(countrySpecs, waveSpecs);
  if (setting.CalcCostProgramming) calcProgrammingCost(waveSpecs);
  for (let i = 0; i < waveSpecs.length; i++) {
    totalOnlineSampleSize(countrySpecs, waveSpecs[i]);
    if (setting.CalcCostHosting) calcHostingCost(waveSpecs[i]);
    ///////////////////////////////////
    // Ops Resources calc
    if (waveSpecs[i].OpsResourcesData) {
      if (setting.CalcCostCharting) calcChartingCost(waveSpecs[i]);
      if (setting.CalcCostDataProcessing) calcDataProcessingCost(waveSpecs[i]);
      if (setting.CalcCostDataScience) calcDataScienceCost(waveSpecs[i]);
      if (setting.CalcCostCoding) calcCodingCost(waveSpecs[i]);
      if (setting.CalcCostTextAnalytics) calcTextAnalyticsCost(waveSpecs[i]);
      if (setting.CalcCostOtherDataPrep) calcOtherDataPrepCost(waveSpecs[i]);
      if (setting.CalcCostAdditionalOps) calcAdditionalOpsCost(waveSpecs[i]);
      if (setting.CalcCostDataEntry) calcDataEntryCost(waveSpecs[i]);
      if (setting.CalcCostCommercialTime) calcCommercialTimeCost(waveSpecs[i]);
      if (setting.CalcCostOpsPM) calcOpsPMCost(waveSpecs[i]); //hours from methodology spec * PMRate from profileSetting
    } else {
      // console.log("ops resources data is", waveSpecs[0].OpsResourcesData);
    }
  }

  return waveSpecs;
};

export const sumTotalCostsRawAndGenerateMinRecPrice = (profile) => {
  console.log("SUMMING TOTAL COSTS");
  console.log(profile);

  ///// External Ops Breakdown /////

  // CostExtOpsInterviewers = CostExtOpsInterviewers
  profile.CostExtOpsDCQCDPSP =
    profile.CostExtOpsDCQCDPSP +
    profile.CostExtOpsSurveyProgramming +
    profile.CostExtOpsDataProcessing +
    profile.CostExtOpsCharting +
    profile.CostExtOpsVerbatimCoding +
    profile.CostExtOpsHosting +
    profile.CostExtOpsDataEntry +
    profile.CostExtOpsTextAnalytics;
  // CostExtOpsTE = CostExtOpsTE
  // CostExtOpsOthers = CostExtOpsOthers
  console.log("////////////////////////////");
  console.log(profile.CostExtOpsIncentives, profile.CostExtOpsOnlineSample);
  profile.CostExtOpsIncentives =
    profile.CostExtOpsIncentives + profile.CostExtOpsOnlineSample; // NaN
  // CostExtOpsConsultantVendor = CostExtOpsConsultantVendor
  // CostExtOpsPrintingStationery=CostExtOpsPrintingStationery
  // CostExtOpsFreightShipping = CostExtOpsFreightShipping
  // CostExtOpsVenueHireRecruitment = CostExtOpsVenueHireRecruitment
  // CostExtOpsMCPSubContract = CostExtOpsMCPSubContract
  // CostExtOpsOtherTaxVAT= CostExtOpsOtherTaxVAT

  // Total
  profile.CostTotalExternalOperations =
    profile.CostExtOpsInterviewers +
    profile.CostExtOpsDCQCDPSP +
    profile.CostExtOpsTE +
    profile.CostExtOpsOthers +
    profile.CostExtOpsIncentives +
    profile.CostExtOpsConsultantVendor +
    profile.CostExtOpsPrintingStationery +
    profile.CostExtOpsFreightShipping +
    profile.CostExtOpsVenueHireRecruitment +
    profile.CostExtOpsMCPSubContract +
    profile.CostExtOpsOtherTaxVAT;

  ///// Internal Ops Breakdown //////

  profile.CostIntOpsFieldPMQC =
    profile.CostIntOpsFieldPMQC + profile.CostIntOpsPM;

  profile.CostIntOpsOthers =
    profile.CostIntOpsOthers + profile.CostIntOpsAdditionalOperationsSupport;

  profile.CostIntOpsProgramming =
    profile.CostIntOpsProgramming + profile.CostIntOpsSurveyProgramming;

  profile.CostIntOpsDPCodingAnalysis =
    profile.CostIntOpsDPCodingAnalysis +
    profile.CostIntOpsVerbatimCoding +
    profile.CostIntOpsOtherDataPreparation +
    profile.CostIntOpsDataProcessing +
    profile.CostIntOpsCharting +
    profile.CostIntOpsDataScience +
    profile.CostIntOpsDataEntry;

  // Total
  profile.CostTotalInternalOperations =
    profile.CostIntOpsFieldPMQC +
    profile.CostIntOpsOthers +
    profile.CostIntOpsProgramming +
    profile.CostIntOpsDPCodingAnalysis;

  ///// External Comm Breakdown //////

  // CostExtCommTE = CostExtCommTE
  // CostExtCommOthers = CostExtCommOthers
  // CostExtCommConsultant = CostExtCommConsultant

  // Total
  profile.CostTotalExternalCommercial =
    profile.CostExtCommTE +
    profile.CostExtCommConsultant +
    profile.CostExtCommOthers;

  // Internal Comm Breakdown
  // Total
  profile.CostTotalInternalCommercial =
    profile.CostIntCommAssociateDirector +
    profile.CostIntCommDataScience +
    profile.CostIntCommDirector +
    profile.CostIntCommExecDirector +
    profile.CostIntCommExecutive +
    profile.CostIntCommManager +
    profile.CostIntCommSeniorExecutive +
    profile.CostIntCommSeniorManager;

  if (profile.ProfileSetting?.UsesOopOverrideIntCommCost) {
    profile.CostTotalInternalCommercial =
      profile.CostTotalExternalOperations *
      profile.ProfileSetting.CostIntCommMultiplier;
  }
  if (profile.ProfileSetting?.UsesOopOverrideIntOpsCost) {
    profile.CostTotalInternalOperations =
      profile.CostTotalExternalOperations *
      profile.ProfileSetting.CostIntOpsMultiplier;
  }

  let total =
    profile.CostTotalExternalCommercial +
    profile.CostTotalExternalOperations +
    profile.CostTotalInternalCommercial +
    profile.CostTotalInternalOperations;

  profile.TotalCostsRaw = total;
  profile.Overheads = total * profile.ProfileSetting?.PercentOverhead;
  profile.TotalCostIncOverhead = total + profile.Overheads;

  profile.Markup =
    profile.TotalCostIncOverhead /
      (1 - profile.ProfileSetting?.TargetPercentContributionMargin) -
    profile.TotalCostIncOverhead;
  profile.RecommendedPrice = profile.TotalCostIncOverhead + profile.Markup;
  profile.TotalThirdPartyCost = profile.CostTotalExternalOperations;

  profile.TotalExternalCosts =
    profile.CostTotalExternalCommercial + profile.CostTotalExternalOperations;
  profile.TotalInternalCosts =
    profile.CostTotalInternalCommercial + profile.CostTotalInternalOperations;

  // Override to use OOP % as mark up different calculations
  if (profile.ProfileSetting?.UsesOOPMarkUp) {
    profile.RecommendedPrice =
      profile.CostTotalExternalOperations /
      profile.ProfileSetting.TargetPercentOOPMarkUp;
    profile.Markup = profile.RecommendedPrice - total;
    if (profile.Markup < 0) {
      // if UAE profitability calculates negative markup, don't markup
      profile.Markup = 0;
    }
  }

  return profile;
};

export const approvalValidation = (profile) => {
  // console.log("IN APPROVAL VALIDATION");
  // console.log(profile);

  //////////////////////////////
  // console.log("approvalValidation called");
  let netRevenue = profile.NetRevenuePercent;
  let oop = profile.OutOfPocketCostPercent;
  let priceToClient = profile.PriceToClient;
  let contributionMargin = profile.ContributionMarginPercent;
  let internalCommCostPercent = profile.InternalCommercialCostPercent;

  // console.log("approvalValidation called");
  // console.log(profile);
  // console.log(OOPPercent);
  // console.log(priceToClient);

  let obj = {
    approvalLevelRequired: -1,
    CMFlag: false,
    NetRevFlag: false,
    IntCommFlag: false,
    PriceFlag: false,
    needsAppr: false,
    OOPFlag: false,
    ApprovalAlwaysFlag: false,
  };

  if (profile !== null) {
    // if market wants pacific costing flag === true
    // (if CM < 25% || Internal CS cost / priceToClient < 0.3 || netRevenue < 70% || priceToClient < 10k) -> trigger L0 approval
    if (profile.ProfileSetting?.NeedsApprovalAlways) {
      obj.approvalLevelRequired = 0;
      obj.needsAppr = true;
      obj.ApprovalAlwaysFlag = true;
    }
    if (
      profile.ProfileSetting &&
      profile.ProfileSetting.NeedsContributionMarginCheck &&
      contributionMargin <
        profile.ProfileSetting.TargetPercentContributionMargin
    ) {
      obj.CMFlag = true;
      obj.needsAppr = true;
      obj.approvalLevelRequired = 0;
    }
    if (
      profile.ProfileSetting &&
      profile.ProfileSetting.NeedsCommercialCostCheck &&
      internalCommCostPercent <
        profile.ProfileSetting.ThresholdPercentIntCommCost
    ) {
      obj.IntCommFlag = true;
      obj.needsAppr = true;
      obj.approvalLevelRequired = 0;
    }
    if (
      profile.ProfileSetting &&
      profile.ProfileSetting.NeedsNetRevenueCheck &&
      netRevenue < profile.ProfileSetting.ThresholdPercentNetRevenue
    ) {
      obj.NetRevFlag = true;
      obj.needsAppr = true;
      obj.approvalLevelRequired = 0;
    }
    if (
      profile.ProfileSetting &&
      profile.ProfileSetting.NeedsMinimumProjectValueCheck &&
      priceToClient < profile.ProfileSetting.ThresholdPriceToClient
    ) {
      obj.PriceFlag = true;
      obj.needsAppr = true;
      obj.approvalLevelRequired = 0;
    }

    // let metApprovalConditions = [];
    // console.log("begin loop");
    for (let i = 0; i < profile.ApprovalDetails.length; i++) {
      // console.log(
      //   "oop",
      //   oop,
      //   profile.ApprovalDetails[i].ThresholdOutOfPocketPercentage
      // );
      // console.log(
      //   "price to client",
      //   priceToClient,
      //   profile.ApprovalDetails[i].ThresholdRevenueAmount
      // );
      if (
        oop >= profile.ApprovalDetails[i].ThresholdOutOfPocketPercentage &&
        priceToClient >= profile.ApprovalDetails[i].ThresholdRevenueAmount
      ) {
        obj.OOPFlag = true;
        obj.needsAppr = true;
        obj.approvalLevelRequired = profile.ApprovalDetails[i].Order;
      } else {
        break;
      }
    }

    // console.log("before loop");
    // console.log(profile.ApprovalDetails);
    // for (let i = 0; i < profile.ApprovalDetails.length; i++) {
    //   // console.log(obj);
    //   // console.log(profile.ApprovalDetails[i].Order, obj.approvalLevelRequired);
    //   if (profile.ApprovalDetails[i].Order <= obj.approvalLevelRequired) {
    //     // console.log("PUSH");
    //     metApprovalConditions.push(profile.ApprovalDetails[i]);
    //   }
    // }
    // profile.ApprovalDetails = metApprovalConditions;
    // console.log(profile.ApprovalDetails);

    return obj;
  }
  // console.log("project country table does not have item");
};

export const calcProfitability = (profile) => {
  // console.log("calcProfitability called");
  // profile.PriceToClient = priceToClient;
  profile.OutOfPocketCostPercent =
    profile.CostTotalExternalOperations / profile.PriceToClient; //+ profile.CostTotalExternalCommercial Removed Ext Comm as per global update 22/11/19
  profile.ContributionMarginPercent =
    (profile.PriceToClient -
      (!isNaN(profile.TotalCostIncOverhead)
        ? parseFloat(profile.TotalCostIncOverhead)
        : 0)) /
    profile.PriceToClient;
  profile.NetRevenuePercent =
    (profile.PriceToClient -
      (profile.CostTotalExternalOperations +
        profile.CostTotalExternalCommercial)) /
    profile.PriceToClient;
  profile.InternalCommercialCostPercent =
    profile.CostTotalInternalCommercial / profile.PriceToClient;

  let appr = approvalValidation(profile);

  // console.log("APPROVAL OBJECT", appr);

  // Stores ApprovalLevelNeeded
  profile.ApprovalLevelNeeded = appr.approvalLevelRequired;
  profile.ApprovalLevelAwaiting = 0;
  profile.CheckPassedNetRevenue = !appr.NetRevFlag;
  profile.CheckPassedCommercialCost = !appr.IntCommFlag;
  profile.CheckPassedMinimumProjectValue = !appr.PriceFlag;
  profile.CheckPassedContributionMargin = !appr.CMFlag;
  profile.CheckPassedOutOfPocket = !appr.OOPFlag;

  profile.ApprovalLevelReached = -1;

  if (profile.ApprovalLevelNeeded > -1) {
    // console.log("APPROVAL IS NEEDED");
    profile.NeedsApproval = true;
    profile.ProfileStatus = "2";

    //// Approval process is initialised here ////
    // initialiseApprovals();
  } else if (profile.ApprovalLevelNeeded === -1) {
    // console.log("APPROVAL IS NOT NEEDED");

    profile.NeedsApproval = false;
    profile.ProfileStatus = "5";
  } else {
    // console.log("no appropriate appr level");
    // console.log(appr.approvalLevelRequired);
  }
  return { ...profile };
};

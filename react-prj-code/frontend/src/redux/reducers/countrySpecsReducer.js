import * as countrySpecsActions from "../actions/countrySpecsActions";

const initialState = [];
//   countrySpecs: [
//     {
//       Id: 0,
//       ProfileId: 1579,
//       Country: "SG",
//       OnlineLengthOfInterview: null,
//       OnlineIncidenceRate: null,
//       OnlineCostPerInterview: 0,
//       OnlineExternalSampleCost: 0,
//       OnlineSampleSizeTotal: 0,
//       OnlineNotApplicable: 0,
//       CreatedDate: null,
//       CostingOwner: null,
//       OnlineSampleSizeExternal: 0,
//       OnlineSampleSizeInternal: 10,
//       OnlineSampleSizeClientSupplied: 0,
//       OnlineSampleSizeOther: 0,
//       OnlineSampleSource: "INT",
//       Offline: 0,
//       TotalExternalOpsSampleCost: null,
//       TotalExternalOpsOtherCost: null,
//       TotalInternalOperationsDatascienceCost: null,
//       TotalExternalOperationsDatascienceCost: null,
//       TotalCommercialDatascienceCost: null,
//       TotalOperationsProjectManagementCost: null,
//       TotalCATIQCCost: null,
//       TotalCATICost: null,
//       TotalPrintingCost: null,
//       TotalPostageCost: null,
//       TotalShippingCost: null,
//       TotalIncentivesCost: null,
//       TotalTranslationCost: null,
//       TotalExternalReportingCost: null,
//       TotalDesignCost: null,
//       TotalOtherExternalCost: null,
//       TotalCateringCost: null,
//       TotalHostessingCost: null,
//       TotalTravelAccomodationCost: null,
//       TotalTranscribingCost: null,
//       TotalDigitalQualCost: null,
//       TotalVenueCost: null,
//       TotalInterviewersCost: null,
//       TotalSubContractingCost: null,
//       TotalConsultantCost: null,
//       CATIProjectBackground: null,
//       CATIBusinessOrResidential: null,
//       CATISampleSource: null,
//       CATILocation: null,
//       CATITargetCriteria: null,
//       CATIIncidenceRate: null,
//       CATIQuotaBreakdown: null,
//       CATIIncentive: null,
//       CATIFieldStartDate: null,
//       CATIFieldEndDate: null,
//       CATILengthOfTimeInField: null,
//       CATIFinalDataDeliveryDate: null,
//       CATIQuestionnaireAvailable: null,
//       CATIQuestionnaireComplexity: null,
//       CATITimeStampsRequired: 0,
//       CATIDataOutput: null,
//       CATIFrequencyOfFieldwork: null,
//       CATIAdditionalInformation: null,
//       QualProjectBackground: null,
//       QualRecruitmentStartDate: null,
//       QualFieldStartDate: null,
//       QualMethodology: null,
//       QualLengthOfInterview: null,
//       QualSampleSource: null,
//       QualParticipantsPerGroup: null,
//       QualLocation: null,
//       QualHomework: null,
//       QualTargetCriteria: null,
//       QualQuota: null,
//       QualIncidenceRate: null,
//       QualIncentive: null,
//       QualExtraIncentive: null,
//       QualTranscriptionRequired: 0,
//       QualRefreshments: 0,
//       QualHostessing: 0,
//       QualOther: null,
//       QualOtherComments: null,
//       CATINotApplicable: 0,
//       QualNotApplicable: 0,
//       QualGroups: null,
//       QualInDepthInterviews: null,
//       CATITotalCompletedInterviews: null,
//       CATIQuestionnaireLength: null,
//       CATIOpenEnds: null,
//       OfflineProjectBackground: null,
//       OfflineTargetRespondents: null,
//       OfflineSampleSource: null,
//       OfflineLocationCity: null,
//       OfflineLocationVenue: null,
//       OfflineStorePermissions: null,
//       OfflineTargetCriteria: null,
//       OfflineIncidenceRate: null,
//       OfflineSampleSizeTotal: null,
//       OfflineQuota: null,
//       OfflineQuestionnaireLength: null,
//       OfflineAdditionalInformation: null,
//       OfflineNotApplicable: 0,
//       OfflineFieldStartDate: null,
//       OfflineFieldEndDate: null,
//     },
//     {
//       Id: 1,
//       ProfileId: 1579,
//       Country: "NZ",
//       OnlineLengthOfInterview: null,
//       OnlineIncidenceRate: null,
//       OnlineCostPerInterview: 0,
//       OnlineExternalSampleCost: 0,
//       OnlineSampleSizeTotal: 0,
//       OnlineNotApplicable: 1,
//       CreatedDate: null,
//       CostingOwner: null,
//       OnlineSampleSizeExternal: 5,
//       OnlineSampleSizeInternal: 0,
//       OnlineSampleSizeClientSupplied: 0,
//       OnlineSampleSizeOther: 0,
//       OnlineSampleSource: "EXT",
//       Offline: 0,
//       TotalExternalOpsSampleCost: null,
//       TotalExternalOpsOtherCost: null,
//       TotalInternalOperationsDatascienceCost: null,
//       TotalExternalOperationsDatascienceCost: null,
//       TotalCommercialDatascienceCost: null,
//       TotalOperationsProjectManagementCost: null,
//       TotalCATIQCCost: null,
//       TotalCATICost: null,
//       TotalPrintingCost: null,
//       TotalPostageCost: null,
//       TotalShippingCost: null,
//       TotalIncentivesCost: null,
//       TotalTranslationCost: null,
//       TotalExternalReportingCost: null,
//       TotalDesignCost: null,
//       TotalOtherExternalCost: null,
//       TotalCateringCost: null,
//       TotalHostessingCost: null,
//       TotalTravelAccomodationCost: null,
//       TotalTranscribingCost: null,
//       TotalDigitalQualCost: null,
//       TotalVenueCost: null,
//       TotalInterviewersCost: null,
//       TotalSubContractingCost: null,
//       TotalConsultantCost: null,
//       CATIProjectBackground: null,
//       CATIBusinessOrResidential: null,
//       CATISampleSource: null,
//       CATILocation: null,
//       CATITargetCriteria: null,
//       CATIIncidenceRate: null,
//       CATIQuotaBreakdown: null,
//       CATIIncentive: null,
//       CATIFieldStartDate: null,
//       CATIFieldEndDate: null,
//       CATILengthOfTimeInField: null,
//       CATIFinalDataDeliveryDate: null,
//       CATIQuestionnaireAvailable: null,
//       CATIQuestionnaireComplexity: null,
//       CATITimeStampsRequired: 0,
//       CATIDataOutput: null,
//       CATIFrequencyOfFieldwork: null,
//       CATIAdditionalInformation: null,
//       QualProjectBackground: null,
//       QualRecruitmentStartDate: null,
//       QualFieldStartDate: null,
//       QualMethodology: null,
//       QualLengthOfInterview: null,
//       QualSampleSource: null,
//       QualParticipantsPerGroup: null,
//       QualLocation: null,
//       QualHomework: null,
//       QualTargetCriteria: null,
//       QualQuota: null,
//       QualIncidenceRate: null,
//       QualIncentive: null,
//       QualExtraIncentive: null,
//       QualTranscriptionRequired: 0,
//       QualRefreshments: 0,
//       QualHostessing: 0,
//       QualOther: null,
//       QualOtherComments: null,
//       CATINotApplicable: 0,
//       QualNotApplicable: 0,
//       QualGroups: null,
//       QualInDepthInterviews: null,
//       CATITotalCompletedInterviews: null,
//       CATIQuestionnaireLength: null,
//       CATIOpenEnds: null,
//       OfflineProjectBackground: null,
//       OfflineTargetRespondents: null,
//       OfflineSampleSource: null,
//       OfflineLocationCity: null,
//       OfflineLocationVenue: null,
//       OfflineStorePermissions: null,
//       OfflineTargetCriteria: null,
//       OfflineIncidenceRate: null,
//       OfflineSampleSizeTotal: null,
//       OfflineQuota: null,
//       OfflineQuestionnaireLength: null,
//       OfflineAdditionalInformation: null,
//       OfflineNotApplicable: 0,
//       OfflineFieldStartDate: null,
//       OfflineFieldEndDate: null,
//     },
//   ],

export default function countrySpecsReducer(state = initialState, actions) {
  switch (actions.type) {
    case countrySpecsActions.SET_COUNTRYSPECS:
      return [...actions.countrySpecs];
    case countrySpecsActions.CLEAR_COUNTRYSPECS:
      return initialState;
    default:
      return state;
  }
}

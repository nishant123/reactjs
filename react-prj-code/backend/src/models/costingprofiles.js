"use strict";
const { Model } = require("sequelize");
const dbHelpers = require("../utils/dbhelpers");
module.exports = (sequelize, DataTypes) => {
	class CostingProfiles extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			CostingProfiles.belongsTo(models.Projects);
			CostingProfiles.hasOne(models.ProfileSettings);
			CostingProfiles.hasMany(models.CountrySpecs);
			CostingProfiles.hasMany(models.WaveSpecs);
			CostingProfiles.hasMany(models.Requests);
		}
	}
	CostingProfiles.init(
		{
			ProfileName: DataTypes.TEXT,
			ProfileNumber: DataTypes.INTEGER,
			IsImportedProfile: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
			IsTracker: DataTypes.BOOLEAN,
			NumberOfWaves: DataTypes.INTEGER,
			CostingsSheetId: DataTypes.STRING,
			AdditionalSheetId: DataTypes.STRING,
			TrackingFrequency: {
				type: DataTypes.STRING,
				get() {
					const val = this.getDataValue("TrackingFrequency");
					return dbHelpers.NullToEmptyString(val);
				},
				set(val) {
					this.setDataValue(
						"TrackingFrequency",
						dbHelpers.EmptyStringToNull(val)
					);
				},
			},
			IsMultiCountry: DataTypes.BOOLEAN,
			FieldingCountries: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("FieldingCountries", dbHelpers.MultiToString(val));
				},
			},
			Methodology: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("Methodology", dbHelpers.MultiToString(val));
				},
			},
			SubMethodology: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("SubMethodology", dbHelpers.MultiToString(val));
				},
			},
			ResearchType: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("ResearchType", dbHelpers.EmptyStringToNull(val));
				},
			},
			FieldType: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("FieldType", dbHelpers.EmptyStringToNull(val));
				},
			},

			PriceToClient: DataTypes.DOUBLE,
			RecommendedPrice: DataTypes.DOUBLE,
			//NetRevenue: DataTypes.DOUBLE,
			//ContributionMargin: DataTypes.DOUBLE,
			TotalCostsRaw: DataTypes.DOUBLE,
			Overheads: DataTypes.DOUBLE,
			TotalCostIncOverhead: DataTypes.DOUBLE,
			Markup: DataTypes.DOUBLE,
			ProfileStatus: DataTypes.STRING,
			NeedsApproval: DataTypes.BOOLEAN,
			PriceToClientLocal: DataTypes.DOUBLE,
			CostInputCurrency: DataTypes.STRING,

			TotalInternalCosts: DataTypes.DOUBLE,
			TotalExternalCosts: DataTypes.DOUBLE,
			CommissionedBy: DataTypes.STRING,
			CommissionedDate: DataTypes.DATE,
			StudyType: {
				type: DataTypes.STRING,

				set(val) {
					this.setDataValue("StudyType", dbHelpers.MultiToString(val));
				},
			},
			CostingType: DataTypes.STRING,
			CostingNotes: DataTypes.TEXT("long"),

			CostTotalExternalOperations: DataTypes.DOUBLE,
			CostTotalInternalOperations: DataTypes.DOUBLE,
			CostTotalExternalCommercial: DataTypes.DOUBLE,
			CostTotalInternalCommercial: DataTypes.DOUBLE,

			CostExtOpsInterviewers: DataTypes.DOUBLE,
			CostExtOpsDCQCDPSP: DataTypes.DOUBLE,
			CostExtOpsTE: DataTypes.DOUBLE,
			CostExtOpsOthers: DataTypes.DOUBLE,
			CostExtOpsIncentives: DataTypes.DOUBLE,
			CostExtOpsConsultantVendor: DataTypes.DOUBLE,
			CostExtOpsPrintingStationery: DataTypes.DOUBLE,
			CostExtOpsFreightShipping: DataTypes.DOUBLE,
			CostExtOpsVenueHireRecruitment: DataTypes.DOUBLE,
			CostExtOpsMCPSubContract: DataTypes.DOUBLE,
			CostExtOpsOtherTaxVAT: DataTypes.DOUBLE,
			CostIntOpsFieldPMQC: DataTypes.DOUBLE,
			CostIntOpsOthers: DataTypes.DOUBLE,
			CostIntOpsProgramming: DataTypes.DOUBLE,
			CostIntOpsDPCodingAnalysis: DataTypes.DOUBLE,
			CostExtCommTE: DataTypes.DOUBLE,
			CostExtCommConsultant: DataTypes.DOUBLE,
			CostExtCommOthers: DataTypes.DOUBLE,
			CostIntCommExecDirector: DataTypes.DOUBLE,
			CostIntCommDirector: DataTypes.DOUBLE,
			CostIntCommAssociateDirector: DataTypes.DOUBLE,
			CostIntCommSeniorManager: DataTypes.DOUBLE,
			CostIntCommManager: DataTypes.DOUBLE,
			CostIntCommSeniorExecutive: DataTypes.DOUBLE,
			CostIntCommExecutive: DataTypes.DOUBLE,
			CostIntCommDataScience: DataTypes.DOUBLE,

			// SurveyProgrammingJobCount: DataTypes.DOUBLE,
			// CostIntSurveyProgramming: DataTypes.DOUBLE,
			// CostExtSurveyProgramming: DataTypes.DOUBLE,
			// CostExtCharting: DataTypes.DOUBLE,
			// CostIntCharting: DataTypes.DOUBLE,
			// CostIntDataProcessing: DataTypes.DOUBLE,
			// CostExtDataProcessing: DataTypes.DOUBLE,
			// CostExtVerbatimCoding: DataTypes.DOUBLE,
			// CostIntVerbatimCoding: DataTypes.DOUBLE,
			// CostExtTextAnalytics: DataTypes.DOUBLE,
			// CostIntAdditionalOperationsSupport: DataTypes.DOUBLE,
			// CostIntOtherDataPreparation: DataTypes.DOUBLE,

			CostExtOpsHosting: DataTypes.DOUBLE,
			CostIntOpsAdditionalOperationsSupport: DataTypes.DOUBLE,
			CostIntOpsOtherDataPreparation: DataTypes.DOUBLE,
			CostExtOpsDataEntry: DataTypes.DOUBLE,
			CostIntOpsDataEntry: DataTypes.DOUBLE,
			CostExtOpsVerbatimCoding: DataTypes.DOUBLE,
			CostIntOpsVerbatimCoding: DataTypes.DOUBLE,
			CostIntOpsDataScience: DataTypes.DOUBLE,
			CostExtOpsDataProcessing: DataTypes.DOUBLE,
			CostIntOpsDataProcessing: DataTypes.DOUBLE,
			CostExtOpsCharting: DataTypes.DOUBLE,
			CostIntOpsCharting: DataTypes.DOUBLE,
			CostIntOpsSurveyProgramming: DataTypes.DOUBLE,
			CostExtOpsSurveyProgramming: DataTypes.DOUBLE,
			CostExtOpsTextAnalytics: DataTypes.DOUBLE,
			CostIntOpsPM: DataTypes.DOUBLE,
			CostExtOpsOnlineSample: DataTypes.DOUBLE,

			TotalIntOpsPMHours: DataTypes.DOUBLE,
			TotalOnlineSampleSize: DataTypes.INTEGER,
			SurveyProgrammingJobCount: DataTypes.DOUBLE,

			InternalCommercialCostPercent: DataTypes.DOUBLE,
			OutOfPocketCostPercent: DataTypes.DOUBLE,
			NetRevenuePercent: DataTypes.DOUBLE,
			ContributionMarginPercent: DataTypes.DOUBLE,
			DecommissionNotes: DataTypes.TEXT,
			ApprovalRequestor: DataTypes.STRING,
			ApprovalJustification: DataTypes.TEXT,
			ApprovalNotes: DataTypes.TEXT,
			ApprovalLevelNeeded: DataTypes.INTEGER,
			ApprovalLevelAwaiting: DataTypes.INTEGER,
			ApprovalLevelReached: DataTypes.INTEGER,
			ApprovalVersionNumber: DataTypes.INTEGER,

			CheckPassedOutOfPocket: DataTypes.BOOLEAN,
			CheckPassedCommercialCost: DataTypes.BOOLEAN,
			CheckPassedNetRevenue: DataTypes.BOOLEAN,
			CheckPassedContributionMargin: DataTypes.BOOLEAN,
			CheckPassedMinimumProjectValue: DataTypes.BOOLEAN,

			ApprovalDetails: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("ApprovalDetails");
					return val ? JSON.parse(val) : val;
				},
			},
		},
		{
			sequelize,
			modelName: "CostingProfiles",
		}
	);

	CostingProfiles.addHook("beforeCreate", async (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
			instance.ProfileNumber = await dbHelpers.CreateProfileNumber(
				options.projectIdFk,
				CostingProfiles
			);
		} catch (ex) {
			throw ex;
		}
	});
	CostingProfiles.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	return CostingProfiles;
};

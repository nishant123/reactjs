"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ProfileSettings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ProfileSettings.belongsTo(models.CostingProfiles);
		}
	}
	ProfileSettings.init(
		{
			IsExternal: DataTypes.BOOLEAN,
			MinimumSFProbability: DataTypes.DOUBLE,
			NeedsGlobalCostingSheet: DataTypes.BOOLEAN,
			NeedsNoPriceToClient: DataTypes.BOOLEAN,
			NeedsMinimumProjectValueCheck: DataTypes.BOOLEAN,
			NeedsOutOfPocketCostCheck: DataTypes.BOOLEAN,
			NeedsContributionMarginCheck: DataTypes.BOOLEAN,
			NeedsCommercialCostCheck: DataTypes.BOOLEAN,
			NeedsNetRevenueCheck: DataTypes.BOOLEAN,
			NeedsApprovalAlways: DataTypes.BOOLEAN,
			NeedsSFStatusCheck: DataTypes.BOOLEAN,
			//NEW
			CSRateCardUsed: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CSRateCardUsed");
					return val ? JSON.parse(val) : val;
				},
			},
			GlobalCostingSheetCostsSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("GlobalCostingSheetCostsSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			GlobalCostingSheetTimingsSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("GlobalCostingSheetTimingsSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			CurrenciesData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CurrenciesData");
					return val ? JSON.parse(val) : val;
				},
			},

			CommercialHoursSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CommercialHoursSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			//New
			CalcCostOnlineExternalSample: DataTypes.BOOLEAN,
			CalcCostProgramming: DataTypes.BOOLEAN,
			CalcCostCharting: DataTypes.BOOLEAN,
			CalcCostCoding: DataTypes.BOOLEAN,
			CalcCostHosting: DataTypes.BOOLEAN,
			CalcCostDataProcessing: DataTypes.BOOLEAN,
			CalcCostDataScience: DataTypes.BOOLEAN,
			CalcCostTextAnalytics: DataTypes.BOOLEAN,
			CalcCostOtherDataPrep: DataTypes.BOOLEAN,
			CalcCostAdditionalOps: DataTypes.BOOLEAN,
			CalcCostDataEntry: DataTypes.BOOLEAN,
			CalcCostOpsPM: DataTypes.BOOLEAN,
			CalcCostCommercialTime: DataTypes.BOOLEAN,
			UsesOOPMarkUp: DataTypes.BOOLEAN,
			UsesOopOverrideIntCommCost: DataTypes.BOOLEAN,
			UsesOopOverrideIntOpsCost: DataTypes.BOOLEAN,
			CostIntOpsMultiplier: DataTypes.BOOLEAN,
			CostIntCommMultiplier: DataTypes.BOOLEAN,
			RateOpsPM: DataTypes.DOUBLE,
			RateOpsDataPrep: DataTypes.DOUBLE,
			PercentOverhead: DataTypes.DOUBLE,
			TargetPercentContributionMargin: DataTypes.DOUBLE,
			TargetPercentOOPMarkUp: DataTypes.DOUBLE,
			ThresholdPercentIntCommCost: DataTypes.DOUBLE,
			ThresholdPercentNetRevenue: DataTypes.DOUBLE,
			ThresholdPriceToClient: DataTypes.DOUBLE,
			RateHosting: DataTypes.DOUBLE,
			RateCodingFull: DataTypes.DOUBLE,
			RateCodingSemi: DataTypes.DOUBLE,
			RateTextAnalytics: DataTypes.DOUBLE,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ProfileSettings",
		}
	);
	ProfileSettings.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	ProfileSettings.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return ProfileSettings;
};

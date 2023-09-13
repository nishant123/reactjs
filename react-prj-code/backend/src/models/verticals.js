"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Verticals extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Verticals.belongsTo(models.BusinessUnits);
			Verticals.hasMany(models.ApprovalSettings);
		}
	}
	Verticals.init(
		{
			Label: DataTypes.STRING,
			Code: DataTypes.STRING,

			IsExternal: DataTypes.BOOLEAN,

			MinimumSFProbability: DataTypes.DOUBLE,

			//Folder IDs
			ProjectResourcesFolderId: DataTypes.STRING,
			CostingsFolderId: DataTypes.STRING,
			ArchiveFolderId: DataTypes.STRING,
			ProjectResourcesFolderTemplateId: DataTypes.STRING,
			ProjectBoxTemplateId: DataTypes.STRING,
			AdditionalSheetTemplateId: DataTypes.STRING,
			GlobalCostingSheetTemplateId: DataTypes.STRING,
			GlobalCostingSheetCostsSchema: DataTypes.TEXT("long"),
			GlobalCostingSheetTimingsSchema: DataTypes.TEXT("long"),
			CommercialHoursSchema: DataTypes.TEXT("long"),
			FolderOwnerEmail: DataTypes.STRING,

			//Flags
			NeedsGlobalCostingSheet: DataTypes.BOOLEAN,
			NeedsNoPriceToClient: DataTypes.BOOLEAN,
			NeedsMinimumProjectValueCheck: DataTypes.BOOLEAN,
			NeedsOutOfPocketCostCheck: DataTypes.BOOLEAN,
			NeedsContributionMarginCheck: DataTypes.BOOLEAN,
			NeedsCommercialCostCheck: DataTypes.BOOLEAN,
			NeedsNetRevenueCheck: DataTypes.BOOLEAN,
			NeedsApprovalAlways: DataTypes.BOOLEAN,

			NeedsSFStatusCheck: DataTypes.BOOLEAN,
			NeedsSFOpportunityNumber: DataTypes.BOOLEAN,
			OpsResourcesSchema: DataTypes.TEXT("long"),

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
			modelName: "Verticals",
		}
	);

	Verticals.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	Verticals.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return Verticals;
};

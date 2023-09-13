"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("ProfileSettings", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			CurrenciesData: { type: Sequelize.TEXT("long") },
			CSRateCardUsed: { type: Sequelize.TEXT("long") },
			GlobalCostingSheetCostsSchema: { type: Sequelize.TEXT("long") },
			GlobalCostingSheetTimingsSchema: { type: Sequelize.TEXT("long") },
			CommercialHoursSchema: { type: Sequelize.TEXT("long") },
			IsExternal: {
				type: Sequelize.BOOLEAN,
			},
			MinimumSFProbability: {
				type: Sequelize.DOUBLE,
			},
			NeedsGlobalCostingSheet: {
				type: Sequelize.BOOLEAN,
			},
			NeedsNoPriceToClient: {
				type: Sequelize.BOOLEAN,
			},
			NeedsMinimumProjectValueCheck: {
				type: Sequelize.BOOLEAN,
			},
			NeedsOutOfPocketCostCheck: {
				type: Sequelize.BOOLEAN,
			},
			NeedsContributionMarginCheck: {
				type: Sequelize.BOOLEAN,
			},
			NeedsCommercialCostCheck: {
				type: Sequelize.BOOLEAN,
			},
			NeedsNetRevenueCheck: {
				type: Sequelize.BOOLEAN,
			},
			NeedsApprovalAlways: {
				type: Sequelize.BOOLEAN,
			},
			NeedsSFStatusCheck: {
				type: Sequelize.BOOLEAN,
			},

			//New
			CalcCostOnlineExternalSample: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostProgramming: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostCharting: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostCoding: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostHosting: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostDataProcessing: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostDataScience: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostTextAnalytics: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostOtherDataPrep: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostAdditionalOps: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostDataEntry: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostOpsPM: {
				type: Sequelize.BOOLEAN,
			},
			CalcCostCommercialTime: {
				type: Sequelize.BOOLEAN,
			},
			UsesOOPMarkUp: {
				type: Sequelize.BOOLEAN,
			},
			UsesOopOverrideIntCommCost: {
				type: Sequelize.BOOLEAN,
			},
			UsesOopOverrideIntOpsCost: {
				type: Sequelize.BOOLEAN,
			},
			CostIntOpsMultiplier: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommMultiplier: {
				type: Sequelize.DOUBLE,
			},
			RateOpsPM: {
				type: Sequelize.DOUBLE,
			},
			RateOpsDataPrep: {
				type: Sequelize.DOUBLE,
			},
			PercentOverhead: {
				type: Sequelize.DOUBLE,
			},
			TargetPercentContributionMargin: {
				type: Sequelize.DOUBLE,
			},
			TargetPercentOOPMarkUp: {
				type: Sequelize.DOUBLE,
			},
			ThresholdPercentIntCommCost: {
				type: Sequelize.DOUBLE,
			},
			ThresholdPercentNetRevenue: {
				type: Sequelize.DOUBLE,
			},
			ThresholdPriceToClient: {
				type: Sequelize.DOUBLE,
			},
			RateHosting: {
				type: Sequelize.DOUBLE,
			},
			RateCodingFull: {
				type: Sequelize.DOUBLE,
			},
			RateCodingSemi: {
				type: Sequelize.DOUBLE,
			},
			RateTextAnalytics: {
				type: Sequelize.DOUBLE,
			},

			CreatedBy: {
				type: Sequelize.STRING,
			},
			UpdatedBy: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("ProfileSettings");
	},
};

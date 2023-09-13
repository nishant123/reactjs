"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class CountrySpecs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			CountrySpecs.belongsTo(models.CostingProfiles);
			CountrySpecs.hasMany(models.MethodologySpecs);
		}
	}
	CountrySpecs.init(
		{
			CountryCode: DataTypes.STRING,
			CountryName: DataTypes.STRING, //for vendor module purposes
			CostInputCurrency: DataTypes.STRING,

			SheetsCostsData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("SheetsCostsData");
					return val ? JSON.parse(val) : val;
				},
			},
			SheetsTimingsData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("SheetsTimingsData");
					return val ? JSON.parse(val) : val;
				},
			},
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

			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "CountrySpecs",
		}
	);
	CountrySpecs.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	CountrySpecs.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return CountrySpecs;
};

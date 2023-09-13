"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class BusinessUnits extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			BusinessUnits.belongsTo(models.Countries);
			BusinessUnits.hasMany(models.Verticals);
			BusinessUnits.hasMany(models.FormLayouts);
			BusinessUnits.hasMany(models.ClientServiceRates);
		}
	}
	BusinessUnits.init(
		{
			Label: DataTypes.STRING,
			Code: DataTypes.STRING,
			IsExternal: DataTypes.BOOLEAN,
			UsesCustomFormLayouts: DataTypes.BOOLEAN,

			//EWN Recepients

			EwnInternalBCC: DataTypes.TEXT,

			EwnInternalProgramming: DataTypes.TEXT,
			EwnInternalTranslations: DataTypes.TEXT,
			EwnInternalFieldwork: DataTypes.TEXT,
			EwnInternalVerbatimCoding: DataTypes.TEXT,
			EwnInternalDataProcessing: DataTypes.TEXT,
			EwnInternalCharts: DataTypes.TEXT,
			EwnInternalDashboards: DataTypes.TEXT,
			EwnInternalOpsPM: DataTypes.TEXT,
			EwnInternalDataScience: DataTypes.TEXT,
			EwnInternalFinance: DataTypes.TEXT,

			EwnExternalProgramming: DataTypes.TEXT,
			EwnExternalTranslations: DataTypes.TEXT,
			EwnExternalFieldwork: DataTypes.TEXT,
			EwnExternalVerbatimCoding: DataTypes.TEXT,
			EwnExternalDataProcessing: DataTypes.TEXT,
			EwnExternalCharts: DataTypes.TEXT,
			EwnExternalDashboards: DataTypes.TEXT,
			EwnExternalOpsPM: DataTypes.TEXT,
			EwnExternalDataScience: DataTypes.TEXT,

			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "BusinessUnits",
		}
	);
	BusinessUnits.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	BusinessUnits.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return BusinessUnits;
};

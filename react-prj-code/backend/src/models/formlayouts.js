"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FormLayouts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			FormLayouts.belongsTo(models.BusinessUnits);
		}
	}
	FormLayouts.init(
		{
			Code: DataTypes.STRING,
			Label: DataTypes.STRING,
			ParentMethodologyCode: DataTypes.STRING,
			RFQSchema: DataTypes.TEXT("long"),
			CostsSchema: DataTypes.TEXT("long"),
			CalculationSchema: DataTypes.TEXT("long"),
			TimingsSchema: DataTypes.TEXT("long"),
			RFQSchemaNA: DataTypes.BOOLEAN,
			RFQSchemaAlternative: DataTypes.TEXT,
			OpsPMHours: DataTypes.DOUBLE,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "FormLayouts",
		}
	);

	FormLayouts.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	FormLayouts.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return FormLayouts;
};

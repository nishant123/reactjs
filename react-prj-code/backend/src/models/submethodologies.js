"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class SubMethodologies extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			SubMethodologies.belongsTo(models.Methodologies);
		}
	}
	SubMethodologies.init(
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
			ResearchType: DataTypes.STRING,
			FieldType: DataTypes.STRING,
			OpsPMHours: DataTypes.DOUBLE,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "SubMethodologies",
		}
	);
	return SubMethodologies;
};

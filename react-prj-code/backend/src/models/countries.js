"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Countries extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Countries.hasMany(models.BusinessUnits);
			Countries.hasMany(models.Offices);
			Countries.hasMany(models.RequestTypes);
		}
	}
	Countries.init(
		{
			Code: DataTypes.STRING,
			Label: DataTypes.STRING,
			CurrencyUnit: DataTypes.STRING,
			IsCommissioningMarket: DataTypes.BOOLEAN,
			ConversionRateToLocal: DataTypes.DOUBLE,
			AdminContactEmails: DataTypes.TEXT,
			Languages: DataTypes.STRING,
			TimeZone: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Countries",
		}
	);
	Countries.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	Countries.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return Countries;
};

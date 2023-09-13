"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ClientServiceRates extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ClientServiceRates.belongsTo(models.BusinessUnits);
		}
	}
	ClientServiceRates.init(
		{
			ProfileName: DataTypes.STRING,
			ExecutiveDirector: DataTypes.DOUBLE,
			Director: DataTypes.DOUBLE,
			AssociateDirector: DataTypes.DOUBLE,
			SeniorManager: DataTypes.DOUBLE,
			Manager: DataTypes.DOUBLE,
			SeniorExecutive: DataTypes.DOUBLE,
			Executive: DataTypes.DOUBLE,
			DatascienceInternalComm: DataTypes.DOUBLE,
			IsDefault: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ClientServiceRates",
		}
	);

	ClientServiceRates.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	ClientServiceRates.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return ClientServiceRates;
};

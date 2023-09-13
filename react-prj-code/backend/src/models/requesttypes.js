"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class RequestTypes extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			RequestTypes.belongsTo(models.Countries);
		}
	}
	RequestTypes.init(
		{
			RequestTypeName: DataTypes.STRING,
			PrimaryContactEmails: DataTypes.TEXT,
			OtherContactEmails: DataTypes.TEXT,
			Comments: DataTypes.TEXT,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "RequestTypes",
		}
	);

	RequestTypes.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	RequestTypes.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return RequestTypes;
};

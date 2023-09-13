"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ApprovalSettings extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ApprovalSettings.belongsTo(models.Verticals);
			ApprovalSettings.hasMany(models.ApproverContacts);
		}
	}
	ApprovalSettings.init(
		{
			Label: DataTypes.STRING,
			ThresholdOutOfPocketPercentage: DataTypes.DOUBLE,
			ThresholdRevenueAmount: DataTypes.DOUBLE,
			ThresholdOutOfPocketAmountSyndicated: DataTypes.DOUBLE,
			Order: DataTypes.INTEGER,

			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ApprovalSettings",
		}
	);

	ApprovalSettings.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	ApprovalSettings.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return ApprovalSettings;
};

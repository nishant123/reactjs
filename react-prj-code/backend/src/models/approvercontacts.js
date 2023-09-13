"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ApproverContacts extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ApproverContacts.belongsTo(models.ApprovalSettings);
		}
	}
	ApproverContacts.init(
		{
			EmailAddress: DataTypes.STRING,
			IsMandatoryApprover: DataTypes.BOOLEAN,

			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ApproverContacts",
		}
	);
	ApproverContacts.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	ApproverContacts.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return ApproverContacts;
};

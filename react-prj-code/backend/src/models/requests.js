"use strict";
const { Model } = require("sequelize");
const dbHelpers = require("../utils/dbhelpers");
module.exports = (sequelize, DataTypes) => {
	class Requests extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Requests.belongsTo(models.CostingProfiles);
			Requests.hasMany(models.RequestLogs);
		}
	}
	Requests.init(
		{
			RequestType: DataTypes.STRING,
			RequestorEmail: DataTypes.STRING,
			AgentEmail: DataTypes.TEXT,
			CcAgentEmails: DataTypes.TEXT,
			Methodology: {
				type: DataTypes.STRING,
				set(val) {
					this.setDataValue("Methodology", dbHelpers.MultiToString(val));
				},
			},
			IsClosed: DataTypes.BOOLEAN,
			IsSent: DataTypes.BOOLEAN,
			IsNotified: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
			InitialNotes: DataTypes.TEXT("long"),
			DateDue: DataTypes.DATE,
			DateClosed: DataTypes.DATE,
			AttachmentLink: DataTypes.TEXT,
			RequestVersionNumber: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Requests",
		}
	);
	Requests.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	Requests.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return Requests;
};

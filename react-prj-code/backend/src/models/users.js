"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Users.init(
		{
			UserName: DataTypes.STRING,
			FirstName: DataTypes.STRING,
			LastName: DataTypes.STRING,
			Email: DataTypes.STRING,
			Password: DataTypes.STRING,
			GoogleSub:DataTypes.STRING,
			Countries: DataTypes.STRING,
			BusinessUnits: DataTypes.STRING,
			Verticals: DataTypes.STRING,
			Language: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
			LastLoginDate: DataTypes.DATE,
			LastPasswordResetDate: DataTypes.DATE,
			ResetToken: DataTypes.STRING,
			ResetTokenExpiryDate: DataTypes.DATE,
			FailedLoginAttempts: DataTypes.INTEGER,
			Comments: DataTypes.TEXT,
			IsDisabled: DataTypes.BOOLEAN,
			IsInternalUser: DataTypes.BOOLEAN,
			IsDeveloper: DataTypes.BOOLEAN,
			IsTCSUser: DataTypes.BOOLEAN,
			IsProgrammingTeamLeader: DataTypes.BOOLEAN,
			IsProgrammer: DataTypes.BOOLEAN,
			IsCostingSPOC: DataTypes.BOOLEAN,
			IsCostingApprover: DataTypes.BOOLEAN,
			IsClientService: DataTypes.BOOLEAN,
			IsOpsProjectManager: DataTypes.BOOLEAN,
			CanBypassSalesForce: DataTypes.BOOLEAN,
			CanBypassApprovals: DataTypes.BOOLEAN,
			CanCreateNewProposal: DataTypes.BOOLEAN,
			DeliveryDashboardAccess: DataTypes.BOOLEAN,
			InternalDashBoardAccess: DataTypes.BOOLEAN,
			RequestsBoardAccess: DataTypes.BOOLEAN,
			ManageUsersAccess: DataTypes.BOOLEAN,
			ManageMarketAccess: DataTypes.BOOLEAN,
			FinanceAccess: DataTypes.BOOLEAN,
			SpCountries: DataTypes.STRING,
			SpPermission: DataTypes.STRING,
			SpRole: DataTypes.STRING,
			IsSp: DataTypes.BOOLEAN,
			Manager : DataTypes.STRING,
			Country: DataTypes.STRING,
			Thumbnail: DataTypes.STRING,
			CountryAdmin: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Users",
		}
	);

	Users.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	Users.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return Users;
};

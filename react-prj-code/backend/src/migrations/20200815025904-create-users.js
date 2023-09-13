"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Users", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			UserName: {
				type: Sequelize.STRING,
			},
			FirstName: {
				type: Sequelize.STRING,
			},
			LastName: {
				type: Sequelize.STRING,
			},
			Email: {
				type: Sequelize.STRING,
				unique: true,
			},
			Password: {
				type: Sequelize.STRING,
			},
			Countries: {
				type: Sequelize.STRING,
			},
			BusinessUnits: {
				type: Sequelize.STRING,
			},
			Verticals: {
				type: Sequelize.STRING,
			},
			Language: {
				type: Sequelize.STRING,
			},
			CreatedBy: {
				type: Sequelize.STRING,
			},
			UpdatedBy: {
				type: Sequelize.STRING,
			},
			LastLoginDate: {
				type: Sequelize.DATE,
			},
			LastPasswordResetDate: { type: Sequelize.DATE },
			ResetToken: { type: Sequelize.STRING },
			ResetTokenExpiryDate: { type: Sequelize.DATE },
			FailedLoginAttempts: { type: Sequelize.INTEGER },
			Comments: { type: Sequelize.TEXT },
			IsDisabled: {
				type: Sequelize.BOOLEAN,
			},
			IsInternalUser: { type: Sequelize.TEXT },
			IsDeveloper: {
				type: Sequelize.BOOLEAN,
			},
			IsTCSUser: {
				type: Sequelize.BOOLEAN,
			},
			IsProgrammingTeamLeader: {
				type: Sequelize.BOOLEAN,
			},
			IsProgrammer: { type: Sequelize.BOOLEAN },
			IsCostingSPOC: { type: Sequelize.BOOLEAN },
			IsCostingApprover: { type: Sequelize.BOOLEAN },
			IsClientService: { type: Sequelize.BOOLEAN },
			IsOpsProjectManager: { type: Sequelize.BOOLEAN },
			CanBypassSalesForce: {
				type: Sequelize.BOOLEAN,
			},
			CanBypassApprovals: {
				type: Sequelize.BOOLEAN,
			},
			CanCreateNewProposal: {
				type: Sequelize.BOOLEAN,
			},
			FinanceAccess: {
				type: Sequelize.BOOLEAN,
			},
			DeliveryDashboardAccess: {
				type: Sequelize.BOOLEAN,
			},
			InternalDashBoardAccess: {
				type: Sequelize.BOOLEAN,
			},
			RequestsBoardAccess: {
				type: Sequelize.BOOLEAN,
			},
			ManageUsersAccess: {
				type: Sequelize.BOOLEAN,
			},
			ManageMarketAccess: {
				type: Sequelize.BOOLEAN,
			},
			SpCountries: {
				type: Sequelize.STRING,
			},
			SpPermission: {
				type: Sequelize.STRING,
			},
			SpRole: {
				type: Sequelize.STRING,
			},
			IsSp: {
				type: Sequelize.BOOLEAN,
			},
			Manager : {
				type: Sequelize.STRING,
			},
			Country: {
				type: Sequelize.STRING,
			},
			Thumbnail: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Users");
	},
};

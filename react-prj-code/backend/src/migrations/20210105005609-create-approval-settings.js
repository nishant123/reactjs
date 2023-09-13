"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("ApprovalSettings", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			Label: {
				type: Sequelize.STRING,
			},
			ThresholdOutOfPocketPercentage: {
				type: Sequelize.DOUBLE,
			},
			ThresholdRevenueAmount: {
				type: Sequelize.DOUBLE,
			},
			ThresholdOutOfPocketAmountSyndicated: {
				type: Sequelize.DOUBLE,
			},
			Order: {
				type: Sequelize.INTEGER,
			},
			CreatedBy: {
				type: Sequelize.STRING,
			},
			UpdatedBy: {
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
		await queryInterface.dropTable("ApprovalSettings");
	},
};

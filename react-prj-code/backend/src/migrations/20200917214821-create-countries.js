"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Countries", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			Code: {
				type: Sequelize.STRING,
			},
			Label: {
				type: Sequelize.STRING,
			},
			CurrencyUnit: {
				type: Sequelize.STRING,
			},
			IsCommissioningMarket: {
				type: Sequelize.BOOLEAN,
			},
			ConversionRateToLocal: {
				type: Sequelize.DOUBLE,
			},
			AdminContactEmails: { type: Sequelize.TEXT },
			Languages: {
				type: Sequelize.STRING,
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
		await queryInterface.dropTable("Countries");
	},
};

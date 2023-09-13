"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("RequestTypes", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			RequestTypeName: {
				type: Sequelize.STRING,
			},
			PrimaryContactEmails: {
				type: Sequelize.TEXT,
			},
			OtherContactEmails: {
				type: Sequelize.TEXT,
			},
			Comments: {
				type: Sequelize.TEXT,
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
		await queryInterface.dropTable("RequestTypes");
	},
};

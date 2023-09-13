"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Requests", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			RequestType: {
				type: Sequelize.STRING,
			},
			RequestorEmail: {
				type: Sequelize.STRING,
			},
			AgentEmail: {
				type: Sequelize.TEXT,
			},
			CcAgentEmails: {
				type: Sequelize.TEXT,
			},
			Methodology: {
				type: Sequelize.STRING,
			},
			IsClosed: {
				type: Sequelize.BOOLEAN,
			},
			IsSent: {
				type: Sequelize.BOOLEAN,
			},
			IsNotified: {
				type: Sequelize.BOOLEAN,
			},
			CreatedBy: {
				type: Sequelize.STRING,
			},
			UpdatedBy: {
				type: Sequelize.STRING,
			},
			InitialNotes: {
				type: Sequelize.TEXT("long"),
			},
			DateDue: {
				type: Sequelize.DATE,
			},
			DateClosed: {
				type: Sequelize.DATE,
			},
			AttachmentLink: {
				type: Sequelize.TEXT,
			},
			RequestVersionNumber: { type: Sequelize.INTEGER },
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
		await queryInterface.dropTable("Requests");
	},
};

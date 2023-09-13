"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Projects", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			ProjectId: {
				type: Sequelize.STRING,
			},
			CreatedBy: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			UpdatedBy: {
				type: Sequelize.STRING,
			},
			ProjectName: {
				type: Sequelize.TEXT,
			},
			BusinessUnit: {
				type: Sequelize.STRING,
			},
			IndustryVertical: {
				type: Sequelize.STRING,
			},
			CommissioningCountry: {
				type: Sequelize.STRING,
			},
			CommissioningOffice: {
				type: Sequelize.STRING,
			},
			IsSyndicated: {
				type: Sequelize.BOOLEAN,
			},
			ProjectStatus: {
				type: Sequelize.STRING,
			},
			ScheduleStatus: {
				type: Sequelize.STRING,
			},
			ProposalOwnerEmail: {
				type: Sequelize.STRING,
			},
			OtherProjectTeamContacts: {
				type: Sequelize.TEXT,
			},
			ProjectResourcesFolderId: {
				type: Sequelize.STRING,
			},
			CostingsFolderId: {
				type: Sequelize.STRING,
			},
			CommissionedProfileId: {
				type: Sequelize.INTEGER,
			},
			CommissionedBy: {
				type: Sequelize.STRING,
			},
			IsDeleted: {
				type: Sequelize.BOOLEAN,
			},
			IsDraftProposal: {
				type: Sequelize.BOOLEAN,
			},
			ProjectManagerEmail: {
				type: Sequelize.STRING,
			},
			LastRefreshSF: {
				type: Sequelize.DATE,
			},
			IsSFContactSyncPaused: {
				type: Sequelize.BOOLEAN,
			},
			IsGdriveActionActive: {
				type: Sequelize.BOOLEAN,
			},
			IsRestrictedProject: { type: Sequelize.BOOLEAN },
			IsImportedProject: { type: Sequelize.BOOLEAN },
			VerticalId: { type: Sequelize.INTEGER },
			BusinessUnitId: { type: Sequelize.INTEGER },
			NotesProjectStatus: { type: Sequelize.TEXT("long") },
			ProjectBackground: { type: Sequelize.TEXT("long") },
			ResearchObjectives: { type: Sequelize.TEXT("long") },
			LeadCostingSPOC: { type: Sequelize.STRING },

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
		await queryInterface.dropTable("Projects");
	},
};

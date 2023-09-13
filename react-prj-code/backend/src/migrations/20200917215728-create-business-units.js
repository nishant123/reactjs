"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("BusinessUnits", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			Label: {
				type: Sequelize.STRING,
			},
			Code: {
				type: Sequelize.STRING,
			},
			IsExternal: {
				type: Sequelize.BOOLEAN,
			},
			UsesCustomFormLayouts: { type: Sequelize.BOOLEAN },

			EwnInternalBCC: { type: Sequelize.TEXT },

			EwnInternalProgramming: { type: Sequelize.TEXT },
			EwnInternalTranslations: { type: Sequelize.TEXT },
			EwnInternalFieldwork: { type: Sequelize.TEXT },
			EwnInternalVerbatimCoding: { type: Sequelize.TEXT },
			EwnInternalDataProcessing: { type: Sequelize.TEXT },
			EwnInternalCharts: { type: Sequelize.TEXT },
			EwnInternalDashboards: { type: Sequelize.TEXT },
			EwnInternalOpsPM: { type: Sequelize.TEXT },
			EwnInternalDataScience: { type: Sequelize.TEXT },
			EwnInternalFinance: { type: Sequelize.TEXT },

			EwnExternalProgramming: { type: Sequelize.TEXT },
			EwnExternalTranslations: { type: Sequelize.TEXT },
			EwnExternalFieldwork: { type: Sequelize.TEXT },
			EwnExternalVerbatimCoding: { type: Sequelize.TEXT },
			EwnExternalDataProcessing: { type: Sequelize.TEXT },
			EwnExternalCharts: { type: Sequelize.TEXT },
			EwnExternalDashboards: { type: Sequelize.TEXT },
			EwnExternalOpsPM: { type: Sequelize.TEXT },
			EwnExternalDataScience: { type: Sequelize.TEXT },

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
		await queryInterface.dropTable("BusinessUnits");
	},
};

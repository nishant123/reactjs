"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("CountrySpecs", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			CountryCode: {
				type: Sequelize.STRING,
			},
			CountryName: {
				type: Sequelize.STRING,
			}, // for vendor module
			CostInputCurrency: { type: Sequelize.STRING },
			SheetsCostsData: { type: Sequelize.TEXT("long") },
			SheetsTimingsData: { type: Sequelize.TEXT("long") },
			CostTotalExternalOperations: {
				type: Sequelize.DOUBLE,
			},
			CostTotalInternalOperations: {
				type: Sequelize.DOUBLE,
			},
			CostTotalExternalCommercial: {
				type: Sequelize.DOUBLE,
			},
			CostTotalInternalCommercial: {
				type: Sequelize.DOUBLE,
			},

			CostExtOpsInterviewers: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsDCQCDPSP: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsTE: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsOthers: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsIncentives: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsConsultantVendor: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsPrintingStationery: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsFreightShipping: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsVenueHireRecruitment: {
				type: Sequelize.DOUBLE,
			},
			CostExtOpsMCPSubContract: { type: Sequelize.DOUBLE },
			CostExtOpsOtherTaxVAT: { type: Sequelize.DOUBLE },
			CostIntOpsFieldPMQC: {
				type: Sequelize.DOUBLE,
			},
			CostIntOpsOthers: {
				type: Sequelize.DOUBLE,
			},
			CostIntOpsProgramming: {
				type: Sequelize.DOUBLE,
			},
			CostIntOpsDPCodingAnalysis: {
				type: Sequelize.DOUBLE,
			},
			CostExtCommTE: {
				type: Sequelize.DOUBLE,
			},
			CostExtCommConsultant: {
				type: Sequelize.DOUBLE,
			},
			CostExtCommOthers: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommExecDirector: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommDirector: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommAssociateDirector: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommSeniorManager: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommManager: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommSeniorExecutive: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommExecutive: {
				type: Sequelize.DOUBLE,
			},
			CostIntCommDataScience: {
				type: Sequelize.DOUBLE,
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
		await queryInterface.dropTable("CountrySpecs");
	},
};

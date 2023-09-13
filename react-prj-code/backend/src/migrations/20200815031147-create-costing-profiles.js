"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("CostingProfiles", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			CostingsSheetId: { type: Sequelize.STRING },
			AdditionalSheetId: { type: Sequelize.STRING },
			ProfileName: {
				type: Sequelize.TEXT,
			},
			ProfileNumber: {
				type: Sequelize.INTEGER,
			},
			CreatedBy: {
				type: Sequelize.STRING,
			},
			UpdatedBy: {
				type: Sequelize.STRING,
			},
			IsImportedProfile: { type: Sequelize.BOOLEAN },
			Methodology: {
				type: Sequelize.STRING,
			},
			SubMethodology: {
				type: Sequelize.STRING,
			},
			PriceToClient: {
				type: Sequelize.DOUBLE,
			},
			RecommendedPrice: {
				type: Sequelize.DOUBLE,
			},
			// NetRevenue: {
			// 	type: Sequelize.DOUBLE,
			// },
			// ContributionMargin: {
			// 	type: Sequelize.DOUBLE,
			// },
			TotalCostsRaw: {
				type: Sequelize.DOUBLE,
			},
			TotalCostIncOverhead: {
				type: Sequelize.DOUBLE,
			},
			Overheads: {
				type: Sequelize.DOUBLE,
			},
			Markup: {
				type: Sequelize.DOUBLE,
			},
			ProfileStatus: {
				type: Sequelize.STRING,
			},
			NeedsApproval: {
				type: Sequelize.BOOLEAN,
			},
			PriceToClientLocal: {
				type: Sequelize.DOUBLE,
			},
			CostInputCurrency: { type: Sequelize.STRING },
			IsTracker: {
				type: Sequelize.BOOLEAN,
			},
			TrackingFrequency: { type: Sequelize.STRING },
			NumberOfWaves: { type: Sequelize.INTEGER },
			IsMultiCountry: { type: Sequelize.BOOLEAN },
			FieldingCountries: { type: Sequelize.STRING },
			ResearchType: { type: Sequelize.STRING },
			FieldType: { type: Sequelize.STRING },
			TotalInternalCosts: {
				type: Sequelize.DOUBLE,
			},
			TotalExternalCosts: {
				type: Sequelize.DOUBLE,
			},
			CommissionedBy: {
				type: Sequelize.STRING,
			},
			CommissionedDate: {
				type: Sequelize.DATE,
			},
			StudyType: { type: Sequelize.STRING },
			CostingType: { type: Sequelize.STRING },
			CostingNotes: { type: Sequelize.TEXT("long") },

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

			// SurveyProgrammingJobCount: { type: Sequelize.DOUBLE },
			// CostIntSurveyProgramming: { type: Sequelize.DOUBLE },
			// CostExtSurveyProgramming: { type: Sequelize.DOUBLE },
			// CostExtCharting: { type: Sequelize.DOUBLE },
			// CostIntCharting: { type: Sequelize.DOUBLE },
			// CostIntDataProcessing: { type: Sequelize.DOUBLE },
			// CostExtDataProcessing: { type: Sequelize.DOUBLE },
			// CostExtVerbatimCoding: { type: Sequelize.DOUBLE },
			// CostIntVerbatimCoding: { type: Sequelize.DOUBLE },
			// CostExtTextAnalytics: { type: Sequelize.DOUBLE },
			// CostIntAdditionalOperationsSupport: { type: Sequelize.DOUBLE },
			// CostIntOtherDataPreparation: { type: Sequelize.DOUBLE },

			CostExtOpsHosting: { type: Sequelize.DOUBLE },
			CostIntOpsAdditionalOperationsSupport: { type: Sequelize.DOUBLE },
			CostIntOpsOtherDataPreparation: { type: Sequelize.DOUBLE },
			CostExtOpsDataEntry: { type: Sequelize.DOUBLE },
			CostIntOpsDataEntry: { type: Sequelize.DOUBLE },
			CostExtOpsVerbatimCoding: { type: Sequelize.DOUBLE },
			CostIntOpsVerbatimCoding: { type: Sequelize.DOUBLE },
			CostIntOpsDataScience: { type: Sequelize.DOUBLE },
			CostExtOpsDataProcessing: { type: Sequelize.DOUBLE },
			CostIntOpsDataProcessing: { type: Sequelize.DOUBLE },
			CostExtOpsCharting: { type: Sequelize.DOUBLE },
			CostIntOpsCharting: { type: Sequelize.DOUBLE },
			CostIntOpsSurveyProgramming: { type: Sequelize.DOUBLE },
			CostExtOpsSurveyProgramming: { type: Sequelize.DOUBLE },
			CostExtOpsTextAnalytics: { type: Sequelize.DOUBLE },
			CostIntOpsPM: { type: Sequelize.DOUBLE },
			CostExtOpsOnlineSample: { type: Sequelize.DOUBLE },

			InternalCommercialCostPercent: { type: Sequelize.DOUBLE },
			OutOfPocketCostPercent: { type: Sequelize.DOUBLE },
			NetRevenuePercent: { type: Sequelize.DOUBLE },
			ContributionMarginPercent: { type: Sequelize.DOUBLE },

			TotalIntOpsPMHours: { type: Sequelize.DOUBLE },
			TotalOnlineSampleSize: { type: Sequelize.INTEGER },
			SurveyProgrammingJobCount: { type: Sequelize.DOUBLE },
			DecommissionNotes: { type: Sequelize.TEXT },
			ApprovalDetails: { type: Sequelize.TEXT("long") },
			ApprovalJustification: { type: Sequelize.TEXT },
			ApprovalNotes: { type: Sequelize.TEXT },
			ApprovalLevelAwaiting: { type: Sequelize.INTEGER },
			ApprovalLevelReached: { type: Sequelize.INTEGER },
			ApprovalVersionNumber: { type: Sequelize.INTEGER },
			ApprovalRequestor: { type: Sequelize.STRING },
			ApprovalLevelNeeded: { type: Sequelize.INTEGER },
			CheckPassedOutOfPocket: { type: Sequelize.BOOLEAN },
			CheckPassedCommercialCost: { type: Sequelize.BOOLEAN },
			CheckPassedNetRevenue: { type: Sequelize.BOOLEAN },
			CheckPassedContributionMargin: { type: Sequelize.BOOLEAN },
			CheckPassedMinimumProjectValue: { type: Sequelize.BOOLEAN },

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
		await queryInterface.dropTable("CostingProfiles");
	},
};

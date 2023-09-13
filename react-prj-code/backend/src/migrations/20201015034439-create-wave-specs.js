"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("WaveSpecs", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			WaveNumber: {
				type: Sequelize.INTEGER,
			},
			WaveName: {
				type: Sequelize.STRING,
			},
			WaveStatus: { type: Sequelize.STRING },
			CostInputCurrency: { type: Sequelize.STRING },
			WaveFolderId: {
				type: Sequelize.STRING,
			},
			TimeTrackerId: {
				type: Sequelize.STRING,
			},
			ProjectBoxId: {
				type: Sequelize.STRING,
			},
			OpsResourcesSchema: {
				type: Sequelize.TEXT("long"),
			},
			OpsResourcesData: {
				type: Sequelize.TEXT("long"),
			},
			DateWaveCommissioned: {
				type: Sequelize.DATE,
			},
			DateFinalQuestionnaire: {
				type: Sequelize.DATE,
			},
			DateFinalQuestionnaireActual: {
				type: Sequelize.DATE,
			},
			DateTranslations: {
				type: Sequelize.DATE,
			},
			DateTranslationsActual: {
				type: Sequelize.DATE,
			},
			DateFieldStart: {
				type: Sequelize.DATE,
			},
			DateFieldStartActual: {
				type: Sequelize.DATE,
			},
			DateFieldEnd: {
				type: Sequelize.DATE,
			},
			DateFieldEndActual: {
				type: Sequelize.DATE,
			},
			DateVerbatimCoding: {
				type: Sequelize.DATE,
			},
			DateVerbatimCodingActual: {
				type: Sequelize.DATE,
			},
			DateDataProcessing: {
				type: Sequelize.DATE,
			},
			DateDataProcessingActual: {
				type: Sequelize.DATE,
			},
			DateCharts: {
				type: Sequelize.DATE,
			},
			DateChartsActual: {
				type: Sequelize.DATE,
			},
			DateDashboards: {
				type: Sequelize.DATE,
			},
			DateDashboardsActual: {
				type: Sequelize.DATE,
			},
			DateFinalReport: {
				type: Sequelize.DATE,
			},
			DateFinalReportActual: {
				type: Sequelize.DATE,
			},
			DateProgrammingStartActual: {
				type: Sequelize.DATE,
			},
			DateFirstTestLinkActual: {
				type: Sequelize.DATE,
			},
			DateLiveLinkActual: {
				type: Sequelize.DATE,
			},
			DateDeliveryToGOActual: {
				type: Sequelize.DATE,
			},
			DateFinalQuestionnaireNA: {
				type: Sequelize.BOOLEAN,
			},
			DateTranslationsNA: {
				type: Sequelize.BOOLEAN,
			},
			DateFieldworkNA: {
				type: Sequelize.BOOLEAN,
			},
			DateVerbatimCodingNA: {
				type: Sequelize.BOOLEAN,
			},
			DateDataProcessingNA: {
				type: Sequelize.BOOLEAN,
			},
			DateChartsNA: {
				type: Sequelize.BOOLEAN,
			},
			DateDashboardsNA: {
				type: Sequelize.BOOLEAN,
			},
			DateFinalReportNA: {
				type: Sequelize.BOOLEAN,
			},

			NotesFinalQuestionnaire: { type: Sequelize.TEXT("long") },
			NotesTranslations: { type: Sequelize.TEXT("long") },
			NotesFieldwork: { type: Sequelize.TEXT("long") },
			NotesVerbatimCoding: { type: Sequelize.TEXT("long") },
			NotesDataProcessing: { type: Sequelize.TEXT("long") },
			NotesCharts: { type: Sequelize.TEXT("long") },
			NotesDashboards: { type: Sequelize.TEXT("long") },
			NotesFinalReport: { type: Sequelize.TEXT("long") },
			NotesPM: { type: Sequelize.TEXT("long") },

			NotesDataScience: { type: Sequelize.TEXT("long") },
			NotesOther: { type: Sequelize.TEXT("long") },
			NotesFinance: { type: Sequelize.TEXT("long") },

			IncludeProjectTeamInComms: { type: Sequelize.BOOLEAN },
			IncludeFinanceInComms: { type: Sequelize.BOOLEAN },

			OverrideOnlineSampleCost: { type: Sequelize.BOOLEAN },
			OverrideHostingCost: { type: Sequelize.BOOLEAN },
			OverrideSurveyProgrammingCost: { type: Sequelize.BOOLEAN },
			OverrideOpsPMCost: { type: Sequelize.BOOLEAN },
			OverrideChartingCost: { type: Sequelize.BOOLEAN },
			OverrideDataProcessingCost: { type: Sequelize.BOOLEAN },
			OverrideDataScienceCost: { type: Sequelize.BOOLEAN },
			OverrideCodingCost: { type: Sequelize.BOOLEAN },
			OverrideTextAnalyticsCost: { type: Sequelize.BOOLEAN },
			OverrideDataEntryCost: { type: Sequelize.BOOLEAN },
			OverrideOtherDataPreparationCost: { type: Sequelize.BOOLEAN },
			OverrideAdditionalOperationsSupportCost: { type: Sequelize.BOOLEAN },

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

			TotalIntOpsPMHours: { type: Sequelize.DOUBLE },
			TotalOnlineSampleSize: { type: Sequelize.INTEGER },
			SurveyProgrammingJobCount: { type: Sequelize.DOUBLE },

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

			CommercialHoursData: { type: Sequelize.TEXT("long") },
			CostOverrideNotes: { type: Sequelize.TEXT("long") },

			EWNVersion: { type: Sequelize.INTEGER },

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
		await queryInterface.dropTable("WaveSpecs");
	},
};

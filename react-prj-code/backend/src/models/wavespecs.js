"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class WaveSpecs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			WaveSpecs.belongsTo(models.CostingProfiles);
			WaveSpecs.hasOne(models.DeliverySpecs);
		}
	}
	WaveSpecs.init(
		{
			WaveNumber: DataTypes.INTEGER,
			WaveName: DataTypes.STRING,
			WaveStatus: DataTypes.STRING,
			CostInputCurrency: DataTypes.STRING,
			WaveFolderId: DataTypes.STRING,
			TimeTrackerId: DataTypes.STRING,
			ProjectBoxId: DataTypes.STRING,
			OpsResourcesSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("OpsResourcesSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			OpsResourcesData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("OpsResourcesData");
					return val ? JSON.parse(val) : val;
				},
			},

			CommercialHoursData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CommercialHoursData");
					return val ? JSON.parse(val) : val;
				},
			},

			DateWaveCommissioned: DataTypes.DATE,

			DateFinalQuestionnaire: DataTypes.DATE,
			DateFinalQuestionnaireActual: DataTypes.DATE,
			DateTranslations: DataTypes.DATE,
			DateTranslationsActual: DataTypes.DATE,
			DateFieldStart: DataTypes.DATE,
			DateFieldStartActual: DataTypes.DATE,
			DateFieldEnd: DataTypes.DATE,
			DateFieldEndActual: DataTypes.DATE,
			DateVerbatimCoding: DataTypes.DATE,
			DateVerbatimCodingActual: DataTypes.DATE,
			DateDataProcessing: DataTypes.DATE,
			DateDataProcessingActual: DataTypes.DATE,
			DateCharts: DataTypes.DATE,
			DateChartsActual: DataTypes.DATE,
			DateDashboards: DataTypes.DATE,
			DateDashboardsActual: DataTypes.DATE,
			DateFinalReport: DataTypes.DATE,
			DateFinalReportActual: DataTypes.DATE,

			DateProgrammingStartActual: DataTypes.DATE,
			DateFirstTestLinkActual: DataTypes.DATE,
			DateLiveLinkActual: DataTypes.DATE,
			DateDeliveryToGOActual: DataTypes.DATE,

			DateFinalQuestionnaireNA: DataTypes.BOOLEAN,
			DateTranslationsNA: DataTypes.BOOLEAN,
			DateFieldworkNA: DataTypes.BOOLEAN,
			DateVerbatimCodingNA: DataTypes.BOOLEAN,
			DateDataProcessingNA: DataTypes.BOOLEAN,
			DateChartsNA: DataTypes.BOOLEAN,
			DateDashboardsNA: DataTypes.BOOLEAN,
			DateFinalReportNA: DataTypes.BOOLEAN,

			NotesFinalQuestionnaire: DataTypes.TEXT("long"),
			NotesTranslations: DataTypes.TEXT("long"),
			NotesFieldwork: DataTypes.TEXT("long"),
			NotesVerbatimCoding: DataTypes.TEXT("long"),
			NotesDataProcessing: DataTypes.TEXT("long"),
			NotesCharts: DataTypes.TEXT("long"),
			NotesDashboards: DataTypes.TEXT("long"),
			NotesFinalReport: DataTypes.TEXT("long"),
			NotesPM: DataTypes.TEXT("long"),
			NotesDataScience: DataTypes.TEXT("long"),
			NotesOther: DataTypes.TEXT("long"),
			NotesFinance: DataTypes.TEXT("long"),

			IncludeProjectTeamInComms: DataTypes.BOOLEAN,
			IncludeFinanceInComms: DataTypes.BOOLEAN,

			CostIntCommExecDirector: DataTypes.DOUBLE,
			CostIntCommDirector: DataTypes.DOUBLE,
			CostIntCommAssociateDirector: DataTypes.DOUBLE,
			CostIntCommSeniorManager: DataTypes.DOUBLE,
			CostIntCommManager: DataTypes.DOUBLE,
			CostIntCommSeniorExecutive: DataTypes.DOUBLE,
			CostIntCommExecutive: DataTypes.DOUBLE,
			CostIntCommDataScience: DataTypes.DOUBLE,

			OverrideOnlineSampleCost: DataTypes.BOOLEAN,
			OverrideHostingCost: DataTypes.BOOLEAN,
			OverrideSurveyProgrammingCost: DataTypes.BOOLEAN,
			OverrideOpsPMCost: DataTypes.BOOLEAN,
			OverrideChartingCost: DataTypes.BOOLEAN,
			OverrideDataProcessingCost: DataTypes.BOOLEAN,
			OverrideDataScienceCost: DataTypes.BOOLEAN,
			OverrideCodingCost: DataTypes.BOOLEAN,
			OverrideTextAnalyticsCost: DataTypes.BOOLEAN,
			OverrideDataEntryCost: DataTypes.BOOLEAN,
			OverrideOtherDataPreparationCost: DataTypes.BOOLEAN,
			OverrideAdditionalOperationsSupportCost: DataTypes.BOOLEAN,

			CostExtOpsHosting: DataTypes.DOUBLE,
			CostIntOpsAdditionalOperationsSupport: DataTypes.DOUBLE,
			CostIntOpsOtherDataPreparation: DataTypes.DOUBLE,
			CostExtOpsDataEntry: DataTypes.DOUBLE,
			CostIntOpsDataEntry: DataTypes.DOUBLE,
			CostExtOpsVerbatimCoding: DataTypes.DOUBLE,
			CostIntOpsVerbatimCoding: DataTypes.DOUBLE,
			CostIntOpsDataScience: DataTypes.DOUBLE,
			CostExtOpsDataProcessing: DataTypes.DOUBLE,
			CostIntOpsDataProcessing: DataTypes.DOUBLE,
			CostExtOpsCharting: DataTypes.DOUBLE,
			CostIntOpsCharting: DataTypes.DOUBLE,
			CostIntOpsSurveyProgramming: DataTypes.DOUBLE,
			CostExtOpsSurveyProgramming: DataTypes.DOUBLE,
			CostExtOpsTextAnalytics: DataTypes.DOUBLE,
			CostIntOpsPM: DataTypes.DOUBLE,
			CostExtOpsOnlineSample: DataTypes.DOUBLE,

			TotalIntOpsPMHours: DataTypes.DOUBLE,
			TotalOnlineSampleSize: DataTypes.INTEGER,
			SurveyProgrammingJobCount: DataTypes.DOUBLE,
			CostOverrideNotes: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CostOverrideNotes");
					return val ? JSON.parse(val) : val;
				},
			},

			EWNVersion: DataTypes.INTEGER,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "WaveSpecs",
		}
	);
	WaveSpecs.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	WaveSpecs.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return WaveSpecs;
};

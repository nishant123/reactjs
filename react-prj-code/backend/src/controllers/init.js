const models = require("../models");
const Sequelize = require("sequelize");
const onlineSampleRateCards = require("../config/ratecards/sample-online.json");
const chartingRateCards = require("../config/ratecards/ops-charting.json");
const dataEntryRateCards = require("../config/ratecards/ops-data-entry.json");
const dataProcessingRateCards = require("../config/ratecards/ops-data-processing.json");
const programmingRateCards = require("../config/ratecards/ops-programming.json");
const opsProjectManagementRateCards = require("../config/ratecards/ops-project-management.json");

const LoadConfig = async (req, res) => {
	try {
		// Auth middleware ValidateToken() puts tokenData in request obj
		const userData = req.tokenData;
		const { Op } = Sequelize.Op;
		const initialState = {};
		let allowedBusinessUnits;
		let allowedCountries;
		let allowedVerticals;

		const allRateCards = {
			onlineSample: onlineSampleRateCards,
			charting: chartingRateCards,
			dataEntry: dataEntryRateCards,
			dataProcessing: dataProcessingRateCards,
			programming: programmingRateCards,
			opsProjectManagement: opsProjectManagementRateCards,
		};

		//Using tokendata to find full user record
		await models.Users.findByPk(userData.UserId)
			.then((clientUser) => {
				//return user;

				//find all access limiters
				allowedBusinessUnits = clientUser.BusinessUnits.split(",");
				allowedCountries = clientUser.Countries.split(",");
				//allowedVerticals = clientUser.Verticals.split(",");
			})
			.catch((err) => {
				throw err;
			});

		///////////////////////////////////////////////////////////////////////

		//UserScopeOptions
		const UserScopeOptions = models.Countries.findAll({
			attributes: ["Code", "Label", "id"],
			where: { Code: allowedCountries, IsCommissioningMarket: true },
			include: [
				{
					attributes: ["Code", "Label", "id"],
					model: models.BusinessUnits,
					where: { Code: allowedBusinessUnits },
					include: [
						{
							attributes: ["Code", "Label", "id", "NeedsSFOpportunityNumber"],
							model: models.Verticals,
							// where: { Code: allowedVerticals }, //seems to break. Only returns first associated record.
						},
					],
				},
				{ attributes: ["Code", "Label", "id"], model: models.Offices },
			],
		});

		//All Static Labels
		const StaticLabels = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			// where: { IsStaticLabel: true },
		});

		//MethodologyOptions
		const MethodologyOptions = models.Methodologies.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.Methodologies,
			include: [
				{
					attributes: ["Code", "Label", "ResearchType", "FieldType", "id"],
					model: models.SubMethodologies,
				},
			],
		});

		//FieldingCountriesOptions
		const FieldingCountriesOptions = models.Countries.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.Countries,
		});

		//CommissioningCountriesOptions
		const CommissioningCountriesOptions = models.Countries.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.Countries,
			where: { IsCommissioningMarket: true },
		});

		//OfficeOptions
		const OfficeOptions = models.Offices.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.Offices,
		});

		//BusinessUnitOptions
		const BusinessUnitOptions = models.BusinessUnits.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.BusinessUnits,
		});

		//VerticalOptions
		const VerticalOptions = models.Verticals.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.Verticals,
		});

		//UserLanguageOptions
		const UserLanguageOptions = models.CodeLabels.findAll({
			attributes: [],
			model: models.CodeLabels,
			where: { Code: "UserLanguage" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//UserRolesOptions
		const UserRolesOptions = models.CodeLabels.findAll({
			attributes: [],
			model: models.CodeLabels,
			where: { Code: "UserRoles" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//UserPermissionsOptions
		const UserPermissionsOptions = models.CodeLabels.findAll({
			attributes: [],
			model: models.CodeLabels,
			where: { Code: "UserPermissions" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//IndustryGroupOptions
		const IndustryGroupOptions = models.CodeLabels.findAll({
			attributes: [],
			model: models.CodeLabels,
			where: { Code: "IndustryGroup" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//TrackingFrequencyOptions
		const TrackingFrequencyOptions = models.CodeLabels.findAll({
			attributes: [],
			model: models.CodeLabels,
			where: { Code: "TrackingFrequency" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//ProjectStatusOptions
		const ProjectStatusOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "ProjectStatus" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//CostingStatusOptions
		const CostingStatusOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "CostingStatus" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//SearchByOptions
		const SearchByOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "SearchBy" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//StudyTypeOptions
		const StudyTypeOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "StudyType" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//LengthOfInterviewOptions
		const LengthOfInterviewOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "LengthOfInterview" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//VendorListOptions
		const VendorListOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "VendorsList" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//DataProcessingComplexityOptions
		const DataProcessingComplexityOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DataProcessingComplexity" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//ChartingComplexityOptions
		const ChartingComplexityOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "ChartingComplexity" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//QuestionnaireComplexityOptions
		const QuestionnaireComplexityOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "QuestionnaireComplexity" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//DeliveryStatusOptions
		const DeliveryStatusOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryStatus" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryDataCollectionTypeOptions
		const DeliveryDataCollectionTypeOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryDataCollectionType" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryInitialSetupCTDaysOptions
		const DeliveryInitialSetupCTDaysOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryInitialSetupCTDays" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryCostCentreOptions
		const DeliveryCostCentreOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryCostCentre" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryComplexityLevelSPOptions
		const DeliveryComplexityLevelSPOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryComplexityLevelSP" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryJobCountSPOptions
		const DeliveryJobCountSP = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryJobCountSP" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});
		//DeliveryPlatformSPOptions
		const DeliveryPlatformSPOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "DeliveryPlatformSP" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//SubMethodologyOptions
		const SubMethodologyOptions = models.SubMethodologies.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.SubMethodologies,
		});

		//IncidenceRateOptions
		const IncidenceRateOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "IncidenceRate" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//LanguageOptions
		const LanguageOptions = models.CodeLabels.findAll({
			attributes: ["Code", "Label", "id"],
			model: models.CodeLabels,
			where: { Code: "Languages" },
			include: [{ attributes: ["Code", "Label", "id"], model: models.CodeLabelOptions }],
		});

		//////////////////////////////////////////////////////////////////////

		await Promise.all([
			UserScopeOptions,
			StaticLabels,
			MethodologyOptions,
			FieldingCountriesOptions,
			CommissioningCountriesOptions,
			OfficeOptions,
			BusinessUnitOptions,
			VerticalOptions,
			UserLanguageOptions,
			UserRolesOptions,
			UserPermissionsOptions,
			IndustryGroupOptions,
			TrackingFrequencyOptions,
			ProjectStatusOptions,
			CostingStatusOptions,
			SearchByOptions,
			StudyTypeOptions,
			LengthOfInterviewOptions,
			VendorListOptions,
			DataProcessingComplexityOptions,
			ChartingComplexityOptions,
			QuestionnaireComplexityOptions,
			DeliveryStatusOptions,
			DeliveryDataCollectionTypeOptions,
			DeliveryInitialSetupCTDaysOptions,
			DeliveryCostCentreOptions,
			DeliveryComplexityLevelSPOptions,
			DeliveryJobCountSP,
			DeliveryPlatformSPOptions,
			SubMethodologyOptions,
			IncidenceRateOptions,
			LanguageOptions,
		])
			.then((queryResults) => {
				//console.log(queryResults[29]);
				initialState.UserScopeOptions = queryResults[0];
				initialState.StaticLabels = queryResults[1];
				initialState.MethodologyOptions = queryResults[2];
				initialState.FieldingCountriesOptions = queryResults[3];
				initialState.CommissioningCountriesOptions = queryResults[4];
				initialState.OfficeOptions = queryResults[5];

				let dedupedBUs = [];
				queryResults[6].map((bu) => {
					if (!dedupedBUs.some((item) => item.Code === bu.dataValues.Code)) {
						dedupedBUs.push(bu.dataValues);
					}
				});
				initialState.BusinessUnitOptions = dedupedBUs;

				let dedupedVs = [];
				queryResults[7].map((v) => {
					if (!dedupedVs.some((item) => item.Code === v.dataValues.Code)) {
						dedupedVs.push(v.dataValues);
					}
				});

				initialState.VerticalOptions = dedupedVs;
				initialState.UserLanguageOptions = queryResults[8][0]["CodeLabelOptions"];
				initialState.UserRolesOptions = queryResults[9][0]["CodeLabelOptions"];
				initialState.UserPermissionsOptions = queryResults[10][0]["CodeLabelOptions"];
				initialState.IndustryGroupOptions = queryResults[11][0]["CodeLabelOptions"];
				initialState.TrackingFrequencyOptions = queryResults[12][0]["CodeLabelOptions"];
				initialState.ProjectStatusOptions = queryResults[13][0]["CodeLabelOptions"];
				initialState.CostingStatusOptions = queryResults[14][0]["CodeLabelOptions"];
				initialState.SearchByOptions = queryResults[15][0]["CodeLabelOptions"];
				initialState.StudyTypeOptions = queryResults[16][0]["CodeLabelOptions"];
				initialState.LengthOfInterviewOptions = queryResults[17][0]["CodeLabelOptions"];
				initialState.VendorListOptions = queryResults[18][0]["CodeLabelOptions"];
				initialState.DataProcessingComplexityOptions = queryResults[19][0]["CodeLabelOptions"];
				initialState.ChartingComplexityOptions = queryResults[20][0]["CodeLabelOptions"];
				initialState.QuestionnaireComplexityOptions = queryResults[21][0]["CodeLabelOptions"];
				initialState.DeliveryStatusOptions = queryResults[22][0]["CodeLabelOptions"];
				initialState.DeliveryDataCollectionTypeOptions = queryResults[23][0]["CodeLabelOptions"];
				initialState.DeliveryInitialSetupCTDaysOptions = queryResults[24][0]["CodeLabelOptions"];
				initialState.DeliveryCostCentreOptions = queryResults[25][0]["CodeLabelOptions"];
				initialState.DeliveryComplexityLevelSPOptions = queryResults[26][0]["CodeLabelOptions"];
				initialState.DeliveryJobCountSP = queryResults[27][0]["CodeLabelOptions"];
				initialState.DeliveryPlatformSPOptions = queryResults[28][0]["CodeLabelOptions"];
				initialState.SubMethodologyOptions = queryResults[29];
				initialState.IncidenceRateOptions = queryResults[30][0]["CodeLabelOptions"];
				initialState.LanguageOptions = queryResults[31][0]["CodeLabelOptions"];
			})
			.catch((err) => {
				throw err;
			});

		//Sending initial state in response if all table fetches succeed.
		res.status(200).json({
			initialState: initialState,
			rateCards: allRateCards,

			message: "SUCCESS: Init Load Complete.",
		});
	} catch (ex) {
		res.status(500).json({
			error: ex.toString(),
			message: "ERROR: Initial App Load Failed.",
		});
	}
};

module.exports = {
	LoadConfig: LoadConfig,
};

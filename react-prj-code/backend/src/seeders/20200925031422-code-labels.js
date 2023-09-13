"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		const codeLabels = [
			{
				Code: "IndustryGroup",
				Label: "Industry Group",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "TrackingFrequency",
				Label: "Tracking Frequency",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "ProjectStatus",
				Label: "Project Status",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "SearchBy",
				Label: "Search By",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "CostingStatus",
				Label: "Costing Profile Status",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "UserRoles",
				Label: "User Roles",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "UserPermissions",
				Label: "User Permissions",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "UserLanguage",
				Label: "User Default Language",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "StudyType",
				Label: "Study Type",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "LengthOfInterview",
				Label: "Length of Interview",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "VendorsList",
				Label: "Vendors",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DataProcessingComplexity",
				Label: "Data Processing Complexity",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "ChartingComplexity",
				Label: "Charting Complexity",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "QuestionnaireComplexity",
				Label: "Questionnaire Complexity",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryStatus",
				Label: "Delivery Status",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryDataCollectionType",
				Label: "Data Collection Type",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryInitialSetupCTDays",
				Label: "Initial Setup CT Days",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryCostCentre",
				Label: "Cost Centre",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryComplexityLevelSP",
				Label: "SP ComplexityLevel",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryJobCountSP",
				Label: "SP JobCount",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "DeliveryPlatformSP",
				Label: "SP Platform",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "IncidenceRate",
				Label: "Incidence Rate",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "Languages",
				Label: "Languages",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		await queryInterface.bulkInsert("CodeLabels", codeLabels, {});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */

		await queryInterface.bulkDelete("CodeLabels", null, {});
	},
};

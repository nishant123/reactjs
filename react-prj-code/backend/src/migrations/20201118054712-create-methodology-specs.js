"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("MethodologySpecs", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			Code: {
				type: Sequelize.STRING,
			},
			Label: {
				type: Sequelize.STRING,
			},
			ParentMethodologyCode: {
				type: Sequelize.STRING,
			},
			RFQSchema: {
				type: Sequelize.TEXT("long"),
			},
			RFQData: {
				type: Sequelize.TEXT("long"),
			},
			CostsSchema: {
				type: Sequelize.TEXT("long"),
			},
			TimingsSchema: { type: Sequelize.TEXT("long") },
			TimingsData: { type: Sequelize.TEXT("long") },
			CostsData: {
				type: Sequelize.TEXT("long"),
			},
			CalculationSchema: {
				type: Sequelize.TEXT("long"),
			},
			RFQSchemaNA: { type: Sequelize.BOOLEAN },
			RFQSchemaAlternative: { type: Sequelize.TEXT },
			CountryCostBreakdown: { type: Sequelize.TEXT("long") },
			NotApplicable: { type: Sequelize.BOOLEAN },
			OpsPMHours: { type: Sequelize.DOUBLE },
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
		await queryInterface.dropTable("MethodologySpecs");
	},
};

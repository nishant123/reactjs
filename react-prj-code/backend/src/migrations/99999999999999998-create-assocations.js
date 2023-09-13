"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
	 * Add altering commands here.
	 *
	 * Example:
	 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
	 *
	 *
	 *
	//  */
		await queryInterface.addColumn("SchedulerAssignees", "MethodologySpecId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "MethodologySpecs", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("ProjectPlanners", "SpBudgetId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "SpBudgets", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("ProjectPlanners", "MethodologySpecId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "MethodologySpecs", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("SpBudgets", "MethodologySpecId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "MethodologySpecs", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("ProjectModuleDetails", "MethodologySpecId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "MethodologySpecs", key: "id" },
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.removeColumn("SchedulerAssignees", "MethodologySpecId");
		await queryInterface.removeColumn("SpBudgets", "MethodologySpecId");
		await queryInterface.removeColumn("ProjectPlanners", "SpBudgetId");
		await queryInterface.removeColumn("ProjectPlanners", "MethodologySpecId");
		await queryInterface.removeColumn("ProjectModuleDetails", "MethodologySpecId");
	},
};

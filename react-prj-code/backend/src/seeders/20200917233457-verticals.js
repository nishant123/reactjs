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

		const verticals = [
			{
				Code: "V1",
				Label: "FMCG",
				BusinessUnitId: 7,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "V1",
				Label: "FMCG",
				BusinessUnitId: 8,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "V1",
				Label: "FMCG",
				BusinessUnitId: 9,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		await queryInterface.bulkInsert("Verticals", verticals, {});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Verticals", null, {});
	},
};

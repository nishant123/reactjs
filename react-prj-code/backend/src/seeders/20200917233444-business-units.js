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

		const businessUnits = [
			{
				Code: "CI",
				Label: "Consumer Insights",
				CountryId: 126,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "CI",
				Label: "Consumer Insights",
				CountryId: 9,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				Code: "CI",
				Label: "Consumer Insights",
				CountryId: 185,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			// {
			//   Code: "NS",
			//   Label: "Nielsen Sports",
			//   CountryId: 126,
			//   IsExternal: true,
			//   createdAt: new Date(),
			//   updatedAt: new Date(),
			// },
			// {
			//   Code: "NS",
			//   Label: "Nielsen Sports",
			//   CountryId: 9,
			//   IsExternal: true,
			//   createdAt: new Date(),
			//   updatedAt: new Date(),
			// },
			// {
			//   Code: "MA",
			//   Label: "Media Analytics",
			//   CountryId: 126,
			//   IsExternal: true,
			//   createdAt: new Date(),
			//   updatedAt: new Date(),
			// },
		];
		await queryInterface.bulkInsert("BusinessUnits", businessUnits, {});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("BusinessUnits", null, {});
	},
};

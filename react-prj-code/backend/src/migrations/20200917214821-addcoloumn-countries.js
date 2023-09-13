"use strict";
module.exports = {
		up: async (queryInterface, Sequelize) => {
			await queryInterface.addColumn('Countries', 'TimeZone', {
				type: Sequelize.STRING
			});
		},
		down: async (queryInterface, Sequelize) => {
			await queryInterface.removeColumn('Countries', 'TimeZone');
		}
};

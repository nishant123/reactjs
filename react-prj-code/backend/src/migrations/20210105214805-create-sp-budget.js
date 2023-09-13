'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SpBudgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      IsTracker: {
        type: Sequelize.BOOLEAN
      },
      Wave: {
        type: Sequelize.INTEGER
      },
      CostsData: {
        type: Sequelize.TEXT("long"),
      },
      Sample: {
        type: Sequelize.INTEGER
      },
      SampleEqualyDistributed: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SpBudgets');
  }
};
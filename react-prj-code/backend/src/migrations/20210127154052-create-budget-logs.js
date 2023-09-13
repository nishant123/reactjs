'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BudgetLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BudgetId: {
        type: Sequelize.INTEGER
      },
      Data: {
        type: Sequelize.TEXT
      },
      CreatedBy: {
        type: Sequelize.STRING
      },
      CreatedAt: {
        type: Sequelize.DATE
      },
      UpdatedBy: {
        type: Sequelize.STRING
      },
      UpdatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BudgetLogs');
  }
};
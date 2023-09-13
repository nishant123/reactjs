'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SpTasksDates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PlannedDate: {
        type: Sequelize.TEXT("long"),
      },
      ActualDate: {
        type: Sequelize.TEXT("long"),
      },
      Task: {
        type: Sequelize.STRING
      },
      Version: {
        type: Sequelize.INTEGER
      },
      Comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ProjectPlannerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "ProjectPlanners", key: "id" },
        onDelete: "CASCADE",
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SpTasksDates');
  }
};
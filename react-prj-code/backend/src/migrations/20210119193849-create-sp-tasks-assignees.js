'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SpTasksAssignees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING
      },
      EmailId: {
        type: Sequelize.STRING
      },
      Task: {
        type: Sequelize.STRING
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
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SpTasksAssignees');
  }
};
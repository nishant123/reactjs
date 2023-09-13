'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProjectPlanners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProjectId: {
        type: Sequelize.STRING
      },
      ProjectName: {
        type: Sequelize.STRING
      },
      Wave: {
        type: Sequelize.INTEGER
      },
      Status: {
        type: Sequelize.STRING
      },
      IsActive: {
        type: Sequelize.BOOLEAN
      },
      IsCompleted: {
        type: Sequelize.BOOLEAN
      },
      IsChecklistUsed: {
        type: Sequelize.BOOLEAN
      },
      PlannedDateStart: {
        type: Sequelize.DATE
      },
      PlannedDateEnd: {
        type: Sequelize.DATE
      },
      ChecklistData: {
				type: Sequelize.TEXT("long"),
			},
      ChecklistSchema: {
				type: Sequelize.TEXT("long"),
			},
      TaskslistData: {
				type: Sequelize.TEXT("long"),
			},
      TaskslistSchema: {
				type: Sequelize.TEXT("long"),
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
    await queryInterface.dropTable('ProjectPlanners');
  }
};
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProjectPlannerFolders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      FolderId: {
        type: Sequelize.STRING
      },
      ParentFolderId: {
        type: Sequelize.STRING
      },
      MethodologySpecId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "MethodologySpecs", key: "id" },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable('ProjectPlannerFolders');
  }
};
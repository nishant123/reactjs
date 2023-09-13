"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OpportunityContactTeamDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ContactName: {
        type: Sequelize.STRING,
      },
      EmailAddress: {
        type: Sequelize.STRING,
      },
      Firstname: {
        type: Sequelize.STRING,
      },
      Isprimary: {
        type: Sequelize.BOOLEAN,
      },
      Role: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("OpportunityContactTeamDetails");
  },
};

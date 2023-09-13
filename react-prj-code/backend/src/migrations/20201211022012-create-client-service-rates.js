"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ClientServiceRates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProfileName: {
        type: Sequelize.STRING,
      },
      ExecutiveDirector: {
        type: Sequelize.DOUBLE,
      },
      Director: {
        type: Sequelize.DOUBLE,
      },
      AssociateDirector: {
        type: Sequelize.DOUBLE,
      },
      SeniorManager: {
        type: Sequelize.DOUBLE,
      },
      Manager: {
        type: Sequelize.DOUBLE,
      },
      SeniorExecutive: {
        type: Sequelize.DOUBLE,
      },
      Executive: {
        type: Sequelize.DOUBLE,
      },
      DatascienceInternalComm: {
        type: Sequelize.DOUBLE,
      },
      IsDefault: {
        type: Sequelize.BOOLEAN,
      },
      CreatedBy: {
        type: Sequelize.STRING,
      },
      UpdatedBy: {
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
    await queryInterface.dropTable("ClientServiceRates");
  },
};

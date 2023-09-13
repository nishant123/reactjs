"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ContractDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      AccountName: {
        type: Sequelize.STRING,
      },
      Amount: {
        type: Sequelize.DOUBLE,
      },
      AmountCurrency: {
        type: Sequelize.STRING,
      },
      AmountUSD: {
        type: Sequelize.DOUBLE,
      },
      CloseDate: {
        type: Sequelize.DATE,
      },
      ContractType: {
        type: Sequelize.STRING,
      },
      CreatedDate: {
        type: Sequelize.DATE,
      },
      EndofDelivery: {
        type: Sequelize.DATE,
      },
      Industry: { type: Sequelize.STRING },
      LastModifiedDate: {
        type: Sequelize.DATE,
      },
      OpportunityID: {
        type: Sequelize.STRING,
      },
      OpportunityName: {
        type: Sequelize.STRING,
      },
      OpportunityNumber: {
        type: Sequelize.STRING,
      },
      OpportunityOwnerName: {
        type: Sequelize.STRING,
      },
      OpportunityOwnerEmail: {
        type: Sequelize.STRING,
      },
      OpportunityRecordType: {
        type: Sequelize.STRING,
      },
      OwnerRole: {
        type: Sequelize.STRING,
      },
      Probability: {
        type: Sequelize.DOUBLE,
      },
      SalesOrgName: {
        type: Sequelize.STRING,
      },
      SalesOrgcode: {
        type: Sequelize.STRING,
      },
      Stage: {
        type: Sequelize.STRING,
      },
      StartofDelivery: {
        type: Sequelize.DATE,
      },
      errorMessage: {
        type: Sequelize.STRING,
      },
      isClosed: { type: Sequelize.BOOLEAN },
      isDev: { type: Sequelize.BOOLEAN },
      successMessage: {
        type: Sequelize.STRING,
      },
      isSF: { type: Sequelize.BOOLEAN },
      ContractNumber: { type: Sequelize.INTEGER },

      // TotalThirdPartyCost: {
      //   type: Sequelize.DOUBLE,
      // },
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
    await queryInterface.dropTable("ContractDetails");
  },
};

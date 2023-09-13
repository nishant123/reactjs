"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OpportunityLineItemDetails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      GLAccount: {
        type: Sequelize.STRING,
      },
      MaterialID: {
        type: Sequelize.STRING,
      },
      OpportunityLineItemID: {
        type: Sequelize.STRING,
      },
      PracticeArea: {
        type: Sequelize.STRING,
      },
      ProductDescription: {
        type: Sequelize.STRING,
      },
      ProfitCentre: {
        type: Sequelize.STRING,
      },
      ProjectID: {
        type: Sequelize.STRING,
      },
      SubBrand: {
        type: Sequelize.STRING,
      },
      SubtotalUSD: {
        type: Sequelize.DOUBLE,
      },
      TotalPriceUSD: {
        type: Sequelize.DOUBLE,
      },
      WBSNumber: {
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
    await queryInterface.dropTable("OpportunityLineItemDetails");
  },
};

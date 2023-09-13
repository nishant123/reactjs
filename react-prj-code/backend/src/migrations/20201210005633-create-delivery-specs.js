"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("DeliverySpecs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProgrammerAssigned: {
        type: Sequelize.STRING,
      },
      GroupLeadEmail: {
        type: Sequelize.STRING,
      },
      InitialSetupCTDays: {
        type: Sequelize.STRING,
      },
      ComplexityLevel: {
        type: Sequelize.STRING,
      },
      ChangesBeforeInitialLinkDelivery: {
        type: Sequelize.DOUBLE,
      },
      NumberOfQuestions: {
        type: Sequelize.DOUBLE,
      },
      ChangesToUniqueQuestions: {
        type: Sequelize.DOUBLE,
      },
      NumberOfPids: {
        type: Sequelize.DOUBLE,
      },
      ChangesAfterInitialLinkDelivery: {
        type: Sequelize.DOUBLE,
      },
      NumberOfIterations: {
        type: Sequelize.DOUBLE,
      },
      ErrorsInInitialLinkDelivery: {
        type: Sequelize.DOUBLE,
      },
      ErrorsAfterInitialLinkDelivery: {
        type: Sequelize.DOUBLE,
      },
      JobCount: {
        type: Sequelize.STRING,
      },
      PlatformProjectId: {
        type: Sequelize.STRING,
      },
      ChangesAfterLiveLinkCreated: {
        type: Sequelize.DOUBLE,
      },
      ErrorsAfterLiveLinkCreated: {
        type: Sequelize.DOUBLE,
      },
      TotalNumberOfIterations: {
        type: Sequelize.DOUBLE,
      },
      ActualLOIMins: {
        type: Sequelize.DOUBLE,
      },
      TotalCompletes: {
        type: Sequelize.DOUBLE,
      },
      CancelledDate: {
        type: Sequelize.DATE,
      },
      ReasonForCancellation: {
        type: Sequelize.TEXT("long"),
      },
      Platform: {
        type: Sequelize.STRING,
      },
      DataCollectionMethod: {
        type: Sequelize.STRING,
      },
      CostCentre: {
        type: Sequelize.STRING,
      },
      DeliveryStatus: {
        type: Sequelize.STRING,
      },
      DataCollectionMethodOther: {
        type: Sequelize.STRING,
      },
      ChangesToUniqueQuestionsNA: {
        type: Sequelize.BOOLEAN,
      },
      LiveSurveyProjectId: {
        type: Sequelize.TEXT,
      },
      TestSurveyProjectId: {
        type: Sequelize.TEXT,
      },
      ProjectDeliveryNumber: { type: Sequelize.STRING },
      IsInternalDelivery: { type: Sequelize.BOOLEAN },
      IsDecommissionedFixed: { type: Sequelize.BOOLEAN },
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
    await queryInterface.dropTable("DeliverySpecs");
  },
};

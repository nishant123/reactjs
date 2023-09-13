"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const forms = [
      // {
      //   Code: "FM000002",
      //   Label: "OFFLINE - DOOR TO DOOR",
      //   VerticalId: 1,
      //   RFQSchema: "",
      //   CostSchema: "",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   Code: "FM000002",
      //   Label: "OFFLINE - DOOR TO DOOR",
      //   VerticalId: 2,
      //   RFQSchema: "",
      //   CostSchema: "",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
      // {
      //   Code: "FM000002",
      //   Label: "OFFLINE - DOOR TO DOOR",
      //   VerticalId: 3,
      //   RFQSchema: "",
      //   CostSchema: "",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ];
    await queryInterface.bulkInsert("FormLayouts", forms, {});
  },

  down: async (queryInterface, Sequelize) => {
    //Add commands to revert seed here.

    await queryInterface.bulkDelete("FormLayouts", null, {});
  },
};

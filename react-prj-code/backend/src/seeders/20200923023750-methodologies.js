"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const methodologies = [
      {
        Code: "FM000040",
        Label: "ONLINE QUANTITATIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000011",
        Label: "ONLINE QUALITATIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000036",
        Label: "ONLINE CLT SELF ADMINISTRATED",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000001",
        Label: "OFFLINE CENTRAL LOCATION",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000002",
        Label: "OFFLINE - DOOR TO DOOR / OTHERS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000004",
        Label: "OFFLINE - QUALITATIVE FOCUS GROUPS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000005",
        Label: "OFFLINE - QUALITATIVE IN DEPTH INTERVIEWS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000010",
        Label: "OFFLINE - TELEPHONE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000009",
        Label: "OFFLINE - QUALITATIVE OTHERS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000006",
        Label: "CLIENT DATABASE - MAIL",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000019",
        Label: "SEQUENTIAL MIXED METHODOLOGY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000007",
        Label: "MYSTERY SHOPPER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000041",
        Label: "EYE TRACKING",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000043",
        Label: "VIRTUAL STORE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000047",
        Label: "SMARTSTORE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000048",
        Label: "PATH TRACKING",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000012",
        Label: "NO FIELDWORK - REPORTING ONLY",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "FM000008",
        Label: "OTHER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Methodologies", methodologies, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Methodologies", null, {});
  },
};

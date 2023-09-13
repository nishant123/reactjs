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
    const offices = [
      {
        Code: "NZ1",
        Label: "Auckland",
        CountryId: 126,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "NZ2",
        Label: "Wellington",
        CountryId: 126,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AU1",
        Label: "Sydney",
        CountryId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AU2",
        Label: "Melbourne",
        CountryId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Code: "AE1",
        Label: "Sharjah",
        CountryId: 185,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Offices", offices, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Offices", null, {});
  },
};

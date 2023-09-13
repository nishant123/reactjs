"use strict";

const faker = require("faker");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // const items = generateProjectRows(100);
    // await queryInterface.bulkInsert(
    //   "Projects",
    //   items,
    //   {}
    // );
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete("Projects", null, {});
  },
};

function generateProjectRows(rowsCount) {
  const data = [];
  for (let i = 0; i < rowsCount; i++) {
    let countryCode = faker.random.arrayElement(["NZ", "AU", "JP"]);
    const newItem = {
      ProjectId: countryCode + "000" + (i + 1).toString(),
      ProjectName: faker.company.companyName(),
      BusinessUnit: "CI",
      CommissioningCountry: countryCode,
      CommissioningOffice:
        countryCode + faker.random.arrayElement(["1", "2", "3"]),
      IndustryVertical: "Auto",
      ProjectCreator: faker.internet.email(),
      ProjectCreatorName: faker.name.findName(),
      Methodology: faker.random.arrayElement(["FM23001", "FM00302", "FM34003"]),
      createdAt: faker.date.recent(10),
      updatedAt: faker.date.recent(3),
    };
    data.push(newItem);
  }
  return data;
}

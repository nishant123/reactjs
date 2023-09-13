"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CharacteristicValues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Z_MULTI_COUNTRY: {
        type: Sequelize.TEXT,
        get() {
          return this.getDataValue("Z_MULTI_COUNTRY").split(",");
        },
        set(val) {
          this.setDataValue("Z_MULTI_COUNTRY", val.join(","));
        },
      },
      Z_FREQUENCY: {
        type: Sequelize.TEXT,
        get() {
          return this.getDataValue("Z_FREQUENCY").split(",");
        },
        set(val) {
          this.setDataValue("Z_FREQUENCY", val.join(","));
        },
      },
      Z_FIELDINGMETHOD: {
        type: Sequelize.TEXT,
        get() {
          return this.getDataValue("Z_FIELDINGMETHOD").split(",");
        },
        set(val) {
          this.setDataValue("Z_FIELDINGMETHOD", val.join(","));
        },
      },
      Z_DATATYPE: {
        type: Sequelize.TEXT,
        get() {
          return this.getDataValue("Z_DATATYPE").split(",");
        },
        set(val) {
          this.setDataValue("Z_DATATYPE", val.join(";"));
        },
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
    await queryInterface.dropTable("CharacteristicValues");
  },
};

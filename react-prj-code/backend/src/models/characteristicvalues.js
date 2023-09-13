"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CharacteristicValues extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CharacteristicValues.belongsTo(models.OpportunityLineItemDetails);
    }
  }
  CharacteristicValues.init(
    {
      // Z_MULTI_COUNTRY: DataTypes.TEXT,
      // Z_FREQUENCY: DataTypes.TEXT,
      // Z_FIELDINGMETHOD: DataTypes.TEXT,
      // Z_DATATYPE: DataTypes.TEXT,
      Z_MULTI_COUNTRY: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue("Z_MULTI_COUNTRY").split(",");
        },
        set(val) {
          this.setDataValue("Z_MULTI_COUNTRY", val.join(","));
        },
      },
      Z_FREQUENCY: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue("Z_FREQUENCY").split(",");
        },
        set(val) {
          this.setDataValue("Z_FREQUENCY", val.join(","));
        },
      },
      Z_FIELDINGMETHOD: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue("Z_FIELDINGMETHOD").split(",");
        },
        set(val) {
          this.setDataValue("Z_FIELDINGMETHOD", val.join(","));
        },
      },
      Z_DATATYPE: {
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue("Z_DATATYPE").split(",");
        },
        set(val) {
          this.setDataValue("Z_DATATYPE", val.join(";"));
        },
      },
    },
    {
      sequelize,
      modelName: "CharacteristicValues",
    }
  );
  return CharacteristicValues;
};

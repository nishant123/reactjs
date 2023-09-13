"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CodeLabelOptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CodeLabelOptions.belongsTo(models.CodeLabels);
    }
  }
  CodeLabelOptions.init(
    {
      Label: DataTypes.STRING,
      Code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CodeLabelOptions",
    }
  );
  return CodeLabelOptions;
};

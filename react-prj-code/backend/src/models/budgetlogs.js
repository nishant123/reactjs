'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BudgetLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BudgetLogs.init({
    CreatedBy: DataTypes.STRING,
    CreatedAt: DataTypes.DATE,
    UpdatedBy: DataTypes.STRING,
    UpdatedAt: DataTypes.DATE,
    Data: DataTypes.TEXT,
    BudgetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BudgetLogs',
    timestamps: false
  });
  return BudgetLogs;
};
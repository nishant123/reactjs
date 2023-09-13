'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpBudget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpBudget.belongsTo(models.MethodologySpecs);
      SpBudget.hasOne(models.ProjectPlanner, { foreignKey: "SpBudgetId" });
    }
  };
  SpBudget.init({
    IsTracker: DataTypes.BOOLEAN,
    Wave: DataTypes.NUMBER,
    CostsData: {
      type: DataTypes.TEXT("long"),
      get() {
        const val = this.getDataValue("CostsData");
        return JSON.parse(val);
      },
    },
    Sample: DataTypes.INTEGER,
    SampleEqualyDistributed: DataTypes.BOOLEAN,
    MethodologySpecId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SpBudget',
  });
  return SpBudget;
};
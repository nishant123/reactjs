'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpTasksDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SpTasksDate.belongsTo(models.ProjectPlanner);
    }
  };
  SpTasksDate.init({
    PlannedDate: {
      type: DataTypes.TEXT("long"),
      get() {
        const val = this.getDataValue("PlannedDate");
        return val ? JSON.parse(val) : val;
      },
    },
    ActualDate: {
      type: DataTypes.TEXT("long"),
      get() {
        const val = this.getDataValue("ActualDate");
        return val ? JSON.parse(val) : val;
      },
    },
    Task: DataTypes.STRING,
    Comment: DataTypes.TEXT,
    ProjectPlannerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SpTasksDate',
  });
  return SpTasksDate;
};
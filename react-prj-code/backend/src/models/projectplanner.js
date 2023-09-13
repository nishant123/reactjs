'use strict';
const {
  Model
} = require('sequelize');
const checklistSchema = require('../config/formSchemas/default/checklistSchema/default.json');
const taskslistSchema = require('../config/formSchemas/default/taskslistSchema/default.json');
module.exports = (sequelize, DataTypes) => {
  class ProjectPlanner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectPlanner.belongsTo(models.MethodologySpecs);
      ProjectPlanner.belongsTo(models.SpBudget);
      ProjectPlanner.hasMany(models.SpTasksAssignees);
      ProjectPlanner.hasMany(models.SpTasksDate);
    }
  };
  ProjectPlanner.init({
    ProjectId: DataTypes.STRING,
    ProjectName: DataTypes.STRING,
    Wave: DataTypes.INTEGER,
    Status: {
      type: DataTypes.STRING,
      defaultValue: function() {
        return 'AWAITING COMMISSIONING';
      }
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: function() {
        return false;
      }
    },
    IsCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: function() {
        return false;
      }
    },
    IsChecklistUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: function() {
        return false;
      }
    },
    ChecklistData: {
      type: DataTypes.TEXT("long"),
      get() {
        const val = this.getDataValue("ChecklistData");
        return val ? JSON.parse(val) : val;
      },
    },
    ChecklistSchema: {
      type: DataTypes.TEXT("long"),
      defaultValue: function() {
        return JSON.stringify(checklistSchema);
      },
      get() {
        const val = this.getDataValue("ChecklistSchema");
        return val ? JSON.parse(val) : val;
      },
    },
    TaskslistData: {
      type: DataTypes.TEXT("long"),
      get() {
        const val = this.getDataValue("TaskslistData");
        return val ? JSON.parse(val) : val;
      },
    },
    TaskslistSchema: {
      type: DataTypes.TEXT("long"),
      defaultValue: function() {
        return JSON.stringify(taskslistSchema);
      },
      get() {
        const val = this.getDataValue("TaskslistSchema");
        return val ? JSON.parse(val) : val;
      },
    },
    PlannedDateStart: DataTypes.DATE,
    PlannedDateEnd: DataTypes.DATE,
    MethodologySpecId: DataTypes.INTEGER,
    SpBudgetId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProjectPlanner',
  });
  return ProjectPlanner;
};
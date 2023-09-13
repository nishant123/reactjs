'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpTasksAssignees extends Model {

    static associate(models) {
      SpTasksAssignees.belongsTo(models.ProjectPlanner);
    }

  };
  SpTasksAssignees.init({
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    Name: DataTypes.STRING,
    EmailId: DataTypes.STRING,
    Task: DataTypes.STRING,
    ProjectPlannerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'SpTasksAssignees',
  });
  return SpTasksAssignees;
};
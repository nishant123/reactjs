'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectModuleDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectModuleDetail.belongsTo(models.MethodologySpecs);
    }
  };
  ProjectModuleDetail.init({
    Action: DataTypes.STRING,
    CreatedBy: DataTypes.STRING,
    Comment: DataTypes.STRING,
    Reason: DataTypes.STRING,
    MethodologySpecId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ProjectModuleDetail',
  });
  return ProjectModuleDetail;
};
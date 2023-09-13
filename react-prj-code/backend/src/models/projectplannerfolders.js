'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectPlannerFolders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			ProjectPlannerFolders.belongsTo(models.MethodologySpecs);
    }
  };
  ProjectPlannerFolders.init({
    ParentFolderId: DataTypes.STRING,
    FolderId: DataTypes.STRING,
    MethodologySpecId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProjectPlannerFolders',
  });
  return ProjectPlannerFolders;
};
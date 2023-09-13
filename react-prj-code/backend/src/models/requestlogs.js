"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RequestLogs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RequestLogs.belongsTo(models.Requests);
    }
  }
  RequestLogs.init(
    {
      CommentOwnerEmail: DataTypes.STRING,
      Comment: DataTypes.TEXT("long"),
      IsNotification: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "RequestLogs",
    }
  );
  return RequestLogs;
};

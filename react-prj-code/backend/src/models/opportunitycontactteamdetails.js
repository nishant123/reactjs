"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OpportunityContactTeamDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpportunityContactTeamDetails.belongsTo(models.ContractDetails);
    }
  }
  OpportunityContactTeamDetails.init(
    {
      ContactName: DataTypes.STRING,
      EmailAddress: DataTypes.STRING,
      Firstname: DataTypes.STRING,
      Isprimary: DataTypes.BOOLEAN,
      Role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OpportunityContactTeamDetails",
    }
  );
  return OpportunityContactTeamDetails;
};

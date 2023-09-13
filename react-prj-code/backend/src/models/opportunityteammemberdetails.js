"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OpportunityTeamMemberDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpportunityTeamMemberDetails.belongsTo(models.ContractDetails);
    }
  }
  OpportunityTeamMemberDetails.init(
    {
      Names: DataTypes.STRING,
      EmailAddresses: DataTypes.STRING,
      TeamMemberRoles: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OpportunityTeamMemberDetails",
    }
  );
  return OpportunityTeamMemberDetails;
};

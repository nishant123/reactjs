"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OpportunityLineItemDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpportunityLineItemDetails.belongsTo(models.ContractDetails);
      OpportunityLineItemDetails.hasMany(models.CharacteristicValues);
    }
  }
  OpportunityLineItemDetails.init(
    {
      GLAccount: DataTypes.STRING,
      MaterialID: DataTypes.STRING,
      OpportunityLineItemID: DataTypes.STRING,
      PracticeArea: DataTypes.STRING,
      ProductDescription: DataTypes.STRING,
      ProfitCentre: DataTypes.STRING,
      ProjectID: DataTypes.STRING,
      SubBrand: DataTypes.STRING,
      SubtotalUSD: DataTypes.DOUBLE,
      TotalPriceUSD: DataTypes.DOUBLE,
      WBSNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OpportunityLineItemDetails",
    }
  );
  return OpportunityLineItemDetails;
};

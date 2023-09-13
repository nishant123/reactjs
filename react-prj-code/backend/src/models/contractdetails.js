"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ContractDetails extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ContractDetails.hasMany(models.OpportunityContactTeamDetails, {
				as: "opportunityContactTeamDetails",
			});
			ContractDetails.hasMany(models.OpportunityLineItemDetails, {
				as: "opportunityLineItemDetails",
			});
			ContractDetails.hasMany(models.OpportunityTeamMemberDetails, {
				as: "opportunityTeamMemberDetails",
			});
			ContractDetails.belongsTo(models.Projects);
		}
	}
	ContractDetails.init(
		{
			AccountName: DataTypes.STRING,
			Amount: DataTypes.DOUBLE,
			AmountCurrency: DataTypes.STRING, //Match model and migration with SF API result. repeat for associations.
			AmountUSD: DataTypes.DOUBLE,
			CloseDate: DataTypes.DATE,
			ContractType: DataTypes.STRING,
			CreatedDate: DataTypes.DATE,
			EndofDelivery: DataTypes.DATE,
			Industry: DataTypes.STRING,
			LastModifiedDate: DataTypes.DATE,
			OpportunityID: DataTypes.STRING,
			OpportunityName: DataTypes.STRING,
			OpportunityNumber: DataTypes.STRING,
			OpportunityOwnerEmail: DataTypes.STRING,
			OpportunityOwnerName: DataTypes.STRING,
			OpportunityRecordType: DataTypes.STRING,
			OwnerRole: DataTypes.STRING,
			Probability: DataTypes.DOUBLE,
			SalesOrgName: DataTypes.STRING,
			SalesOrgcode: DataTypes.STRING,
			Stage: DataTypes.STRING,
			StartofDelivery: DataTypes.DATE,
			errorMessage: DataTypes.STRING,
			isClosed: DataTypes.BOOLEAN,
			isDev: DataTypes.BOOLEAN,
			successMessage: DataTypes.STRING,
			isSF: DataTypes.BOOLEAN,
			ContractNumber: DataTypes.INTEGER,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,

			//TotalThirdPartyCost: DataTypes.DOUBLE,
		},
		{
			sequelize,
			modelName: "ContractDetails",
		}
	);

	ContractDetails.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	ContractDetails.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return ContractDetails;
};

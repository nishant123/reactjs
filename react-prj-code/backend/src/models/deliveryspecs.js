"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class DeliverySpecs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			DeliverySpecs.belongsTo(models.WaveSpecs);
		}
	}
	DeliverySpecs.init(
		{
			ProgrammerAssigned: DataTypes.STRING,
			GroupLeadEmail: DataTypes.STRING,
			InitialSetupCTDays: DataTypes.STRING,
			ComplexityLevel: DataTypes.STRING,
			ChangesBeforeInitialLinkDelivery: DataTypes.DOUBLE,
			NumberOfQuestions: DataTypes.DOUBLE,
			ChangesToUniqueQuestions: DataTypes.DOUBLE,
			NumberOfPids: DataTypes.DOUBLE,
			ChangesAfterInitialLinkDelivery: DataTypes.DOUBLE,
			NumberOfIterations: DataTypes.DOUBLE,
			ErrorsInInitialLinkDelivery: DataTypes.DOUBLE,
			ErrorsAfterInitialLinkDelivery: DataTypes.DOUBLE,
			JobCount: DataTypes.STRING,
			PlatformProjectId: DataTypes.STRING,
			ChangesAfterLiveLinkCreated: DataTypes.DOUBLE,
			ErrorsAfterLiveLinkCreated: DataTypes.DOUBLE,
			TotalNumberOfIterations: DataTypes.DOUBLE,
			ActualLOIMins: DataTypes.DOUBLE,
			TotalCompletes: DataTypes.DOUBLE,
			CancelledDate: DataTypes.DATE,
			ReasonForCancellation: DataTypes.TEXT("long"),
			Platform: DataTypes.STRING,
			DataCollectionMethod: DataTypes.STRING,
			CostCentre: DataTypes.STRING,
			DeliveryStatus: DataTypes.STRING,
			DataCollectionMethodOther: DataTypes.STRING,
			ChangesToUniqueQuestionsNA: DataTypes.BOOLEAN,
			LiveSurveyProjectId: DataTypes.TEXT,
			TestSurveyProjectId: DataTypes.TEXT,
			ProjectDeliveryNumber: DataTypes.STRING,
			IsInternalDelivery: DataTypes.BOOLEAN,
			IsDecommissionedFixed: DataTypes.BOOLEAN,

			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "DeliverySpecs",
		}
	);

	DeliverySpecs.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	DeliverySpecs.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	return DeliverySpecs;
};

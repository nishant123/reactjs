"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class MethodologySpecs extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			MethodologySpecs.belongsTo(models.CountrySpecs);
			MethodologySpecs.hasMany(models.SpBudget);
			MethodologySpecs.hasMany(models.ProjectPlanner);
			MethodologySpecs.hasMany(models.SchedulerAssignees);
			MethodologySpecs.hasMany(models.ProjectModuleDetail);
			MethodologySpecs.hasMany(models.ProjectPlannerFolders);
		}
	}
	MethodologySpecs.init(
		{
			Code: DataTypes.STRING,
			ParentMethodologyCode: DataTypes.STRING,
			Label: DataTypes.STRING,
			NotApplicable: DataTypes.BOOLEAN,
			RFQSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("RFQSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			RFQData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("RFQData");
					return val ? JSON.parse(val) : val;
				},
			},
			CostsSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CostsSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			CostsData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CostsData");
					return val ? JSON.parse(val) : val;
				},
			},
			TimingsData: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("TimingsData");
					return val ? JSON.parse(val) : val;
				},
			},
			TimingsSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("TimingsSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			CalculationSchema: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CalculationSchema");
					return val ? JSON.parse(val) : val;
				},
			},
			CountryCostBreakdown: {
				type: DataTypes.TEXT("long"),
				get() {
					const val = this.getDataValue("CountryCostBreakdown");
					return val ? JSON.parse(val) : val;
				},
			},
			RFQSchemaNA: DataTypes.BOOLEAN,
			RFQSchemaAlternative: DataTypes.TEXT,
			OpsPMHours: DataTypes.DOUBLE,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "MethodologySpecs",
		}
	);

	MethodologySpecs.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	MethodologySpecs.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	// MethodologySpecs.addHook("beforeUpdate", (instance, options) => {
	//   try {
	//     console.log(instance);
	//     instance.RFQSchema = instance.RFQSchema
	//       ? JSON.stringify(instance.RFQSchema)
	//       : null;
	//     instance.RFQData = instance.RFQData
	//       ? JSON.stringify(instance.RFQData)
	//       : null;
	//     instance.CostsSchema = instance.CostsSchema
	//       ? JSON.stringify(instance.CostsSchema)
	//       : null;
	//     instance.CostsData = instance.CostsData
	//       ? JSON.stringify(instance.CostsData)
	//       : null;
	//     console.log(instance);
	//   } catch (ex) {
	//     console.error(ex);
	//     throw ex;
	//   }
	// });

	return MethodologySpecs;
};

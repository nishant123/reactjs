"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Methodologies extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Methodologies.hasMany(models.SubMethodologies);
		}
	}
	Methodologies.init(
		{
			Code: DataTypes.STRING,
			Label: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			UpdatedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Methodologies",
		}
	);
	Methodologies.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	Methodologies.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});
	return Methodologies;
};

"use strict";
const { Model } = require("sequelize");
const dbHelpers = require("../utils/dbhelpers");

module.exports = (sequelize, DataTypes) => {
    class SchedulerAssignees extends Model {
        static associate(models) {
            // define association here
            SchedulerAssignees.belongsTo(models.MethodologySpecs);
        }
    }
    SchedulerAssignees.init(
        {
            Email: DataTypes.STRING,
            Role: DataTypes.STRING,
            OtherNotes: DataTypes.TEXT,
            IsAccepted: DataTypes.BOOLEAN,
            MethodologySpecId: DataTypes.INTEGER,
            AddedBy: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "SchedulerAssignees",
        }
    )
    return SchedulerAssignees;
}
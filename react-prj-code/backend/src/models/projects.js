"use strict";
const { Model } = require("sequelize");
const dbHelpers = require("../utils/dbhelpers");
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Projects.hasMany(models.ContractDetails);
      Projects.hasMany(models.CostingProfiles);
    }
  }
  Projects.init(
    {
      ProjectId: DataTypes.STRING,
      CreatedBy: DataTypes.STRING,
      UpdatedBy: DataTypes.STRING,
      ProjectName: DataTypes.TEXT,
      BusinessUnit: DataTypes.STRING,
      IndustryVertical: DataTypes.STRING,
      CommissioningCountry: DataTypes.STRING,
      CommissioningOffice: DataTypes.STRING,
      IsSyndicated: DataTypes.BOOLEAN,
      ProjectStatus: DataTypes.STRING,
      ScheduleStatus: DataTypes.STRING,
      ProposalOwnerEmail: {
        type: DataTypes.STRING,
        get() {
          const val = this.getDataValue("ProposalOwnerEmail");
          return dbHelpers.StringToObj(val);
        },
        set(val) {
          this.setDataValue("ProposalOwnerEmail", dbHelpers.ObjToString(val));
        },
      },
      OtherProjectTeamContacts: {
        type: DataTypes.TEXT,
        get() {
          const val = this.getDataValue("OtherProjectTeamContacts");
          return dbHelpers.StringToMulti(val);
        },
        set(val) {
          this.setDataValue(
            "OtherProjectTeamContacts",
            dbHelpers.MultiToString(val)
          );
        },
      },
      ProjectResourcesFolderId: DataTypes.STRING,
      CostingsFolderId: DataTypes.STRING,
      CommissionedProfileId: DataTypes.INTEGER,
      CommissionedBy: DataTypes.STRING,
      IsDeleted: DataTypes.BOOLEAN,
      ProjectManagerEmail: DataTypes.STRING,
      LastRefreshSF: DataTypes.DATE,
      IsSFContactSyncPaused: DataTypes.BOOLEAN,
      IsGdriveActionActive: DataTypes.BOOLEAN,
      IsRestrictedProject: DataTypes.BOOLEAN,
      IsImportedProject: DataTypes.BOOLEAN,
      VerticalId: DataTypes.INTEGER,
      BusinessUnitId: DataTypes.INTEGER,
      ProjectBackground: {
        type: DataTypes.TEXT("long"),
        set(val) {
          this.setDataValue(
            "ProjectBackground",
            dbHelpers.EmptyStringToNull(val)
          );
        },
	  },
	  ProjectBackground: {
		type: DataTypes.TEXT("long"),
		set(val) {
			this.setDataValue(
				"ProjectBackground",
				dbHelpers.EmptyStringToNull(val)
			);
		},
	},
      ResearchObjectives: {
        type: DataTypes.TEXT("long"),
        set(val) {
          this.setDataValue(
            "ResearchObjectives",
            dbHelpers.EmptyStringToNull(val)
          );
        },
      },
      LeadCostingSPOC: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue(
            "LeadCostingSPOC",
            dbHelpers.EmptyStringToNull(val)
          );
        },
      },
    },
    {
      sequelize,
      modelName: "Projects",
    }
  );

	Projects.addHook("beforeCreate", (instance, options) => {
		try {
			instance.CreatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	Projects.addHook("beforeUpdate", (instance, options) => {
		try {
			instance.UpdatedBy = options.userEmail;
		} catch (ex) {
			throw ex;
		}
	});

	return Projects;
};

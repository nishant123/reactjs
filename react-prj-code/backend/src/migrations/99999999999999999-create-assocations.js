"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
	 * Add altering commands here.
	 *
	 * Example:
	 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
	 *
	 *
	 *
	//  */
		await queryInterface.addColumn("BusinessUnits", "CountryId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "Countries", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("Offices", "CountryId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "Countries", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("Verticals", "BusinessUnitId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "BusinessUnits", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("SubMethodologies", "MethodologyId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "Methodologies", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("ContractDetails", "ProjectId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "Projects", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("CostingProfiles", "ProjectId", {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: { model: "Projects", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn(
			"CharacteristicValues",
			"OpportunityLineItemDetailId",
			{
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "OpportunityLineItemDetails", key: "id" },
				onDelete: "CASCADE",
			}
		);
		await queryInterface.addColumn(
			"OpportunityLineItemDetails",
			"ContractDetailId",
			{
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "ContractDetails", key: "id" },
				onDelete: "CASCADE",
			}
		);
		await queryInterface.addColumn(
			"OpportunityTeamMemberDetails",
			"ContractDetailId",
			{
				type: "INTEGER",
				allowNull: false,
				references: { model: "ContractDetails", key: "id" },
				onDelete: "CASCADE",
			}
		);

		await queryInterface.addColumn(
			"OpportunityContactTeamDetails",
			"ContractDetailId",
			{
				type: "INTEGER",
				allowNull: false,
				references: { model: "ContractDetails", key: "id" },
				onDelete: "CASCADE",
			}
		);

		await queryInterface.addColumn("CodeLabelOptions", "CodeLabelId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CodeLabels", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("ProfileSettings", "CostingProfileId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CostingProfiles", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("WaveSpecs", "CostingProfileId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CostingProfiles", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("CountrySpecs", "CostingProfileId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CostingProfiles", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("FormLayouts", "BusinessUnitId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "BusinessUnits", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("MethodologySpecs", "CountrySpecId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CountrySpecs", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("DeliverySpecs", "WaveSpecId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "WaveSpecs", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("ClientServiceRates", "BusinessUnitId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "BusinessUnits", key: "id" },
			onDelete: "CASCADE",
		});

		await queryInterface.addColumn("Requests", "CostingProfileId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "CostingProfiles", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("RequestLogs", "RequestId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "Requests", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("ApprovalSettings", "VerticalId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "Verticals", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("ApproverContacts", "ApprovalSettingId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "ApprovalSettings", key: "id" },
			onDelete: "CASCADE",
		});
		await queryInterface.addColumn("RequestTypes", "CountryId", {
			type: "INTEGER",
			allowNull: false,
			references: { model: "Countries", key: "id" },
			onDelete: "CASCADE",
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */

		await queryInterface.removeColumn("BusinessUnits", "CountryId");
		await queryInterface.removeColumn("Offices", "CountryId");
		await queryInterface.removeColumn("Verticals", "BusinessUnitId");
		await queryInterface.removeColumn("SubMethodologies", "MethodologyId");
		await queryInterface.removeColumn("ContractDetails", "ProjectId");
		await queryInterface.removeColumn(
			"OpportunityLineItemDetails",
			"ContractDetailId"
		);
		await queryInterface.removeColumn(
			"OpportunityTeamMemberDetails",
			"ContractDetailId"
		);
		await queryInterface.removeColumn(
			"OpportunityContactTeamDetails",
			"ContractDetailId"
		);
		await queryInterface.removeColumn(
			"CharacteristicValues",
			"OpportunityLineItemDetailId"
		);
		await queryInterface.removeColumn("CodeLabelOptions", "CodeLabelId");
		await queryInterface.removeColumn("ProfileSettings", "CostingProfileId");
		await queryInterface.removeColumn("WaveSpecs", "CostingProfileId");
		await queryInterface.removeColumn("CountrySpecs", "CostingProfileId");
		await queryInterface.removeColumn("FormLayouts", "BusinessUnitId");
		await queryInterface.removeColumn("MethodologySpecs", "CountrySpecId");
		await queryInterface.removeColumn("DeliverySpecs", "WaveSpecId");
		await queryInterface.removeColumn("ClientServiceRates", "BusinessUnitId");
		await queryInterface.removeColumn("Requests", "CostingProfileId");
		await queryInterface.removeColumn("RequestLogs", "RequestId");
		await queryInterface.removeColumn("ApprovalSettings", "VerticalId");
		await queryInterface.removeColumn("ApproverContacts", "ApprovalSettingId");
		await queryInterface.removeColumn("RequestTypes", "CountryId");
	},
};

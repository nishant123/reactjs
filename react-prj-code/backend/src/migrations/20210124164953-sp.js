'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.STRING });
     */
      
      await queryInterface.addColumn("Users", "SpCountries", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("Users", "SpPermission", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("Users", "SpRole", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("Users", "IsSp", {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      });

      await queryInterface.addColumn("Users", "Manager", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("Users", "Country", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("Users", "Thumbnail", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("SchedulerAssignees", "AddedBy", {
        type: Sequelize.STRING,
        allowNull: true,
      });
      
      await queryInterface.addColumn("SchedulerAssignees", "IsAccepted", {
        type: Sequelize.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn("Users", "GoogleSub", {
        type: Sequelize.STRING,
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
		await queryInterface.removeColumn("Users", "SpCountries");
		await queryInterface.removeColumn("Users", "SpPermission");
		await queryInterface.removeColumn("Users", "SpRole");
		await queryInterface.removeColumn("Users", "IsSp");
		await queryInterface.removeColumn("Users", "Manager");
		await queryInterface.removeColumn("Users", "Country");
		await queryInterface.removeColumn("Users", "Thumbnail");
		await queryInterface.removeColumn("SchedulerAssignees", "AddedBy");
    await queryInterface.removeColumn("SchedulerAssignees", "IsAccepted");
    await queryInterface.removeColumn("Users", "GoogleSub");
  }
};

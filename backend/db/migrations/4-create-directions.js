'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('directions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      instruction: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      recipe_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recipes',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('directions');
  },
};

const { MEASURES } = require('../../libs/measures');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ingredients', {
      amount: {
        defaultValue: null,
        type: Sequelize.DOUBLE,
      },
      measure: {
        type: Sequelize.ENUM(MEASURES),
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 100,
      },
      recipe_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'recipes',
          key: 'id',
        },
      },
      food_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'foods',
          key: 'id',
        },
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('ingredients');
  },
};

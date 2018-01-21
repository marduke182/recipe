const { MEASURES } = require('../../libs/measures');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nutrition_facts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      measure: {
        type: Sequelize.ENUM(MEASURES),
        allowNull: false,
      },
      calories: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fat: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      carbohydrate: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      protein: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      amount: {
        allowNull: false,
        type: Sequelize.DOUBLE,
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

    await queryInterface.addColumn('recipes', 'nutrition_fact_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'nutrition_facts',
        key: 'id',
      },
    });
    await queryInterface.addColumn('foods', 'nutrition_fact_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'nutrition_facts',
        key: 'id',
      },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('nutrition_facts');
  },
};

const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    static associate(models) {
      Food.Recipes = Food.belongsToMany(models.Recipe, {
        through: models.Ingredient,
        as: 'recipes',
      });
    }

    static async searchByName(name = '', { limit = 2, offset = 0 } = {}) {
      return await Food.findAll({
        where: {
          name: {
            [Op.like]: `${name}%`,
          },
        },
        offset,
        limit,
      });
    }
  }

  Food.init(
    {
      name: { type: DataTypes.STRING(25), allowNull: false },
    },
    {
      modelName: 'Food',
      underscored: true,
      tableName: 'foods',
      sequelize,
    },
  );

  return Food;
};

const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.Directions = Recipe.hasMany(models.Directions, { as: 'directions' });
      Recipe.Ingredients = Recipe.belongsToMany(models.Food, {
        through: models.Ingredient,
        as: 'ingredients',
      });
      Recipe.Ingredient = models.Ingredient;
    }

    static async searchByName(name = '', { limit = 2, offset = 0 } = {}) {
      return await Recipe.findAll({
        where: {
          name: {
            [Op.like]: `${name}%`,
          },
        },
        include: [
          { association: Recipe.Directions, attributes: ['instruction'] },
          {
            association: Recipe.Ingredients,
          },
        ],
        order: [
          [Recipe.Directions, 'order'],
          [Recipe.Ingredients, Recipe.Ingredient, 'order'],
        ],
        offset,
        limit,
      });
    }

    static async createWithData({ name, description, directions, ingredients }) {
      const Food = sequelize.model('Food');

      const foodIds = ingredients.map(({ food_id }) => food_id );
      const foods = await Food.all({ where : { id: foodIds }});
      const foodsMap = foods.reduce((acc, food)=> Object.assign({}, acc, { [food.id]: food }), {});

      const ingredientsWithFood = ingredients.map(ingredient => Object.assign({}, ingredient, { food: foodsMap[ingredient.food_id]}))
      return sequelize.transaction(async transaction => {
        const recipe = await Recipe.create(
          {
            name,
            description,
            directions: directions.map((direction, index) => {
              return {
                order: index + 1,
                instruction: direction,
              }
            }),
          },
          {
            include: [Recipe.Directions],
            transaction,
          },
        );

        await Promise.all(ingredientsWithFood.map(({ food, amount, measure, order }) => recipe.addIngredient(food, { through: { amount, measure, order }, transaction })))
      });

    }
  }

  Recipe.init(
    {
      name: { type: DataTypes.STRING(25), allowNull: false },
      description: { type: DataTypes.STRING(50), allowNull: false },
    },
    {
      underscored: true,
      tableName: 'recipes',
      modelName: 'Recipe',
      sequelize,
    },
  );

  return Recipe;
};

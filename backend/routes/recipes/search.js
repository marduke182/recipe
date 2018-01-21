const { Recipe } = require('../../db/models');
const Joi = require('joi');

function recipeMapper(recipeDB) {
  const { id, name, description, directions, ingredients } = recipeDB;
  return {
    id, name, description,
    directions: directions.map(direction => direction.instruction),
    ingredients: ingredients.map(ingredient => {
      const { id, name, Ingredient: { amount, order, measure } } = ingredient;
      return {
        id,
        name,
        amount,
        order,
        measure,
      }
    })
  }
}

module.exports = {
  method: 'GET',
  path: '/recipes',
  options: {
    validate: {
      query: Joi.object({
        query: Joi.string().min(3).required(),
        offset: Joi.number().default(0),
        limit: Joi.number().max(50).default(10),
      }),
    },
    async handler(request) {
      const {
        query,
        offset,
        limit,
      } = request.query;

      const recipes = await Recipe.searchByName(query, { offset, limit });
      return { recipes: recipes.map(recipeMapper) };
    },
  },
};

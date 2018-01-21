const { Recipe } = require('../../db/models');
const { MEASURES } = require('../../libs/measures');

const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/recipes',
  options: {
    validate: {
      payload: Joi.object({
        name: Joi.string()
          .max(100)
          .required(),
        description: Joi.string()
          .min(3)
          .max(255),
        directions: Joi.array()
          .items(Joi.string().min(3))
          .required(),
        ingredients: Joi.array()
          .items(
            Joi.object({
              food_id: Joi.number().required(),
              amount: Joi.number().required(),
              order: Joi.number(),
              measure: Joi.any().allow(MEASURES),
            }).label('Ingredient'),
          )
          .required(),
      }).label('Recipe'),
    },

    async handler(request) {
      const { name, description, directions, ingredients } = request.payload;

      await Recipe.createWithData({ name, description, directions, ingredients });
      return { status: 'ok' };
    },
    response: {
      schema: Joi.object({
        status: Joi.string(),
      }),
    },
    description: 'Create Recipe',
    notes: 'Return the created recipe',
    tags: ['api', 'recipes'],
  },
};

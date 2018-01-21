const { Food } = require('../../db/models');
const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/food',
  options: {
    validate: {
      query: Joi.object({
        query: Joi.string().min(3).required(),
        offset: Joi.number().default(0),
        limit: Joi.number().max(50).default(10),
      }),
    },
    async handler(request) {
      const { query, offset, limit } = request.query;
      const food = await Food.searchByName(query, { offset, limit });
      return { food };
    },
  },
};

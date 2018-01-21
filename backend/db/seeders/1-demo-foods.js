const { Recipe, Ingredient, Food } = require('../models');
const { GRAMS, CUP, TEASPOON, OUNCE, TABLESPOON } = require('../../libs/measures');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [
      cheeseCream,
      sugar,
      lemonJuice,
      vanilla,
      flour,
      egg,
      activeDryYeast,
      extraVirginOliveOil,
      allPurposeFlour,
      kosherSalt,
      pizzaDough,
      cheesCake,
    ] = await Promise.all([
      Food.create({ name: 'Queso crema' }),
      Food.create({ name: 'Azucar' }),
      Food.create({ name: 'Jugo de Limón' }),
      Food.create({ name: 'Vainilla' }),
      Food.create({ name: 'Harina' }),
      Food.create({ name: 'Huevo' }),
      Food.create({ name: 'levadura activa seca' }),
      Food.create({ name: 'aceite de oliva extra virge' }),
      Food.create({ name: 'harina todo uso' }),
      Food.create({ name: 'kosher salt' }),
      Recipe.create(
        {
          name: 'CheeseCake',
          description: 'Salsa para pasta',
          directions: [
            {
              order: 1,
              instruction:
                'Colocar todo hasta la vainilla en orden, y esperar que se una todo bien',
            },
            {
              order: 2,
              instruction: 'colocar la harina y al los huevos',
            },
            {
              order: 3,
              instruction: 'Cocinar todo por 50 min a 180 grados centigrados o 350F',
            },
          ],
        },
        {
          include: [Recipe.Directions],
        },
      ),
      Recipe.create(
        {
          name: 'Masa para Pizza',
          description: 'Masa para Pizza',
          directions: [
            {
              order: 1,
              instruction:
                'Pour 1 1/2 cups warm water into a large bowl; sprinkle with yeast and let stand until foamy, about 5 minutes.',
            },
            {
              order: 2,
              instruction:
                'Whisk sugar, oil, and salt into yeast mixture. Add flour and stir until a sticky dough forms. Transfer dough to an oiled bowl and brush top with oil. Cover bowl with plastic wrap and set aside in a warm, draft-free place until dough has doubled in bulk, about 1 hour. Turn out onto a lightly floured work surface and gently knead 1 or 2 times before using.',
            },
            {
              order: 3,
              instruction:
                'To freeze, you can wrap the dough in plastic and freeze it in a resealable freezer bag for up to 3 months. If you plan to use it in a recipe that calls for half a batch, divide it before freezing.',
            },
          ],
        },
        {
          include: [Recipe.Directions],
        },
      ),
    ]);

    await Promise.all([
      cheesCake.addIngredient(cheeseCream, { through: { amount: 700, measure: GRAMS } }),
      cheesCake.addIngredient(sugar, { through: { amount: 1.25, measure: CUP } }),
      cheesCake.addIngredient(lemonJuice, { through: { amount: 1, measure: TEASPOON } }),
      cheesCake.addIngredient(vanilla, { through: { amount: 2, measure: TEASPOON } }),
      cheesCake.addIngredient(flour, { through: { amount: 2.25, measure: TEASPOON } }),
      cheesCake.addIngredient(egg, { through: { amount: 4 } }),

      pizzaDough.addIngredient(activeDryYeast, { through: { amount: 0.5, measure: OUNCE} }),
      pizzaDough.addIngredient(extraVirginOliveOil, { through: { amount: 0.25, measure: CUP} }),
      pizzaDough.addIngredient(allPurposeFlour, { through: { amount: 4, measure: CUP} }),
      pizzaDough.addIngredient(sugar, { through: { amount: 4, measure: TABLESPOON} }),
      pizzaDough.addIngredient(kosherSalt, { through: { amount: 4, measure: TEASPOON} }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ingredients', null, {});
    await queryInterface.bulkDelete('directions', null, {});
    await queryInterface.bulkDelete('foods', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
  },
};

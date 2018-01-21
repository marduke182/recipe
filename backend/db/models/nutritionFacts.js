const { MEASURES } = require('../../libs/measures');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class NutritionFacts extends Model {}
  NutritionFacts.init(
    {
      measure: { type: DataTypes.ENUM(MEASURES) },
      calories: { type: DataTypes.INTEGER },
      fat: { type: DataTypes.INTEGER },
      carbohydrate: { type: DataTypes.INTEGER },
      protein: { type: DataTypes.INTEGER },
      amount: { type: DataTypes.DOUBLE },
    },
    {
      underscored: true,
      tableName: 'nutrition_facts',
      modelName: 'NutritionFacts',
      sequelize,
    },
  );

  return NutritionFacts;
};

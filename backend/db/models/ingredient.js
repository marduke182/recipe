const { MEASURES } = require('../../libs/measures');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {}

  Ingredient.init(
    {
      amount: { type: DataTypes.INTEGER },
      order: { type: DataTypes.INTEGER },
      measure: { type: DataTypes.ENUM(MEASURES) },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'ingredients',
      modelName: 'Ingredient',
      sequelize,
    },
  );
  return Ingredient;
};

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Directions extends Model {}
  Directions.init(
    {
      order: { type: DataTypes.INTEGER, allowNull: false },
      instruction: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      underscored: true,
      tableName: 'directions',
      modelName: 'Directions',
      sequelize,
    },
  );

  return Directions;
};

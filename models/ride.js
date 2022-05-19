const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Ride = sequelize.define('Ride', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  fromLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  driver: {
    type: DataTypes.STRING,
    allowNull: true
  },
  passenger: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
});

module.exports = Ride;

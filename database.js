const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/acm_rides');

module.exports = sequelize;

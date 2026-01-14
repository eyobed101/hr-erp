const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('attendance_db', 'root', 'Mu@0!1Iy', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // set true if you want SQL logs
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;


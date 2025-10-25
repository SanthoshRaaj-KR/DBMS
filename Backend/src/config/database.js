const { Sequelize } = require('sequelize');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not defined');
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
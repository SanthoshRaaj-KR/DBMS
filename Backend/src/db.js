const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not defined in .env file');
  process.exit(1);
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;

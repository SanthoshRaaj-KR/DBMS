const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Clinic = sequelize.define('Clinic', {
  ClinicID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ClinicName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Address: {
    type: DataTypes.TEXT
  },
  ContactNumber: {
    type: DataTypes.STRING
  },
  Email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'Clinics',
  timestamps: true
});

module.exports = Clinic;
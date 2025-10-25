const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  DepartmentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  DepartmentName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  Description: {
    type: DataTypes.TEXT
  },
  HOD: {
    type: DataTypes.INTEGER,
    comment: 'Head of Department - Doctor ID'
  }
}, {
  tableName: 'Departments',
  timestamps: true
});

module.exports = Department;
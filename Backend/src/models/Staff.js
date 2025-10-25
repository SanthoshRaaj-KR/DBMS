
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Staff = sequelize.define('Staff', {
  StaffID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING
  },
  ContactNumber: {
    type: DataTypes.STRING
  },
  Email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  DepartmentID: {
    type: DataTypes.INTEGER
  },
  Position: {
    type: DataTypes.STRING,
    comment: 'Receptionist, Accountant, Manager, etc.'
  },
  JoiningDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Staff',
  timestamps: true
});

module.exports = Staff;

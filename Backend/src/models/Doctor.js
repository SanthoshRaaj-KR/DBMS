const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  DoctorID: {
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
  SpecializationID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DepartmentID: {
    type: DataTypes.INTEGER
  },
  LicenseNumber: {
    type: DataTypes.STRING,
    unique: true
  },
  Qualification: {
    type: DataTypes.STRING
  },
  ExperienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ConsultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  tableName: 'Doctors',
  timestamps: true
});

module.exports = Doctor;
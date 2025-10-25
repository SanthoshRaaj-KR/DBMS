
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  PrescriptionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MedicalRecordID: {
    type: DataTypes.INTEGER
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DoctorID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Medications: {
    type: DataTypes.JSONB,
    comment: 'Array of medications with dosage and duration'
  },
  Instructions: {
    type: DataTypes.TEXT
  },
  PrescriptionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ValidUntil: {
    type: DataTypes.DATEONLY
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Completed', 'Cancelled'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'Prescriptions',
  timestamps: true
});

module.exports = Prescription;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
  RecordID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DoctorID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  AppointmentID: {
    type: DataTypes.INTEGER
  },
  VisitDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  Symptoms: {
    type: DataTypes.TEXT
  },
  Diagnosis: {
    type: DataTypes.TEXT
  },
  TreatmentPlan: {
    type: DataTypes.TEXT
  },
  Notes: {
    type: DataTypes.TEXT
  },
  VitalSigns: {
    type: DataTypes.JSONB,
    comment: 'Blood Pressure, Temperature, Pulse, etc.'
  }
}, {
  tableName: 'MedicalRecords',
  timestamps: true
});

module.exports = MedicalRecord;
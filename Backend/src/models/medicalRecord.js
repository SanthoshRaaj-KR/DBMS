const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const MedicalRecord = sequelize.define('MedicalRecord', {
  RecordID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Diagnosis: { type: DataTypes.TEXT },
  Prescription: { type: DataTypes.TEXT },
  Notes: { type: DataTypes.TEXT },
  VisitDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'MedicalRecords', timestamps: true });

MedicalRecord.belongsTo(Patient, { foreignKey: 'PatientID' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'DoctorID' });

module.exports = MedicalRecord;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  AppointmentID: {
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
  ClinicID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  AppointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  AppointmentTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  Status: {
    type: DataTypes.ENUM('Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'),
    defaultValue: 'Scheduled'
  },
  Reason: {
    type: DataTypes.TEXT
  },
  Notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Appointments',
  timestamps: true
});

module.exports = Appointment;
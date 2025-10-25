const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  PatientID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  PatientNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY
  },
  Gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other')
  },
  BloodGroup: {
    type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
  },
  ContactNumber: {
    type: DataTypes.STRING,
    validate: {
      is: /^[6-9]\d{9}$/
    }
  },
  Email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  Address: {
    type: DataTypes.TEXT
  },
  EmergencyContact: {
    type: DataTypes.STRING
  },
  EmergencyContactNumber: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'Patients',
  timestamps: true,
  hooks: {
    beforeCreate: (patient) => {
      if (!patient.PatientNumber) {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        patient.PatientNumber = `PAT${timestamp}${random}`;
      }
    }
  }
});

module.exports = Patient;
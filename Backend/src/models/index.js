const sequelize = require('../config/database');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Staff = require('./Staff');
const Specialization = require('./Specialization');
const Department = require('./Department');
const Appointment = require('./Appointment');
const MedicalRecord = require('./MedicalRecord');
const Prescription = require('./Prescription');
const Billing = require('./Billing');
const Payment = require('./Payment');

// Define Relationships

// Doctor associations
Doctor.belongsTo(Specialization, { foreignKey: 'SpecializationID' });
Doctor.belongsTo(Department, { foreignKey: 'DepartmentID' });
Specialization.hasMany(Doctor, { foreignKey: 'SpecializationID' });
Department.hasMany(Doctor, { foreignKey: 'DepartmentID' });

// Staff associations
Staff.belongsTo(Department, { foreignKey: 'DepartmentID' });
Department.hasMany(Staff, { foreignKey: 'DepartmentID' });

// Appointment associations
Appointment.belongsTo(Patient, { foreignKey: 'PatientID' });
Appointment.belongsTo(Doctor, { foreignKey: 'DoctorID' });
Patient.hasMany(Appointment, { foreignKey: 'PatientID' });
Doctor.hasMany(Appointment, { foreignKey: 'DoctorID' });

// MedicalRecord associations
MedicalRecord.belongsTo(Patient, { foreignKey: 'PatientID' });
MedicalRecord.belongsTo(Doctor, { foreignKey: 'DoctorID' });
MedicalRecord.belongsTo(Appointment, { foreignKey: 'AppointmentID' });
Patient.hasMany(MedicalRecord, { foreignKey: 'PatientID' });
Doctor.hasMany(MedicalRecord, { foreignKey: 'DoctorID' });
Appointment.hasMany(MedicalRecord, { foreignKey: 'AppointmentID' });

// Prescription associations
Prescription.belongsTo(MedicalRecord, { foreignKey: 'MedicalRecordID' });
Prescription.belongsTo(Patient, { foreignKey: 'PatientID' });
Prescription.belongsTo(Doctor, { foreignKey: 'DoctorID' });
MedicalRecord.hasMany(Prescription, { foreignKey: 'MedicalRecordID' });
Patient.hasMany(Prescription, { foreignKey: 'PatientID' });
Doctor.hasMany(Prescription, { foreignKey: 'DoctorID' });

// Billing associations
Billing.belongsTo(Patient, { foreignKey: 'PatientID' });
Billing.belongsTo(Appointment, { foreignKey: 'AppointmentID' });
Patient.hasMany(Billing, { foreignKey: 'PatientID' });
Appointment.hasOne(Billing, { foreignKey: 'AppointmentID' });

// Payment associations
Payment.belongsTo(Billing, { foreignKey: 'BillingID' });
Billing.hasMany(Payment, { foreignKey: 'BillingID', as: 'Payments' });

module.exports = {
  sequelize,
  Patient,
  Doctor,
  Staff,
  Specialization,
  Department,
  Appointment,
  MedicalRecord,
  Prescription,
  Billing,
  Payment
};
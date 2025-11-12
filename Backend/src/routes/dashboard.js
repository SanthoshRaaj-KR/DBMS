const express = require('express');
const router = express.Router();
const { checkAdmin } = require('../middleware/auth');
const { asyncHandler, successResponse } = require('../utils/helpers');
const { Patient, Doctor, Appointment, Billing, Payment, MedicalRecord } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.query;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Total counts
  const totalPatients = await Patient.count();
  const totalDoctors = await Doctor.count();
  const totalAppointments = await Appointment.count();

  // Upcoming appointments
  let whereClause = {
    AppointmentDate: { [Op.gte]: today.toISOString().split('T')[0] },
    Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
  };
  
  if (doctorId) whereClause.DoctorID = doctorId;
  if (patientId) whereClause.PatientID = patientId;

  const upcomingAppointments = await Appointment.count({ where: whereClause });

  // Recent appointments
  let recentWhere = {};
  if (doctorId) recentWhere.DoctorID = doctorId;
  if (patientId) recentWhere.PatientID = patientId;

  const recentAppointments = await Appointment.findAll({
    where: recentWhere,
    include: [
      { 
        model: Patient,
        attributes: ['PatientID', 'FirstName', 'LastName']
      },
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName']
      }
    ],
    order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']],
    limit: 10
  });

  // Appointments by status
  const appointmentsByStatus = await Appointment.findAll({
    attributes: [
      'Status',
      [sequelize.fn('COUNT', sequelize.col('AppointmentID')), 'count']
    ],
    group: ['Status']
  });

  successResponse(res, {
    totalPatients,
    totalDoctors,
    totalAppointments,
    upcomingAppointments,
    appointmentsByStatus,
    recentAppointments
  });
}));

// @route   GET /api/dashboard/appointments/today
// @desc    Get today's appointments
// @access  Public
router.get('/appointments/today', asyncHandler(async (req, res) => {
  const { doctorId, patientId } = req.query;
  const today = new Date().toISOString().split('T')[0];
  
  let where = {
    AppointmentDate: today,
    Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
  };

  if (doctorId) where.DoctorID = doctorId;
  if (patientId) where.PatientID = patientId;

  const appointments = await Appointment.findAll({
    where,
    include: [
      { 
        model: Patient,
        attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName', 'ContactNumber']
      },
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName']
      }
    ],
    order: [['AppointmentTime', 'ASC']]
  });

  successResponse(res, appointments);
}));

// @route   GET /api/dashboard/recent-patients
// @desc    Get recently registered patients
// @access  Public
router.get('/recent-patients', asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const patients = await Patient.findAll({
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']],
    attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName', 'ContactNumber', 'Email', 'createdAt']
  });

  successResponse(res, patients);
}));

// @route   GET /api/dashboard/revenue
// @desc    Get revenue statistics
// @access  Admin only
router.get('/revenue', checkAdmin, asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  // Total revenue
  const totalRevenue = await Billing.sum('NetAmount', {
    where: {
      BillingDate: { [Op.gte]: startDate },
      Status: { [Op.notIn]: ['Cancelled'] }
    }
  });

  // Paid amount
  const paidAmount = await Payment.sum('Amount', {
    where: {
      PaymentDate: { [Op.gte]: startDate }
    }
  });

  // Pending amount
  const pendingAmount = await Billing.sum('NetAmount', {
    where: {
      Status: { [Op.in]: ['Pending', 'Partial'] }
    }
  });

  // Revenue by payment method
  const revenueByMethod = await Payment.findAll({
    attributes: [
      'PaymentMethod',
      [sequelize.fn('SUM', sequelize.col('Amount')), 'total'],
      [sequelize.fn('COUNT', sequelize.col('PaymentID')), 'count']
    ],
    where: {
      PaymentDate: { [Op.gte]: startDate }
    },
    group: ['PaymentMethod']
  });

  // Daily revenue
  const dailyRevenue = await Payment.findAll({
    attributes: [
      [sequelize.fn('DATE', sequelize.col('PaymentDate')), 'date'],
      [sequelize.fn('SUM', sequelize.col('Amount')), 'amount']
    ],
    where: {
      PaymentDate: { 
        [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    },
    group: [sequelize.fn('DATE', sequelize.col('PaymentDate'))],
    order: [[sequelize.fn('DATE', sequelize.col('PaymentDate')), 'ASC']]
  });

  successResponse(res, {
    totalRevenue: totalRevenue || 0,
    paidAmount: paidAmount || 0,
    pendingAmount: pendingAmount || 0,
    revenueByMethod,
    dailyRevenue
  });
}));

// @route   GET /api/dashboard/doctor-performance
// @desc    Get doctor performance metrics
// @access  Admin only
router.get('/doctor-performance', checkAdmin, asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const doctorStats = await Doctor.findAll({
    attributes: [
      'DoctorID',
      'FirstName',
      'LastName',
      [sequelize.literal(`(
        SELECT COUNT(*)
        FROM "Appointments"
        WHERE "Appointments"."DoctorID" = "Doctor"."DoctorID"
        AND "Appointments"."AppointmentDate" >= '${startDate.toISOString().split('T')[0]}'
      )`), 'appointmentCount'],
      [sequelize.literal(`(
        SELECT COUNT(*)
        FROM "Appointments"
        WHERE "Appointments"."DoctorID" = "Doctor"."DoctorID"
        AND "Appointments"."Status" = 'Completed'
        AND "Appointments"."AppointmentDate" >= '${startDate.toISOString().split('T')[0]}'
      )`), 'completedCount']
    ],
    order: [[sequelize.literal('appointmentCount'), 'DESC']],
    limit: 10
  });

  successResponse(res, doctorStats);
}));

// @route   GET /api/dashboard/admin/overview
// @desc    Get comprehensive admin dashboard overview
// @access  Admin only
router.get('/admin/overview', checkAdmin, asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Total counts
  const totalPatients = await Patient.count();
  const totalDoctors = await Doctor.count();
  const totalAppointments = await Appointment.count();
  const totalMedicalRecords = await MedicalRecord.count();

  // Appointments by status
  const appointmentsByStatus = await Appointment.findAll({
    attributes: [
      'Status',
      [sequelize.fn('COUNT', sequelize.col('AppointmentID')), 'count']
    ],
    group: ['Status']
  });

  // Recent appointments
  const recentAppointments = await Appointment.findAll({
    include: [
      { 
        model: Patient,
        attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName']
      },
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: 10
  });

  // Upcoming appointments
  const upcomingAppointments = await Appointment.count({
    where: {
      AppointmentDate: { [Op.gte]: today.toISOString().split('T')[0] },
      Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
    }
  });

  // Recent patients
  const recentPatients = await Patient.findAll({
    attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName', 'Email', 'ContactNumber', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 10
  });

  successResponse(res, {
    totals: {
      patients: totalPatients,
      doctors: totalDoctors,
      appointments: totalAppointments,
      medicalRecords: totalMedicalRecords,
      upcomingAppointments
    },
    appointmentsByStatus,
    recentAppointments,
    recentPatients
  });
}));

module.exports = router;

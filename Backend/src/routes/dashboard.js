
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse } = require('../utils/helpers');
const { Patient, Doctor, Appointment, Billing, Payment, MedicalRecord } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (admin, staff, doctor)
router.get('/stats', protect, authorize('admin', 'staff', 'doctor'), asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Total counts
  const totalPatients = await Patient.count();
  const totalDoctors = await Doctor.count();
  const totalAppointments = await Appointment.count();

  // Today's appointments
  const todayAppointments = await Appointment.count({
    where: {
      AppointmentDate: today.toISOString().split('T')[0],
      Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
    }
  });

  // Appointments by status
  const appointmentsByStatus = await Appointment.findAll({
    attributes: [
      'Status',
      [sequelize.fn('COUNT', sequelize.col('AppointmentID')), 'count']
    ],
    group: ['Status']
  });

  // Revenue statistics (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueStats = await Billing.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('NetAmount')), 'totalRevenue'],
      [sequelize.fn('COUNT', sequelize.col('BillingID')), 'totalBills']
    ],
    where: {
      BillingDate: { [Op.gte]: thirtyDaysAgo }
    }
  });

  // Pending payments
  const pendingPayments = await Billing.sum('NetAmount', {
    where: { Status: { [Op.in]: ['Pending', 'Partial'] } }
  });

  // Recent patients (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentPatients = await Patient.count({
    where: {
      createdAt: { [Op.gte]: sevenDaysAgo }
    }
  });

  successResponse(res, {
    totalPatients,
    totalDoctors,
    totalAppointments,
    todayAppointments,
    appointmentsByStatus,
    revenueStats: revenueStats[0] || { totalRevenue: 0, totalBills: 0 },
    pendingPayments: pendingPayments || 0,
    recentPatients
  });
}));

// @route   GET /api/dashboard/appointments/today
// @desc    Get today's appointments
// @access  Private
router.get('/appointments/today', protect, asyncHandler(async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  let where = {
    AppointmentDate: today,
    Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
  };

  // Filter by role
  if (req.user.Role === 'doctor') {
    where.DoctorID = req.user.RefID;
  } else if (req.user.Role === 'patient') {
    where.PatientID = req.user.RefID;
  }

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
// @access  Private (admin, staff, doctor)
router.get('/recent-patients', protect, authorize('admin', 'staff', 'doctor'), asyncHandler(async (req, res) => {
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
// @access  Private (admin, staff)
router.get('/revenue', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
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

  // Daily revenue (last 7 days for chart)
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
// @access  Private (admin, staff)
router.get('/doctor-performance', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
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

module.exports = router;
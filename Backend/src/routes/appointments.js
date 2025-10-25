
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Appointment, Patient, Doctor, Specialization } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const { status, date, doctorId, patientId } = req.query;
  let where = {};
  
  // Filter based on query params
  if (status) where.Status = status;
  if (date) where.AppointmentDate = date;
  if (doctorId) where.DoctorID = doctorId;
  if (patientId) where.PatientID = patientId;
  
  // Role-based filtering
  if (req.user.Role === 'patient') {
    where.PatientID = req.user.RefID;
  } else if (req.user.Role === 'doctor') {
    where.DoctorID = req.user.RefID;
  }

  const appointments = await Appointment.findAll({
    where,
    include: [
      { 
        model: Patient,
        attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName', 'ContactNumber', 'Email']
      },
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName', 'ContactNumber'],
        include: [{ 
          model: Specialization,
          attributes: ['SpecializationID', 'SpecializationName']
        }]
      }
    ],
    order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']]
  });

  successResponse(res, appointments);
}));

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id, {
    include: [
      { model: Patient },
      { 
        model: Doctor,
        include: [{ model: Specialization }]
      }
    ]
  });
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== appointment.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }
  if (req.user.Role === 'doctor' && req.user.RefID !== appointment.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, appointment);
}));

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', protect, [
  body('doctorId').notEmpty().withMessage('Doctor is required'),
  body('appointmentDate').notEmpty().isDate().withMessage('Valid date is required'),
  body('appointmentTime').notEmpty().withMessage('Time is required'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;
  
  // Determine patient ID based on role
  let finalPatientId = patientId;
  if (req.user.Role === 'patient') {
    finalPatientId = req.user.RefID;
  }

  if (!finalPatientId) {
    return errorResponse(res, 'Patient ID is required', 400);
  }

  // Check for conflicting appointments
  const existingAppointment = await Appointment.findOne({
    where: {
      DoctorID: doctorId,
      AppointmentDate: appointmentDate,
      AppointmentTime: appointmentTime,
      Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
    }
  });

  if (existingAppointment) {
    return errorResponse(res, 'This time slot is already booked', 400);
  }

  // Create appointment
  const appointment = await Appointment.create({
    PatientID: finalPatientId,
    DoctorID: doctorId,
    AppointmentDate: appointmentDate,
    AppointmentTime: appointmentTime,
    Status: 'Scheduled',
    Reason: reason,
    Notes: notes
  });

  const appointmentWithDetails = await Appointment.findByPk(appointment.AppointmentID, {
    include: [
      { model: Patient },
      { model: Doctor, include: [{ model: Specialization }] }
    ]
  });

  successResponse(res, appointmentWithDetails, 'Appointment created successfully', 201);
}));

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== appointment.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  // Check for time conflicts if time is being changed
  if (req.body.appointmentDate || req.body.appointmentTime) {
    const newDate = req.body.appointmentDate || appointment.AppointmentDate;
    const newTime = req.body.appointmentTime || appointment.AppointmentTime;
    
    const conflict = await Appointment.findOne({
      where: {
        AppointmentID: { [Op.ne]: appointment.AppointmentID },
        DoctorID: appointment.DoctorID,
        AppointmentDate: newDate,
        AppointmentTime: newTime,
        Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
      }
    });

    if (conflict) {
      return errorResponse(res, 'This time slot is already booked', 400);
    }
  }

  await appointment.update(req.body);
  
  const updatedAppointment = await Appointment.findByPk(appointment.AppointmentID, {
    include: [
      { model: Patient },
      { model: Doctor, include: [{ model: Specialization }] }
    ]
  });

  successResponse(res, updatedAppointment, 'Appointment updated successfully');
}));

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private (doctor, staff, admin)
router.put('/:id/status', protect, authorize('doctor', 'staff', 'admin'), [
  body('status').isIn(['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'])
    .withMessage('Invalid status'),
  validate
], asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Doctors can only update their own appointments
  if (req.user.Role === 'doctor' && req.user.RefID !== appointment.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await appointment.update({ Status: req.body.status });
  
  successResponse(res, appointment, 'Appointment status updated successfully');
}));

// @route   DELETE /api/appointments/:id
// @desc    Cancel/Delete appointment
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== appointment.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }
  if (req.user.Role === 'doctor' && req.user.RefID !== appointment.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  // Soft delete by marking as cancelled
  await appointment.update({ Status: 'Cancelled' });
  
  successResponse(res, null, 'Appointment cancelled successfully');
}));

module.exports = router;


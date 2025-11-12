const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Appointment, Patient, Doctor, Specialization } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { status, date, doctorId, patientId } = req.query;
  let where = {};
  
  // Filter based on query params
  if (status) where.Status = status;
  if (date) where.AppointmentDate = date;
  if (doctorId) where.DoctorID = doctorId;
  if (patientId) where.PatientID = patientId;

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
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
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

  successResponse(res, appointment);
}));

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Public
router.post('/', [
  body('DoctorID').notEmpty().withMessage('Doctor is required'),
  body('PatientID').notEmpty().withMessage('Patient is required'),
  body('AppointmentDate').notEmpty().isDate().withMessage('Valid date is required'),
  body('AppointmentTime').notEmpty().withMessage('Time is required'),
  validate
], asyncHandler(async (req, res) => {
  const { PatientID, DoctorID, AppointmentDate, AppointmentTime, Reason, Notes } = req.body;

  // Check for conflicting appointments
  const existingAppointment = await Appointment.findOne({
    where: {
      DoctorID: DoctorID,
      AppointmentDate: AppointmentDate,
      AppointmentTime: AppointmentTime,
      Status: { [Op.notIn]: ['Cancelled', 'No Show'] }
    }
  });

  if (existingAppointment) {
    return errorResponse(res, 'This time slot is already booked', 400);
  }

  // Create appointment
  const appointment = await Appointment.create({
    PatientID: PatientID,
    DoctorID: DoctorID,
    AppointmentDate: AppointmentDate,
    AppointmentTime: AppointmentTime,
    Status: 'Scheduled',
    Reason: Reason,
    Notes: Notes
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
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Check for time conflicts if time is being changed
  if (req.body.AppointmentDate || req.body.AppointmentTime) {
    const newDate = req.body.AppointmentDate || appointment.AppointmentDate;
    const newTime = req.body.AppointmentTime || appointment.AppointmentTime;
    
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

// @route   DELETE /api/appointments/:id
// @desc    Cancel/Delete appointment
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id);
  
  if (!appointment) {
    return errorResponse(res, 'Appointment not found', 404);
  }

  // Soft delete by marking as cancelled
  await appointment.update({ Status: 'Cancelled' });
  
  successResponse(res, null, 'Appointment cancelled successfully');
}));

module.exports = router;

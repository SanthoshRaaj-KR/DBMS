const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse, paginate, getPaginationMeta } = require('../utils/helpers');
const { Patient, Appointment, MedicalRecord, Billing, Doctor, Specialization } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/patients
// @desc    Get all patients
// @access  Private (admin, staff, doctor)
router.get('/', protect, authorize('admin', 'staff', 'doctor'), asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const { limit: queryLimit, offset } = paginate(page, limit);
  
  let where = {};
  
  if (search) {
    where = {
      [Op.or]: [
        { FirstName: { [Op.iLike]: `%${search}%` } },
        { LastName: { [Op.iLike]: `%${search}%` } },
        { Email: { [Op.iLike]: `%${search}%` } },
        { PatientNumber: { [Op.iLike]: `%${search}%` } }
      ]
    };
  }

  const { count, rows } = await Patient.findAndCountAll({
    where,
    limit: queryLimit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  successResponse(res, {
    patients: rows,
    pagination: getPaginationMeta(page, queryLimit, count)
  });
}));

// @route   GET /api/patients/:id
// @desc    Get single patient
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Patients can only view their own data
  if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, patient);
}));

// @route   POST /api/patients
// @desc    Create new patient
// @access  Private (admin, staff)
router.post('/', protect, authorize('admin', 'staff'), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('contactNumber').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  validate
], asyncHandler(async (req, res) => {
  const patient = await Patient.create(req.body);
  successResponse(res, patient, 'Patient created successfully', 201);
}));

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Patients can only update their own data
  if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await patient.update(req.body);
  successResponse(res, patient, 'Patient updated successfully');
}));

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  await patient.destroy();
  successResponse(res, null, 'Patient deleted successfully');
}));

// @route   GET /api/patients/:id/appointments
// @desc    Get patient's appointments
// @access  Private
router.get('/:id/appointments', protect, asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const appointments = await Appointment.findAll({
    where: { PatientID: req.params.id },
    include: [
      {
        model: Doctor,
        include: [{ model: Specialization }]
      }
    ],
    order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']]
  });

  successResponse(res, appointments);
}));

// @route   GET /api/patients/:id/medical-records
// @desc    Get patient's medical records
// @access  Private
router.get('/:id/medical-records', protect, asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const records = await MedicalRecord.findAll({
    where: { PatientID: req.params.id },
    include: [{ model: Doctor }],
    order: [['VisitDate', 'DESC']]
  });

  successResponse(res, records);
}));

// @route   GET /api/patients/:id/billing
// @desc    Get patient's billing history
// @access  Private
router.get('/:id/billing', protect, asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const bills = await Billing.findAll({
    where: { PatientID: req.params.id },
    include: ['Payments'],
    order: [['BillingDate', 'DESC']]
  });

  successResponse(res, bills);
}));

module.exports = router;
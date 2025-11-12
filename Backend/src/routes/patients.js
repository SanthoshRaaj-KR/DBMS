const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse, paginate, getPaginationMeta, generatePatientNumber } = require('../utils/helpers');
const { Patient, Appointment, MedicalRecord, Billing, Doctor, Specialization } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/patients
// @desc    Get all patients
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
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
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  successResponse(res, patient);
}));

// @route   POST /api/patients
// @desc    Create new patient
// @access  Public
router.post('/', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('contactNumber').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  validate
], asyncHandler(async (req, res) => {
  // Map camelCase to PascalCase for Sequelize model
  const patientData = {
    PatientNumber: generatePatientNumber(),
    FirstName: req.body.firstName || req.body.FirstName,
    LastName: req.body.lastName || req.body.LastName,
    DateOfBirth: req.body.dateOfBirth || req.body.DateOfBirth,
    ContactNumber: req.body.contactNumber || req.body.ContactNumber,
    Email: req.body.email || req.body.Email,
    Address: req.body.address || req.body.Address,
    Gender: req.body.gender || req.body.Gender,
    BloodGroup: req.body.bloodGroup || req.body.BloodGroup
  };
  const patient = await Patient.create(patientData);
  successResponse(res, patient, 'Patient created successfully', 201);
}));

// @route   PUT /api/patients/:id
// @desc    Update patient
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  // Map camelCase to PascalCase for Sequelize model
  const updateData = {};
  if (req.body.firstName !== undefined || req.body.FirstName !== undefined) {
    updateData.FirstName = req.body.firstName || req.body.FirstName;
  }
  if (req.body.lastName !== undefined || req.body.LastName !== undefined) {
    updateData.LastName = req.body.lastName || req.body.LastName;
  }
  if (req.body.dateOfBirth !== undefined || req.body.DateOfBirth !== undefined) {
    updateData.DateOfBirth = req.body.dateOfBirth || req.body.DateOfBirth;
  }
  if (req.body.contactNumber !== undefined || req.body.ContactNumber !== undefined) {
    updateData.ContactNumber = req.body.contactNumber || req.body.ContactNumber;
  }
  if (req.body.email !== undefined || req.body.Email !== undefined) {
    updateData.Email = req.body.email || req.body.Email;
  }
  if (req.body.address !== undefined || req.body.Address !== undefined) {
    updateData.Address = req.body.address || req.body.Address;
  }
  
  await patient.update(updateData);
  successResponse(res, patient, 'Patient updated successfully');
}));

// @route   DELETE /api/patients/:id
// @desc    Delete patient
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  await patient.destroy();
  successResponse(res, null, 'Patient deleted successfully');
}));

// @route   GET /api/patients/:id/appointments
// @desc    Get patient's appointments
// @access  Public
router.get('/:id/appointments', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
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
// @access  Public
router.get('/:id/medical-records', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
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
// @access  Public
router.get('/:id/billing', asyncHandler(async (req, res) => {
  const patient = await Patient.findByPk(req.params.id);
  
  if (!patient) {
    return errorResponse(res, 'Patient not found', 404);
  }

  const bills = await Billing.findAll({
    where: { PatientID: req.params.id },
    include: ['Payments'],
    order: [['BillingDate', 'DESC']]
  });

  successResponse(res, bills);
}));

module.exports = router;
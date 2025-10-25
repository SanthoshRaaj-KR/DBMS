
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse, paginate, getPaginationMeta } = require('../utils/helpers');
const { Doctor, Specialization, Department, Appointment, Patient } = require('../models');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { specializationId, departmentId, page = 1, limit = 10 } = req.query;
  const { limit: queryLimit, offset } = paginate(page, limit);
  
  let where = {};
  
  if (specializationId) where.SpecializationID = specializationId;
  if (departmentId) where.DepartmentID = departmentId;

  const { count, rows } = await Doctor.findAndCountAll({
    where,
    include: [
      { model: Specialization },
      { model: Department }
    ],
    limit: queryLimit,
    offset,
    order: [['FirstName', 'ASC']]
  });

  successResponse(res, {
    doctors: rows,
    pagination: getPaginationMeta(page, queryLimit, count)
  });
}));

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id, {
    include: [
      { model: Specialization },
      { model: Department }
    ]
  });
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  successResponse(res, doctor);
}));

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Private (admin only)
router.post('/', protect, authorize('admin'), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('specializationID').notEmpty().withMessage('Specialization is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  validate
], asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  successResponse(res, doctor, 'Doctor created successfully', 201);
}));

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private (admin, doctor - own profile)
router.put('/:id', protect, authorize('admin', 'doctor'), asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  // Doctors can only update their own profile
  if (req.user.Role === 'doctor' && req.user.RefID !== doctor.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await doctor.update(req.body);
  successResponse(res, doctor, 'Doctor updated successfully');
}));

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  await doctor.destroy();
  successResponse(res, null, 'Doctor deleted successfully');
}));

// @route   GET /api/doctors/:id/appointments
// @desc    Get doctor's appointments
// @access  Private
router.get('/:id/appointments', protect, asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  // Doctors can only view their own appointments
  if (req.user.Role === 'doctor' && req.user.RefID !== doctor.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const { date, status } = req.query;
  let where = { DoctorID: req.params.id };
  
  if (date) where.AppointmentDate = date;
  if (status) where.Status = status;

  const appointments = await Appointment.findAll({
    where,
    include: [{ model: Patient }],
    order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']]
  });

  successResponse(res, appointments);
}));

module.exports = router;
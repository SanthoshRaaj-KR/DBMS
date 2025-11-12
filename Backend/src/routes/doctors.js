const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Doctor, Specialization, Department, Appointment, Patient } = require('../models');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const { specializationId, departmentId } = req.query;
  let where = {};
  
  if (specializationId) where.SpecializationID = specializationId;
  if (departmentId) where.DepartmentID = departmentId;

  const doctors = await Doctor.findAll({
    where,
    include: [
      { model: Specialization, attributes: ['SpecializationID', 'SpecializationName'] },
      { model: Department, attributes: ['DepartmentID', 'DepartmentName'] }
    ],
    order: [['FirstName', 'ASC']]
  });

  successResponse(res, { doctors });
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
// @access  Public
router.post('/', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('specializationID').notEmpty().withMessage('Specialization is required'),
  body('contactNumber').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  validate
], asyncHandler(async (req, res) => {
  const doctorData = {
    FirstName: req.body.firstName || req.body.FirstName,
    LastName: req.body.lastName || req.body.LastName,
    ContactNumber: req.body.contactNumber || req.body.ContactNumber,
    Email: req.body.email || req.body.Email,
    SpecializationID: req.body.specializationID || req.body.SpecializationID,
    DepartmentID: req.body.departmentID || req.body.DepartmentID,
    LicenseNumber: req.body.licenseNumber || req.body.LicenseNumber,
    Qualification: req.body.qualification || req.body.Qualification,
    ExperienceYears: req.body.experienceYears || req.body.ExperienceYears,
    ConsultationFee: req.body.consultationFee || req.body.ConsultationFee
  };

  const doctor = await Doctor.create(doctorData);
  successResponse(res, doctor, 'Doctor created successfully', 201);
}));

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  const updateData = {};
  if (req.body.firstName !== undefined || req.body.FirstName !== undefined) {
    updateData.FirstName = req.body.firstName || req.body.FirstName;
  }
  if (req.body.lastName !== undefined || req.body.LastName !== undefined) {
    updateData.LastName = req.body.lastName || req.body.LastName;
  }
  if (req.body.contactNumber !== undefined || req.body.ContactNumber !== undefined) {
    updateData.ContactNumber = req.body.contactNumber || req.body.ContactNumber;
  }
  if (req.body.email !== undefined || req.body.Email !== undefined) {
    updateData.Email = req.body.email || req.body.Email;
  }
  if (req.body.specializationID !== undefined || req.body.SpecializationID !== undefined) {
    updateData.SpecializationID = req.body.specializationID || req.body.SpecializationID;
  }
  if (req.body.departmentID !== undefined || req.body.DepartmentID !== undefined) {
    updateData.DepartmentID = req.body.departmentID || req.body.DepartmentID;
  }
  if (req.body.licenseNumber !== undefined || req.body.LicenseNumber !== undefined) {
    updateData.LicenseNumber = req.body.licenseNumber || req.body.LicenseNumber;
  }
  if (req.body.qualification !== undefined || req.body.Qualification !== undefined) {
    updateData.Qualification = req.body.qualification || req.body.Qualification;
  }
  if (req.body.experienceYears !== undefined || req.body.ExperienceYears !== undefined) {
    updateData.ExperienceYears = req.body.experienceYears || req.body.ExperienceYears;
  }
  if (req.body.consultationFee !== undefined || req.body.ConsultationFee !== undefined) {
    updateData.ConsultationFee = req.body.consultationFee || req.body.ConsultationFee;
  }

  await doctor.update(updateData);
  successResponse(res, doctor, 'Doctor updated successfully');
}));

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  await doctor.destroy();
  successResponse(res, null, 'Doctor deleted successfully');
}));

// @route   GET /api/doctors/:id/appointments
// @desc    Get doctor's appointments
// @access  Public
router.get('/:id/appointments', asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByPk(req.params.id);
  
  if (!doctor) {
    return errorResponse(res, 'Doctor not found', 404);
  }

  const appointments = await Appointment.findAll({
    where: { DoctorID: req.params.id },
    include: [{ model: Patient }],
    order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']]
  });

  successResponse(res, appointments);
}));

module.exports = router;

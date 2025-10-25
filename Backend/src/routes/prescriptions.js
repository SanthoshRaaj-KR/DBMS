// ============================================
// src/routes/prescriptions.js
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Prescription, Patient, Doctor, MedicalRecord } = require('../models');

// @route   GET /api/prescriptions/patient/:patientId
// @desc    Get patient's prescriptions
// @access  Private
router.get('/patient/:patientId', protect, asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID != req.params.patientId) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const prescriptions = await Prescription.findAll({
    where: { PatientID: req.params.patientId },
    include: [
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName']
      },
      {
        model: MedicalRecord,
        attributes: ['RecordID', 'VisitDate', 'Diagnosis']
      }
    ],
    order: [['PrescriptionDate', 'DESC']]
  });

  successResponse(res, prescriptions);
}));

// @route   GET /api/prescriptions/:id
// @desc    Get single prescription
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByPk(req.params.id, {
    include: [
      { model: Patient },
      { model: Doctor },
      { model: MedicalRecord }
    ]
  });
  
  if (!prescription) {
    return errorResponse(res, 'Prescription not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== prescription.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, prescription);
}));

// @route   POST /api/prescriptions
// @desc    Create prescription
// @access  Private (doctor, admin)
router.post('/', protect, authorize('doctor', 'admin'), [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, medicalRecordId, medications, instructions, validUntil } = req.body;
  
  // Determine doctor ID
  const doctorId = req.user.Role === 'doctor' ? req.user.RefID : req.body.doctorId;
  
  if (!doctorId) {
    return errorResponse(res, 'Doctor ID is required', 400);
  }

  const prescription = await Prescription.create({
    PatientID: patientId,
    DoctorID: doctorId,
    MedicalRecordID: medicalRecordId,
    Medications: medications,
    Instructions: instructions,
    ValidUntil: validUntil,
    Status: 'Active'
  });

  const prescriptionWithDetails = await Prescription.findByPk(prescription.PrescriptionID, {
    include: [
      { model: Patient },
      { model: Doctor }
    ]
  });

  successResponse(res, prescriptionWithDetails, 'Prescription created successfully', 201);
}));

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private (doctor, admin)
router.put('/:id', protect, authorize('doctor', 'admin'), asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByPk(req.params.id);
  
  if (!prescription) {
    return errorResponse(res, 'Prescription not found', 404);
  }

  // Doctors can only update their own prescriptions
  if (req.user.Role === 'doctor' && req.user.RefID !== prescription.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await prescription.update(req.body);
  
  const updatedPrescription = await Prescription.findByPk(prescription.PrescriptionID, {
    include: [
      { model: Patient },
      { model: Doctor }
    ]
  });

  successResponse(res, updatedPrescription, 'Prescription updated successfully');
}));

// @route   DELETE /api/prescriptions/:id
// @desc    Delete prescription
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByPk(req.params.id);
  
  if (!prescription) {
    return errorResponse(res, 'Prescription not found', 404);
  }

  await prescription.destroy();
  successResponse(res, null, 'Prescription deleted successfully');
}));

module.exports = router;

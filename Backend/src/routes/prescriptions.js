// ============================================
// src/routes/prescriptions.js
// ============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Prescription, Patient, Doctor, MedicalRecord } = require('../models');

// @route   GET /api/prescriptions/patient/:patientId
// @desc    Get patient's prescriptions
// @access  Public
router.get('/patient/:patientId', asyncHandler(async (req, res) => {
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
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
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

  successResponse(res, prescription);
}));

// @route   POST /api/prescriptions
// @desc    Create prescription
// @access  Public
router.post('/', [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, doctorId, medicalRecordId, medications, instructions, validUntil } = req.body;

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
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByPk(req.params.id);
  
  if (!prescription) {
    return errorResponse(res, 'Prescription not found', 404);
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
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const prescription = await Prescription.findByPk(req.params.id);
  
  if (!prescription) {
    return errorResponse(res, 'Prescription not found', 404);
  }

  await prescription.destroy();
  successResponse(res, null, 'Prescription deleted successfully');
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { MedicalRecord, Patient, Doctor, Appointment } = require('../models');

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get patient's medical records
// @access  Public
router.get('/patient/:patientId', asyncHandler(async (req, res) => {
  const records = await MedicalRecord.findAll({
    where: { PatientID: req.params.patientId },
    include: [
      { 
        model: Doctor,
        attributes: ['DoctorID', 'FirstName', 'LastName']
      },
      {
        model: Appointment,
        attributes: ['AppointmentID', 'AppointmentDate', 'AppointmentTime']
      }
    ],
    order: [['VisitDate', 'DESC']]
  });

  successResponse(res, records);
}));

// @route   GET /api/medical-records/:id
// @desc    Get single medical record
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByPk(req.params.id, {
    include: [
      { model: Patient },
      { model: Doctor },
      { model: Appointment }
    ]
  });
  
  if (!record) {
    return errorResponse(res, 'Medical record not found', 404);
  }

  successResponse(res, record);
}));

// @route   POST /api/medical-records
// @desc    Create medical record
// @access  Public
router.post('/', [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('symptoms').optional().notEmpty().withMessage('Symptoms cannot be empty'),
  body('diagnosis').optional().notEmpty().withMessage('Diagnosis cannot be empty'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, doctorId, appointmentId, symptoms, diagnosis, treatmentPlan, notes, vitalSigns } = req.body;

  const record = await MedicalRecord.create({
    PatientID: patientId,
    DoctorID: doctorId,
    AppointmentID: appointmentId,
    Symptoms: symptoms,
    Diagnosis: diagnosis,
    TreatmentPlan: treatmentPlan,
    Notes: notes,
    VitalSigns: vitalSigns
  });

  const recordWithDetails = await MedicalRecord.findByPk(record.RecordID, {
    include: [
      { model: Patient },
      { model: Doctor }
    ]
  });

  successResponse(res, recordWithDetails, 'Medical record created successfully', 201);
}));

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByPk(req.params.id);
  
  if (!record) {
    return errorResponse(res, 'Medical record not found', 404);
  }

  await record.update(req.body);
  
  const updatedRecord = await MedicalRecord.findByPk(record.RecordID, {
    include: [
      { model: Patient },
      { model: Doctor }
    ]
  });

  successResponse(res, updatedRecord, 'Medical record updated successfully');
}));

// @route   DELETE /api/medical-records/:id
// @desc    Delete medical record
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByPk(req.params.id);
  
  if (!record) {
    return errorResponse(res, 'Medical record not found', 404);
  }

  await record.destroy();
  successResponse(res, null, 'Medical record deleted successfully');
}));

module.exports = router;

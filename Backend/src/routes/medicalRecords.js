
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { MedicalRecord, Patient, Doctor, Appointment } = require('../models');

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get patient's medical records
// @access  Private
router.get('/patient/:patientId', protect, asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID != req.params.patientId) {
    return errorResponse(res, 'Not authorized', 403);
  }

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
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
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

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== record.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, record);
}));

// @route   POST /api/medical-records
// @desc    Create medical record
// @access  Private (doctor, admin)
router.post('/', protect, authorize('doctor', 'admin'), [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('symptoms').optional().notEmpty().withMessage('Symptoms cannot be empty'),
  body('diagnosis').optional().notEmpty().withMessage('Diagnosis cannot be empty'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, appointmentId, symptoms, diagnosis, treatmentPlan, notes, vitalSigns } = req.body;
  
  // Determine doctor ID
  const doctorId = req.user.Role === 'doctor' ? req.user.RefID : req.body.doctorId;
  
  if (!doctorId) {
    return errorResponse(res, 'Doctor ID is required', 400);
  }

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
// @access  Private (doctor, admin)
router.put('/:id', protect, authorize('doctor', 'admin'), asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByPk(req.params.id);
  
  if (!record) {
    return errorResponse(res, 'Medical record not found', 404);
  }

  // Doctors can only update their own records
  if (req.user.Role === 'doctor' && req.user.RefID !== record.DoctorID) {
    return errorResponse(res, 'Not authorized', 403);
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
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const record = await MedicalRecord.findByPk(req.params.id);
  
  if (!record) {
    return errorResponse(res, 'Medical record not found', 404);
  }

  await record.destroy();
  successResponse(res, null, 'Medical record deleted successfully');
}));

module.exports = router;

const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/medicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { protect, authorize } = require('../middleware/auth');

router.get('/patient/:patientId', protect, async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      where: { PatientID: req.params.patientId },
      include: [
        { model: Doctor, attributes: ['FirstName', 'LastName'] }
      ],
      order: [['VisitDate', 'DESC']]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      ...req.body,
      DoctorID: req.user.Role === 'doctor' ? req.user.RefID : req.body.DoctorID
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

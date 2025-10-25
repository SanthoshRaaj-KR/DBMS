const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// Get all patients with search
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    let where = {};
    
    if (search) {
      where = {
        [Op.or]: [
          { FirstName: { [Op.iLike]: `%${search}%` } },
          { LastName: { [Op.iLike]: `%${search}%` } },
          { Email: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    const patients = await Patient.findAll({
      where,
      order: [['FirstName', 'ASC']]
    });
    
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single patient
router.get('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new patient
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { FirstName, LastName, DateOfBirth, ContactNumber, Email } = req.body;
    
    if (!FirstName) {
      return res.status(400).json({ message: 'First name is required' });
    }
    
    const patient = await Patient.create({
      FirstName,
      LastName,
      DateOfBirth,
      ContactNumber,
      Email
    });
    
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update patient
router.put('/:id', protect, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Check authorization - patients can only update their own data
    if (req.user.Role === 'patient' && req.user.RefID !== patient.PatientID) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await patient.update(req.body);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete patient
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    await patient.destroy();
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');
const DoctorClinic = require('../models/DoctorClinic');
const Clinic = require('../models/Clinic');
const { protect, authorize } = require('../middleware/auth');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const { specializationId } = req.query;
    let where = {};
    
    if (specializationId) {
      where.SpecializationID = specializationId;
    }
    
    const doctors = await Doctor.findAll({
      where,
      include: [
        { 
          model: Specialization, 
          attributes: ['SpecializationID', 'SpecializationName'] 
        }
      ],
      order: [['FirstName', 'ASC']]
    });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single doctor
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        { model: Specialization }
      ]
    });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Get clinics associated with this doctor
    const doctorClinics = await DoctorClinic.findAll({
      where: { DoctorID: req.params.id },
      include: [{ model: Clinic }]
    });
    
    res.json({ ...doctor.toJSON(), clinics: doctorClinics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new doctor
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { FirstName, LastName, ContactNumber, SpecializationID, clinicIds } = req.body;
    
    if (!FirstName || !SpecializationID) {
      return res.status(400).json({ message: 'First name and specialization are required' });
    }
    
    const doctor = await Doctor.create({
      FirstName,
      LastName,
      ContactNumber,
      SpecializationID
    });
    
    // Associate with clinics if provided
    if (clinicIds && Array.isArray(clinicIds)) {
      for (const clinicId of clinicIds) {
        await DoctorClinic.create({
          DoctorID: doctor.DoctorID,
          ClinicID: clinicId
        });
      }
    }
    
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update doctor
router.put('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    await doctor.update(req.body);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete doctor
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Remove doctor-clinic associations
    await DoctorClinic.destroy({ where: { DoctorID: req.params.id } });
    
    await doctor.destroy();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

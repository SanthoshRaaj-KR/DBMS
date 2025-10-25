const express = require('express');
const router = express.Router();
const Clinic = require('../models/Clinic');
const DoctorClinic = require('../models/DoctorClinic');
const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');
const { protect, authorize } = require('../middleware/auth');

// Get all clinics
router.get('/', async (req, res) => {
  try {
    const clinics = await Clinic.findAll({
      order: [['ClinicName', 'ASC']]
    });
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single clinic with doctors
router.get('/:id', async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    // Get doctors associated with this clinic
    const clinicDoctors = await DoctorClinic.findAll({
      where: { ClinicID: req.params.id },
      include: [
        {
          model: Doctor,
          include: [{ model: Specialization }]
        }
      ]
    });
    
    res.json({ ...clinic.toJSON(), doctors: clinicDoctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new clinic
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { ClinicName, Address, ContactNumber, Email } = req.body;
    
    if (!ClinicName) {
      return res.status(400).json({ message: 'Clinic name is required' });
    }
    
    const clinic = await Clinic.create({
      ClinicName,
      Address,
      ContactNumber,
      Email
    });
    
    res.status(201).json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update clinic
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    await clinic.update(req.body);
    res.json(clinic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete clinic
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    
    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }
    
    // Remove doctor-clinic associations
    await DoctorClinic.destroy({ where: { ClinicID: req.params.id } });
    
    await clinic.destroy();
    res.json({ message: 'Clinic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign doctor to clinic
router.post('/:clinicId/doctors/:doctorId', protect, authorize('admin'), async (req, res) => {
  try {
    const existing = await DoctorClinic.findOne({
      where: {
        ClinicID: req.params.clinicId,
        DoctorID: req.params.doctorId
      }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Doctor already assigned to this clinic' });
    }
    
    await DoctorClinic.create({
      ClinicID: req.params.clinicId,
      DoctorID: req.params.doctorId
    });
    
    res.status(201).json({ message: 'Doctor assigned to clinic successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');
const Specialization = require('../models/Specialization');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/', protect, async (req, res) => {
  try {
    const { status, date, doctorId, patientId } = req.query;
    let where = {};
    
    if (status) where.Status = status;
    if (date) where.AppointmentDate = date;
    if (doctorId) where.DoctorID = doctorId;
    if (patientId) where.PatientID = patientId;
    
    if (req.user.Role === 'patient') {
      where.PatientID = req.user.RefID;
    } else if (req.user.Role === 'doctor') {
      where.DoctorID = req.user.RefID;
    }

    const rows = await Appointment.findAll({ 
      where,
      include: [
        { model: Patient, attributes: ['FirstName', 'LastName', 'ContactNumber'] },
        { 
          model: Doctor, 
          attributes: ['FirstName', 'LastName'],
          include: [{ model: Specialization, attributes: ['SpecializationName'] }]
        },
        { model: Clinic, attributes: ['ClinicName', 'Address'] }
      ],
      order: [['AppointmentDate', 'DESC'], ['AppointmentTime', 'DESC']]
    });
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { PatientID, DoctorID, ClinicID, AppointmentDate, AppointmentTime } = req.body;
    
    // Check for conflicts
    const existing = await Appointment.findOne({
      where: {
        DoctorID,
        AppointmentDate,
        AppointmentTime,
        Status: { [Op.ne]: 'Cancelled' }
      }
    });
    
    if (existing) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    const appt = await Appointment.create({
      PatientID: req.user.Role === 'patient' ? req.user.RefID : PatientID,
      DoctorID,
      ClinicID,
      AppointmentDate,
      AppointmentTime,
      Status: 'Scheduled'
    });
    
    res.status(201).json(appt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    
    await appt.update(req.body);
    res.json(appt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'doctor'), async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    
    await appt.destroy();
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

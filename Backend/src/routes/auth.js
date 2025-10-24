const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').notEmpty(),
  body('role').isIn(['patient', 'doctor'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, firstName, lastName, role, contactNumber, dateOfBirth, specializationID } = req.body;
    
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let refID;
    if (role === 'patient') {
      const patient = await Patient.create({ 
        FirstName: firstName, 
        LastName: lastName, 
        Email: email,
        ContactNumber: contactNumber,
        DateOfBirth: dateOfBirth 
      });
      refID = patient.PatientID;
    } else if (role === 'doctor') {
      const doctor = await Doctor.create({ 
        FirstName: firstName, 
        LastName: lastName,
        ContactNumber: contactNumber,
        SpecializationID: specializationID
      });
      refID = doctor.DoctorID;
    }

    const user = await User.create({ 
      Email: email, 
      Password: password, 
      Role: role,
      RefID: refID 
    });

    const token = user.getSignedJwtToken();
    res.status(201).json({ success: true, token, role: user.Role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ where: { Email: email } });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();
    res.json({ success: true, token, role: user.Role, refID: user.RefID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', require('../middleware/auth').protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;

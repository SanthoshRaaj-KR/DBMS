
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { User, Patient, Doctor, Staff } = require('../models');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('role').isIn(['patient', 'doctor', 'staff']).withMessage('Invalid role'),
  validate
], asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, contactNumber, dateOfBirth, specializationID, departmentID, position } = req.body;
  
  // Check if user exists
  const existingUser = await User.findOne({ where: { Email: email } });
  if (existingUser) {
    return errorResponse(res, 'User already exists', 400);
  }

  let refID;
  
  // Create role-specific record
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
    if (!specializationID) {
      return errorResponse(res, 'Specialization is required for doctors', 400);
    }
    const doctor = await Doctor.create({
      FirstName: firstName,
      LastName: lastName,
      ContactNumber: contactNumber,
      Email: email,
      SpecializationID: specializationID,
      DepartmentID: departmentID
    });
    refID = doctor.DoctorID;
  } else if (role === 'staff') {
    const staff = await Staff.create({
      FirstName: firstName,
      LastName: lastName,
      ContactNumber: contactNumber,
      Email: email,
      DepartmentID: departmentID,
      Position: position
    });
    refID = staff.StaffID;
  }

  // Create user account
  const user = await User.create({
    Email: email,
    Password: password,
    Role: role,
    RefID: refID
  });

  const token = user.getSignedJwtToken();

  successResponse(res, {
    token,
    user: {
      id: user.UserID,
      email: user.Email,
      role: user.Role,
      refId: user.RefID
    }
  }, 'Registration successful', 201);
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ where: { Email: email } });
  if (!user) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check if account is active
  if (!user.IsActive) {
    return errorResponse(res, 'Account is inactive', 401);
  }

  // Update last login
  await user.update({ LastLogin: new Date() });

  const token = user.getSignedJwtToken();

  successResponse(res, {
    token,
    user: {
      id: user.UserID,
      email: user.Email,
      role: user.Role,
      refId: user.RefID
    }
  }, 'Login successful');
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  let userData = {
    id: req.user.UserID,
    email: req.user.Email,
    role: req.user.Role,
    refId: req.user.RefID,
    isActive: req.user.IsActive,
    lastLogin: req.user.LastLogin
  };

  // Get additional details based on role
  if (req.user.Role === 'patient') {
    const patient = await Patient.findByPk(req.user.RefID);
    userData.profile = patient;
  } else if (req.user.Role === 'doctor') {
    const doctor = await Doctor.findByPk(req.user.RefID, {
      include: ['Specialization', 'Department']
    });
    userData.profile = doctor;
  } else if (req.user.Role === 'staff') {
    const staff = await Staff.findByPk(req.user.RefID, {
      include: ['Department']
    });
    userData.profile = staff;
  }

  successResponse(res, userData);
}));

// @route   PUT /api/auth/update-password
// @desc    Update password
// @access  Private
router.put('/update-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validate
], asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByPk(req.user.UserID);
  
  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 401);
  }

  // Update password
  user.Password = newPassword;
  await user.save();

  successResponse(res, null, 'Password updated successfully');
}));

module.exports = router;
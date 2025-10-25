
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Staff, Department } = require('../models');

// @route   GET /api/staff
// @desc    Get all staff
// @access  Private (admin, staff)
router.get('/', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const { departmentId, position } = req.query;
  let where = {};
  
  if (departmentId) where.DepartmentID = departmentId;
  if (position) where.Position = position;

  const staffList = await Staff.findAll({
    where,
    include: [{ model: Department }],
    order: [['FirstName', 'ASC']]
  });

  successResponse(res, staffList);
}));

// @route   GET /api/staff/:id
// @desc    Get single staff member
// @access  Private (admin, staff)
router.get('/:id', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const staff = await Staff.findByPk(req.params.id, {
    include: [{ model: Department }]
  });
  
  if (!staff) {
    return errorResponse(res, 'Staff member not found', 404);
  }

  // Staff can only view their own profile unless admin
  if (req.user.Role === 'staff' && req.user.RefID !== staff.StaffID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, staff);
}));

// @route   POST /api/staff
// @desc    Create new staff member
// @access  Private (admin only)
router.post('/', protect, authorize('admin'), [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  validate
], asyncHandler(async (req, res) => {
  const staff = await Staff.create(req.body);
  successResponse(res, staff, 'Staff member created successfully', 201);
}));

// @route   PUT /api/staff/:id
// @desc    Update staff member
// @access  Private (admin, staff - own profile)
router.put('/:id', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const staff = await Staff.findByPk(req.params.id);
  
  if (!staff) {
    return errorResponse(res, 'Staff member not found', 404);
  }

  // Staff can only update their own profile
  if (req.user.Role === 'staff' && req.user.RefID !== staff.StaffID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  await staff.update(req.body);
  successResponse(res, staff, 'Staff member updated successfully');
}));

// @route   DELETE /api/staff/:id
// @desc    Delete staff member
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const staff = await Staff.findByPk(req.params.id);
  
  if (!staff) {
    return errorResponse(res, 'Staff member not found', 404);
  }

  await staff.destroy();
  successResponse(res, null, 'Staff member deleted successfully');
}));

module.exports = router;